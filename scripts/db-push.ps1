<#
  scripts/db-push.ps1
  Helper to load DATABASE_URL from .env.local and run drizzle-kit generate + push

  Usage:
    pwsh ./scripts/db-push.ps1        # normal run
    pwsh ./scripts/db-push.ps1 -DryRun  # print actions without executing
#>

param(
  [switch]$DryRun
)

Set-StrictMode -Version Latest
Push-Location -LiteralPath (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent)\..\

try {
  # load .env.local if present
  if (Test-Path .env.local) {
    $lines = Get-Content .env.local | Where-Object { $_ -and -not ($_ -match '^\s*#') }
    foreach ($line in $lines) {
      if ($line -match '^\s*([^=]+)=(.*)$') {
        $k = $matches[1].Trim()
        $v = $matches[2].Trim()
        if ($k -eq 'DATABASE_URL') {
          $env:DATABASE_URL = $v
        }
      }
    }
    if ($env:DATABASE_URL) { Write-Host "Loaded DATABASE_URL from .env.local" }
    else { Write-Warning ".env.local found but DATABASE_URL not present. Ensure DATABASE_URL is set." }
  } else {
    Write-Warning ".env.local not found — ensure `$env:DATABASE_URL` is set before running this script."
  }

  if (-not $env:DATABASE_URL) {
    Write-Error "DATABASE_URL is not set. Aborting."
    exit 1
  }

  if ($DryRun) {
    Write-Host "Dry-run: would run `npm run db:generate` then `npm run db:push` with the loaded DATABASE_URL."
    exit 0
  }

  # generate migrations (writes SQL to ./drizzle)
  Write-Host "Running: npm run db:generate"
  npm run db:generate
  if ($LASTEXITCODE -ne 0) {
    Write-Error "db:generate failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
  }

  # push migrations to DB
  Write-Host "Running: npm run db:push"
  npm run db:push
  if ($LASTEXITCODE -ne 0) {
    Write-Error "db:push failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
  }

  Write-Host "drizzle migrations generated and pushed successfully."
} finally {
  Pop-Location
}
