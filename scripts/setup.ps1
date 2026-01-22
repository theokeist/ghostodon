# Ghostodon monorepo setup (PowerShell)
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
#   powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1 -- --fetch --build

Write-Host "`n=== Ghostodon setup ===`n"

# Try enabling corepack if present
$corepack = Get-Command corepack -ErrorAction SilentlyContinue
if ($corepack) {
  Write-Host "corepack detected. Enabling..."
  try {
    corepack enable | Out-Host
    corepack prepare pnpm@9.15.0 --activate | Out-Host
  } catch {
    Write-Host "corepack activation failed (you can ignore if pnpm already exists)."
  }
}

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Host "Node.js not found. Install Node.js, then rerun." -ForegroundColor Yellow
  exit 1
}

# Forward any args to the JS setup script
node .\scripts\setup.mjs @Args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
