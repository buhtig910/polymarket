// Test script for Polymarket MCP server
const { spawn } = require('child_process');

// Test the MCP server with Polymarket data extraction
async function testPolymarketMCP() {
  console.log('Testing Polymarket MCP Server...\n');

  const server = spawn('node', ['local-mcp-server.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test messages
  const testMessages = [
    // Initialize
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {}
    },
    // List tools
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    },
    // Scrape all categories
    {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'scrape_all_categories',
        arguments: {}
      }
    },
    // Get top Politics markets
    {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'get_top_markets_by_category',
        arguments: {
          category: 'Politics'
        }
      }
    },
    // Get top Crypto markets
    {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'get_top_markets_by_category',
        arguments: {
          category: 'Crypto'
        }
      }
    }
  ];

  let messageCount = 0;

  server.stdout.on('data', (data) => {
    const response = JSON.parse(data.toString());
    console.log(`Response ${response.id}:`, JSON.stringify(response, null, 2));
    console.log('---\n');
  });

  server.stderr.on('data', (data) => {
    console.log('Server log:', data.toString());
  });

  // Send test messages
  const sendNextMessage = () => {
    if (messageCount < testMessages.length) {
      const message = testMessages[messageCount];
      console.log(`Sending message ${messageCount + 1}:`, JSON.stringify(message, null, 2));
      server.stdin.write(JSON.stringify(message) + '\n');
      messageCount++;
      
      // Send next message after a delay
      setTimeout(sendNextMessage, 2000);
    } else {
      // Close the server
      setTimeout(() => {
        server.kill();
        console.log('Test completed!');
      }, 2000);
    }
  };

  // Start sending messages
  setTimeout(sendNextMessage, 1000);
}

// Run the test
testPolymarketMCP().catch(console.error);
