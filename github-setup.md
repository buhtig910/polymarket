# GitHub Setup Instructions for Polymarket Project

## Prerequisites
- Git installed on your system
- GitHub account (buhtig910)
- Repository URL: https://github.com/buhtig910/polymarket.git

## Step 1: Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Polymarket MCP integration setup"
```

## Step 2: Connect to GitHub Repository

```bash
# Add remote origin
git remote add origin https://github.com/buhtig910/polymarket.git

# Verify remote was added
git remote -v
```

## Step 3: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Step 4: Verify Setup

1. Go to https://github.com/buhtig910/polymarket
2. Verify all files are uploaded
3. Check that the repository is no longer empty

## Future Updates

To push changes in the future:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

## Repository Structure

Your repository will contain:
- `local-mcp-server.js` - Custom MCP server
- `mcp-config.json` - MCP configuration
- `package.json` - Node.js dependencies
- `README.md` - Project documentation
- `CHANGELOG.md` - Project timeline
- `.gitignore` - Git ignore rules
- `env.example` - Environment variables template
- `setup-mcp.ps1` - PowerShell setup script
- `mcp-servers-list.md` - MCP server documentation

## Troubleshooting

If you encounter authentication issues:

1. **Use Personal Access Token**:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with repo permissions
   - Use token as password when prompted

2. **Use SSH instead of HTTPS**:
   ```bash
   git remote set-url origin git@github.com:buhtig910/polymarket.git
   ```

3. **Check Git Configuration**:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```
