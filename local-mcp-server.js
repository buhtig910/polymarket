// Local MCP Server for Polymarket
// This is a simple MCP server implementation that works without external MCP packages

const fs = require('fs').promises;
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class PolymarketMCPServer {
  constructor() {
    this.db = null;
    this.setupDatabase();
  }

  async setupDatabase() {
    try {
      // Ensure data directory exists
      await fs.mkdir('./data', { recursive: true });
      
      // Initialize SQLite database
      this.db = new sqlite3.Database('./data/polymarket.db');
      
      // Create tables for market data
      this.db.serialize(() => {
        this.db.run(`
          CREATE TABLE IF NOT EXISTS markets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            end_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        this.db.run(`
          CREATE TABLE IF NOT EXISTS market_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            market_id INTEGER,
            price REAL,
            volume REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (market_id) REFERENCES markets (id)
          )
        `);
      });
      
      console.error('Database initialized successfully');
    } catch (error) {
      console.error('Database setup error:', error);
    }
  }

  // Handle MCP protocol messages
  async handleMessage(message) {
    try {
      const data = JSON.parse(message);
      
      switch (data.method) {
        case 'tools/list':
          return this.listTools();
        
        case 'tools/call':
          return await this.callTool(data.params);
        
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id: data.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: {}
              },
              serverInfo: {
                name: 'polymarket-mcp-server',
                version: '1.0.0'
              }
            }
          };
        
        default:
          return {
            jsonrpc: '2.0',
            id: data.id,
            error: {
              code: -32601,
              message: 'Method not found'
            }
          };
      }
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: 'Parse error'
        }
      };
    }
  }

  listTools() {
    return {
      jsonrpc: '2.0',
      result: {
        tools: [
          {
            name: 'get_current_time',
            description: 'Get the current time in various formats',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  description: 'Time format (iso, unix, readable)',
                  default: 'iso'
                }
              }
            }
          },
          {
            name: 'calculate_time_difference',
            description: 'Calculate time difference between two dates',
            inputSchema: {
              type: 'object',
              properties: {
                start_date: {
                  type: 'string',
                  description: 'Start date (ISO format)'
                },
                end_date: {
                  type: 'string',
                  description: 'End date (ISO format)'
                }
              },
              required: ['start_date', 'end_date']
            }
          },
          {
            name: 'read_file',
            description: 'Read contents of a file',
            inputSchema: {
              type: 'object',
              properties: {
                file_path: {
                  type: 'string',
                  description: 'Path to the file to read'
                }
              },
              required: ['file_path']
            }
          },
          {
            name: 'write_file',
            description: 'Write content to a file',
            inputSchema: {
              type: 'object',
              properties: {
                file_path: {
                  type: 'string',
                  description: 'Path to the file to write'
                },
                content: {
                  type: 'string',
                  description: 'Content to write to the file'
                }
              },
              required: ['file_path', 'content']
            }
          },
          {
            name: 'add_market',
            description: 'Add a new market to the database',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Market title'
                },
                description: {
                  type: 'string',
                  description: 'Market description'
                },
                end_date: {
                  type: 'string',
                  description: 'Market end date (ISO format)'
                }
              },
              required: ['title']
            }
          },
          {
            name: 'get_markets',
            description: 'Get all markets from the database',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'add_market_data',
            description: 'Add market data (price, volume)',
            inputSchema: {
              type: 'object',
              properties: {
                market_id: {
                  type: 'number',
                  description: 'Market ID'
                },
                price: {
                  type: 'number',
                  description: 'Market price'
                },
                volume: {
                  type: 'number',
                  description: 'Trading volume'
                }
              },
              required: ['market_id', 'price']
            }
          }
        ]
      }
    };
  }

  async callTool(params) {
    const { name, arguments: args } = params;

    try {
      let result;
      
      switch (name) {
        case 'get_current_time':
          result = await this.getCurrentTime(args.format || 'iso');
          break;
        
        case 'calculate_time_difference':
          result = await this.calculateTimeDifference(args.start_date, args.end_date);
          break;
        
        case 'read_file':
          result = await this.readFile(args.file_path);
          break;
        
        case 'write_file':
          result = await this.writeFile(args.file_path, args.content);
          break;
        
        case 'add_market':
          result = await this.addMarket(args.title, args.description, args.end_date);
          break;
        
        case 'get_markets':
          result = await this.getMarkets();
          break;
        
        case 'add_market_data':
          result = await this.addMarketData(args.market_id, args.price, args.volume);
          break;
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        jsonrpc: '2.0',
        id: params.id,
        result: {
          content: [
            {
              type: 'text',
              text: result
            }
          ]
        }
      };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: params.id,
        error: {
          code: -32603,
          message: error.message
        }
      };
    }
  }

  async getCurrentTime(format) {
    const now = new Date();
    let timeString;

    switch (format) {
      case 'unix':
        timeString = Math.floor(now.getTime() / 1000).toString();
        break;
      case 'readable':
        timeString = now.toLocaleString();
        break;
      case 'iso':
      default:
        timeString = now.toISOString();
        break;
    }

    return `Current time (${format}): ${timeString}`;
  }

  async calculateTimeDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    return `Time difference between ${startDate} and ${endDate}:\n` +
           `- Days: ${diffDays}\n` +
           `- Hours: ${diffHours}\n` +
           `- Minutes: ${diffMinutes}\n` +
           `- Milliseconds: ${diffMs}`;
  }

  async readFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return `File content of ${filePath}:\n\n${content}`;
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content, 'utf8');
      return `Successfully wrote content to ${filePath}`;
    } catch (error) {
      throw new Error(`Failed to write file: ${error.message}`);
    }
  }

  async addMarket(title, description, endDate) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO markets (title, description, end_date) VALUES (?, ?, ?)',
        [title, description || null, endDate || null],
        function(err) {
          if (err) {
            reject(new Error(`Failed to add market: ${err.message}`));
          } else {
            resolve(`Market added with ID: ${this.lastID}`);
          }
        }
      );
    });
  }

  async getMarkets() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM markets ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(new Error(`Failed to get markets: ${err.message}`));
        } else {
          const markets = rows.map(row => 
            `ID: ${row.id}, Title: ${row.title}, Description: ${row.description || 'N/A'}, End Date: ${row.end_date || 'N/A'}`
          ).join('\n');
          resolve(`Markets:\n${markets || 'No markets found'}`);
        }
      });
    });
  }

  async addMarketData(marketId, price, volume) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO market_data (market_id, price, volume) VALUES (?, ?, ?)',
        [marketId, price, volume || null],
        function(err) {
          if (err) {
            reject(new Error(`Failed to add market data: ${err.message}`));
          } else {
            resolve(`Market data added with ID: ${this.lastID}`);
          }
        }
      );
    });
  }

  async run() {
    console.error('Polymarket MCP Server running on stdio');
    
    // Handle stdin input
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', async (chunk) => {
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = await this.handleMessage(line);
            if (response) {
              console.log(JSON.stringify(response));
            }
          } catch (error) {
            console.error('Error processing message:', error);
          }
        }
      }
    });
  }
}

// Start the server
const server = new PolymarketMCPServer();
server.run().catch(console.error);
