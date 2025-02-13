# MCP Wiki TypeScript Example

This is a TypeScript implementation of the MCP Wiki example that provides a tool for reading Wikipedia articles and converting them to Markdown format.

## Features

- Fetches Wikipedia articles from provided URLs
- Converts HTML content to Markdown
- Handles errors gracefully with appropriate MCP error types
- Uses TypeScript for type safety and better development experience

## Setup

1. Make sure you have Yarn 4.5.0 installed
2. Install dependencies:
   ```bash
   yarn
   ```

## Running the Server

Start the server in development mode with auto-reload:
```bash
yarn dev
```

Or run the production build:
```bash
yarn build
yarn start
```

## Usage

The server exposes a single tool `read_wikipedia_article` that accepts a Wikipedia URL and returns the article content in Markdown format.

Example usage:
```typescript
read_wikipedia_article("https://en.wikipedia.org/wiki/TypeScript")
```

## Error Handling

The server handles various error cases:
- Invalid URL format
- Network/connection errors
- Invalid Wikipedia page structure
- Unexpected errors

Each error is mapped to appropriate MCP error types (INVALID_PARAMS or INTERNAL_ERROR).
