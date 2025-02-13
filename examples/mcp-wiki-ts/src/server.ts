import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import { JSDOM } from "jsdom";
import { convertHtmlToMarkdown } from "dom-to-semantic-markdown";

interface WikipediaArticle {
  title: string;
  content: string;
  excerpt?: string;
  infobox?: string;
}

/**
 * Extract Wikipedia article content from HTML
 * @param document - The DOM document to extract from
 * @param url - The source URL
 * @returns Extracted article content
 */
function extractWikipediaContent(document: Document, url: string): WikipediaArticle {
  // Get the main content
  const content = document.querySelector('.mw-parser-output');
  if (!content) {
    throw new Error("Could not find article content.");
  }

  // Get the title
  const title = document.querySelector('h1')?.textContent || 
                url.split('/').pop()?.replace(/_/g, ' ') || 
                'Untitled Article';

  // Get the first paragraph as excerpt
  const firstParagraph = content.querySelector('p:not(.mw-empty-elt)');
  const excerpt = firstParagraph?.textContent?.trim();

  // Get the infobox if present
  const infobox = content.querySelector('.infobox');
  const infoboxContent = infobox?.innerHTML;

  return {
    title,
    content: content.innerHTML,
    ...(excerpt && { excerpt }),
    ...(infoboxContent && { infobox: infoboxContent })
  };
}

// Initialize MCP server
const server = new McpServer({
  name: "wiki",
  version: "1.0.0"
});

// Define the Wikipedia article reader tool
server.tool(
  "read_wikipedia_article",
  { 
    url: z.string()
      .url()
      .refine(
        url => url.includes('wikipedia.org'), 
        'URL must be from wikipedia.org'
      )
  },
  async ({ url }) => {
    try {
      // Convert to mobile URL for cleaner content
      const mobileUrl = url.replace('wikipedia.org', 'm.wikipedia.org');

      // Fetch article
      const response = await axios.get(mobileUrl, { 
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1"
        }
      });
      
      if (response.status !== 200) {
        throw new Error(`Failed to retrieve the article. HTTP status code: ${response.status}`);
      }

      // Parse content
      const dom = new JSDOM(response.data, { url: mobileUrl });
      const article = extractWikipediaContent(dom.window.document, mobileUrl);

      // Convert to markdown
      const markdown = convertHtmlToMarkdown(article.content, {
        overrideDOMParser: new dom.window.DOMParser(),
        extractMainContent: true,
        enableTableColumnTracking: true,
        includeMetaData: "basic",
        refifyUrls: true
      });

      // Format content
      const sections = [
        `# ${article.title}`,
        "",
        article.excerpt ? `> ${article.excerpt}\n` : "",
        article.infobox ? convertHtmlToMarkdown(article.infobox, {
          overrideDOMParser: new dom.window.DOMParser(),
          extractMainContent: true
        }) : "",
        markdown
      ].filter(Boolean);

      return {
        content: [{ 
          type: "text", 
          text: sections.join("\n")
        }]
      };

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('ECONNABORTED')) {
          throw new Error('INTERNAL_ERROR: Request timed out');
        }
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error('INVALID_PARAMS: Article not found');
          }
          throw new Error(`INTERNAL_ERROR: Network error: ${error.message}`);
        }
        if (error.message.includes('URL must be from wikipedia.org')) {
          throw new Error(`INVALID_PARAMS: ${error.message}`);
        }
        throw new Error(`INTERNAL_ERROR: ${error.message}`);
      }
      throw error;
    }
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
