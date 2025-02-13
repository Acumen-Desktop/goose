import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import { JSDOM } from "jsdom";
import { convertHtmlToMarkdown } from "dom-to-semantic-markdown";
function extractWikipediaContent(document, url) {
  const content = document.querySelector(".mw-parser-output");
  if (!content) {
    throw new Error("Could not find article content.");
  }
  const title = document.querySelector("h1")?.textContent || url.split("/").pop()?.replace(/_/g, " ") || "Untitled Article";
  const firstParagraph = content.querySelector("p:not(.mw-empty-elt)");
  const excerpt = firstParagraph?.textContent?.trim();
  const infobox = content.querySelector(".infobox");
  const infoboxContent = infobox?.innerHTML;
  return {
    title,
    content: content.innerHTML,
    ...excerpt && { excerpt },
    ...infoboxContent && { infobox: infoboxContent }
  };
}
const server = new McpServer({
  name: "wiki",
  version: "1.0.0"
});
server.tool(
  "read_wikipedia_article",
  {
    url: z.string().url().refine(
      (url) => url.includes("wikipedia.org"),
      "URL must be from wikipedia.org"
    )
  },
  async ({ url }) => {
    try {
      const mobileUrl = url.replace("wikipedia.org", "m.wikipedia.org");
      const response = await axios.get(mobileUrl, {
        timeout: 1e4,
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1"
        }
      });
      if (response.status !== 200) {
        throw new Error(`Failed to retrieve the article. HTTP status code: ${response.status}`);
      }
      const dom = new JSDOM(response.data, { url: mobileUrl });
      const article = extractWikipediaContent(dom.window.document, mobileUrl);
      const markdown = convertHtmlToMarkdown(article.content, {
        overrideDOMParser: new dom.window.DOMParser(),
        extractMainContent: true,
        enableTableColumnTracking: true,
        includeMetaData: "basic",
        refifyUrls: true
      });
      const sections = [
        `# ${article.title}`,
        "",
        article.excerpt ? `> ${article.excerpt}
` : "",
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
        if (error.message.includes("ECONNABORTED")) {
          throw new Error("INTERNAL_ERROR: Request timed out");
        }
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error("INVALID_PARAMS: Article not found");
          }
          throw new Error(`INTERNAL_ERROR: Network error: ${error.message}`);
        }
        if (error.message.includes("URL must be from wikipedia.org")) {
          throw new Error(`INVALID_PARAMS: ${error.message}`);
        }
        throw new Error(`INTERNAL_ERROR: ${error.message}`);
      }
      throw error;
    }
  }
);
const transport = new StdioServerTransport();
await server.connect(transport);
//# sourceMappingURL=server.js.map
