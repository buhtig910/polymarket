# Auto-update GitHub script
# This script will commit and push changes to GitHub

Write-Host "Updating GitHub repository..." -ForegroundColor Green

# Add all changes
git add .

# Get current timestamp for commit message
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Commit changes
git commit -m "Auto-update: $timestamp"

# Push to GitHub
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully updated GitHub repository" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to update GitHub repository" -ForegroundColor Red
}
