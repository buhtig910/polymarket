# Polymarket MCP Setup Script
# Run this script to install and configure MCP servers

Write-Host "Setting up MCP servers for Polymarket project..." -ForegroundColor Green

# Create data directory
if (!(Test-Path "data")) {
    New-Item -ItemType Directory -Path "data"
    Write-Host "Created data directory" -ForegroundColor Yellow
}

# Install core MCP servers (no API keys required)
Write-Host "Installing core MCP servers..." -ForegroundColor Blue

$servers = @(
    "@theobrigitte/mcp-time",
    "@zeparhyfar/mcp-datetime",
    "@wong2/mcp-cli"
)

foreach ($server in $servers) {
    Write-Host "Installing $server..." -ForegroundColor Cyan
    npm install -g $server
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $server installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install $server" -ForegroundColor Red
    }
}

# Create environment file if it doesn't exist
if (!(Test-Path ".env")) {
    Copy-Item "env.example" ".env"
    Write-Host "Created .env file from template" -ForegroundColor Yellow
    Write-Host "Note: API keys are optional for these MCP servers" -ForegroundColor Yellow
}

# Initialize SQLite database
if (!(Test-Path "data/polymarket.db")) {
    New-Item -ItemType File -Path "data/polymarket.db"
    Write-Host "Created SQLite database" -ForegroundColor Yellow
}

Write-Host "MCP setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure mcp-config.json if needed" -ForegroundColor White
Write-Host "2. Run 'npm start' to begin" -ForegroundColor White
Write-Host "3. All MCP servers are ready to use without API keys!" -ForegroundColor Green
