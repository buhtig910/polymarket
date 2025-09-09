# MCP Servers for Polymarket (No API Keys Required)

Based on the [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) collection, here are MCP servers that work without API keys:

## Core Data & Analysis Servers

### 1. File System & Storage
- **@modelcontextprotocol/server-filesystem** - File management for project assets
- **@modelcontextprotocol/server-sqlite** - Local data storage for market data

### 2. Web Scraping
- **@modelcontextprotocol/server-web-scraper** - Extract data from Polymarket pages

### 3. Time & Scheduling
- **@theobrigitte/mcp-time** - Time utilities for market deadlines
- **@zeparhyfar/mcp-datetime** - Date/time functions for market events

## Development & Productivity

### 4. Development Tools
- **@wong2/mcp-cli** - MCP testing and debugging

## Installation Commands

```bash
# Core servers (no API keys required)
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-sqlite
npm install -g @modelcontextprotocol/server-web-scraper
npm install -g @theobrigitte/mcp-time
npm install -g @zeparhyfar/mcp-datetime
npm install -g @wong2/mcp-cli
```

## Configuration

These servers are configured in your `mcp-config.json` file and work immediately without any API keys or external authentication.
