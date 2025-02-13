import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { JSDOM } from "jsdom";

async function testWikiResponse() {
    try {
        // Make the request with mobile user agent
        const response = await axios.get("https://en.m.wikipedia.org/wiki/TypeScript", {
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1"
            }
        });

        // Parse the HTML
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        // Find the main content
        const content = document.querySelector('.mw-parser-output');
        const mainContent = content ? content.innerHTML : 'Content not found';

        // Save both the raw HTML and the extracted content
        await Promise.all([
            fs.writeFile(
                path.join(process.cwd(), "wiki-response.html"), 
                response.data,
                "utf-8"
            ),
            fs.writeFile(
                path.join(process.cwd(), "wiki-content.html"),
                mainContent,
                "utf-8"
            )
        ]);

        // Log some basic info
        console.log("Response received:");
        console.log("Status:", response.status);
        console.log("Content type:", response.headers["content-type"]);
        console.log("Content length:", response.data.length);
        
        // Log the first 500 characters of the extracted content
        console.log("\nFirst 500 characters of extracted content:");
        console.log(mainContent.substring(0, 500));
        
        console.log("\nFull response saved to wiki-response.html");
        console.log("Extracted content saved to wiki-content.html");
    } catch (error) {
        console.error("Error:", error);
    }
}

testWikiResponse();
