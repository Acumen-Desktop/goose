Based on the documentation and code I've reviewed, I can explain how to access Goose's API endpoints from Node.js. Goose follows the Model Cont
ext Protocol (MCP) for its extensions and API interactions. Here's what you need to know:

1. **MCP Server Integration**
- Goose extensions are implemented as MCP servers
- You can interact with them using the MCP protocol
- The base functionality is exposed through command-line tools and MCP servers

2. **Main Ways to Access APIs**:

a) **Using NPX with MCP Inspector**:
```bash
npx @modelcontextprotocol/inspector cargo run -p mcp-server
```
This allows you to inspect and test available endpoints through a browser interface.

b) **Direct MCP Server Integration**:
You can add MCP servers as extensions using Node.js packages. For example:

```bash
npx -y @modelcontextprotocol/server-github  # For GitHub integration
uvx mcp-server-fetch  # For the Fetch extension
```

3. **Built-in Extension APIs**:
The following extensions provide APIs you can access:
- Developer Tools
- Computer Controller 
- Memory
- JetBrains
- Google Drive

4. **Adding Custom Extensions**:
You can create your own Node.js based extensions by:
1. Creating an MCP server
2. Adding it to your Goose configuration
3. Accessing it via the MCP protocol

5. **Configuration**:
Extensions can be configured in `~/.config/goose/config.yaml`:
```yaml
extensions:
  your-extension:
    name: YourExtension
    cmd: npx
    args: [-y @your/extension-package]
    enabled: true
    envs: { "YOUR_ENV_VAR": "<value>" }
    type: stdio
```

6. **Environment Variables**:
You can pass environment variables to the extensions for authentication and configuration.

For more detailed implementation examples and access to specific endpoints, I recommend:
1. Using the MCP Inspector to explore available endpoints
2. Checking the [MCP Server Directory](https://github.com/modelcontextprotocol/servers)
3. Reading the specific extension documentation for the APIs you want to access
