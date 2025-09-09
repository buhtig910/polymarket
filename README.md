# Polymarket MCP Integration

This project integrates Model Context Protocol (MCP) servers to enhance Polymarket data analysis and automation capabilities.

## MCP Servers Included (No API Keys Required)

### Core Servers
- **File System**: Access and manage project files
- **SQLite**: Store and query market data locally
- **Web Scraper**: Extract data from Polymarket and other sources

### Utility Servers
- **Time/DateTime**: Handle time-based market data and predictions
- **CLI Tools**: Testing and debugging MCP servers

## Setup

1. Install MCP servers:
```bash
npm run install-mcp
```

2. Set up the database:
```bash
npm run setup-db
```

3. Configure environment variables (optional):
```bash
# Copy and edit the environment file (API keys are optional)
cp .env.example .env
```

4. Start the application:
```bash
npm start
```

## Configuration

Edit `mcp-config.json` to customize MCP server settings. Each server can be configured with specific parameters and environment variables.

## API References

- Polymarket Quickstart: https://docs.polymarket.com/quickstart/introduction/main
- Polymarket API: https://gamma-api.polymarket.com/

## MCP Server Sources

This project uses MCP servers from the [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) collection.
