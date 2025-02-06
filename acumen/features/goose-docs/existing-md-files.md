# Goose Project Documentation Map

This document provides a comprehensive overview of all markdown documentation files in the Goose project, organized by their location and purpose.

## Project Root Documentation
- `README.md` - Main project documentation and getting started guide
- `ARCHITECTURE.md` - High-level architectural overview of the project
- `CONTRIBUTING.md` - Guidelines for contributing to the project
- `SECURITY.md` - Security policies and reporting vulnerabilities
- `ACCEPTABLE_USAGE.md` - Usage policies and guidelines
- `run_cross_local.md` - Instructions for cross-local development

## Documentation Directory (`/documentation`)
### Main Documentation (`/documentation/docs`)
#### Getting Started
- `/getting-started/installation.md` - Installation instructions
- `/getting-started/providers.md` - Information about supported providers
- `/getting-started/using-extensions.md` - Guide to using extensions

#### Architecture
- `/goose-architecture/goose-architecture.md` - Detailed architecture documentation
- `/goose-architecture/extensions-design.md` - Extension system design
- `/goose-architecture/error-handling.md` - Error handling patterns

#### Guides
- `/guides/using-goosehints.md` - Guide to using Goose hints
- `/guides/tips.md` - General usage tips and best practices
- `/guides/managing-goose-sessions.md` - Session management guide
- `/guides/handling-llm-rate-limits-with-goose.md` - Rate limit handling
- `/guides/goose-cli-commands.md` - CLI command reference
- `/guides/file-management.md` - File management guidelines

#### Tutorials
- `/tutorials/github-mcp.md` - GitHub MCP integration tutorial
- `/tutorials/custom-extensions.md` - Creating custom extensions
- `/tutorials/_template_.md` - Tutorial template

#### General
- `/troubleshooting.md` - Troubleshooting guide
- `/quickstart.md` - Quick start guide

### Blog Posts (`/documentation/blog`)
- `2025-01-28-introducing-codename-goose/index.md` - Project introduction
- `2024-12-11-resolving-ci-issues-with-goose-a-practical-walkthrough/index.md` - CI issues resolution
- `2024-12-10-connecting-ai-agents-to-your-systems-with-mcp/index.md` - MCP integration guide
- `2024-12-06-previewing-goose-v10-beta/index.md` - v1.0 beta preview
- `2024-11-22-screenshot-driven-development/index.md` - Screenshot-driven development

## Examples
### MCP Wiki Example (`/examples/mcp-wiki`)
- `README.md` - Documentation for the MCP Wiki example project
Important for next session: This example demonstrates practical implementation of MCP (Message Control Protocol) with Goose.

## Crates Documentation
### Core Crates
- `/crates/goose/src/prompts/*.md` - Core prompt templates
  - `system.md` - System prompt template
  - `plan.md` - Planning prompt template
  - `mock.md` - Mock prompt template
- `/crates/goose-mcp/README.md` - MCP implementation documentation
- `/crates/mcp-server/README.md` - MCP server documentation
- `/crates/mcp-client/README.md` - MCP client documentation

## UI Documentation
### Desktop UI (`/ui/desktop`)
- `README.md` - Desktop UI documentation
- `/helper-scripts/README.md` - Helper scripts documentation
- `/src/ai-sdk-fork/README.md` - AI SDK documentation

## Extension Site
- `/extensions-site/README.md` - Documentation for the extensions site

## Notes for MCP Wiki Example Project
The MCP Wiki example project (`/examples/mcp-wiki`) will be our focus for the next session. Key points:
1. Located in `/examples/mcp-wiki`
2. Demonstrates practical implementation of Message Control Protocol (MCP)
3. Shows integration between Goose and external systems
4. Complete with its own README for setup and usage

I'll store detailed knowledge of this example project structure to assist effectively in our next session.

---
*This index was automatically generated to provide quick access to all markdown documentation in the Goose project. Use this as a reference to locate specific documentation topics.*