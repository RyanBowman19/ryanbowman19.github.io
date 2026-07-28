<#
  Switches the site from ryanbowman19.github.io to a custom domain.

  RUN THIS ONLY AFTER:
    1. You have bought the domain, and
    2. You have added the DNS records (see README section 3), and
    3. GitHub / Settings / Pages / Custom domain shows a green check.

  Running it early does no permanent harm, but GitHub serves a 404 until
  DNS resolves, so there is no reason to rush it.

  Usage:
    .\tools\switch-to-domain.ps1 -Domain bowsites.com -WhatIf
    .\tools\switch-to-domain.ps1 -Domain bowsites.com
#>

[CmdletBinding(SupportsShouldProcess)]
param(
  [Parameter(Mandatory)]
  [ValidatePattern('^[a-z0-9.-]+\.[a-z]{2,}$')]
  [string]$Domain
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$old = 'https://ryanbowman19.github.io'
$new = 'https://' + $Domain

Write-Host ('Switching ' + $old + ' -> ' + $new) -ForegroundColor Cyan

# 1. CNAME tells GitHub Pages which domain to answer on.
#    Repo root, bare hostname, no protocol, no trailing slash.
if ($PSCmdlet.ShouldProcess('CNAME', 'write')) {
  Set-Content -Path (Join-Path $root 'CNAME') -Value $Domain -NoNewline -Encoding utf8
  Write-Host ('  CNAME -> ' + $Domain)
}

# 2. Rewrite absolute URLs. Relative asset paths need no change.
foreach ($f in @('index.html', 'robots.txt', 'sitemap.xml')) {
  $path = Join-Path $root $f
  if (-not (Test-Path $path)) {
    Write-Warning ('  skipped, file missing: ' + $f)
    continue
  }

  $text = Get-Content $path -Raw
  $hits = ([regex]::Matches($text, [regex]::Escape($old))).Count
  if ($hits -eq 0) {
    Write-Host ('  ' + $f + ' - nothing to change')
    continue
  }

  if ($PSCmdlet.ShouldProcess($f, ('replace ' + $hits + ' URL(s)'))) {
    ($text -replace [regex]::Escape($old), $new) |
      Set-Content -Path $path -NoNewline -Encoding utf8
    Write-Host ('  ' + $f + ' - ' + $hits + ' URL(s) updated')
  }
}

# 3. Bump the sitemap date so search engines treat it as changed.
$sitemap = Join-Path $root 'sitemap.xml'
if ((Test-Path $sitemap) -and $PSCmdlet.ShouldProcess('sitemap.xml', 'update lastmod')) {
  $today = Get-Date -Format 'yyyy-MM-dd'
  $body = Get-Content $sitemap -Raw
  $body = $body -replace '<lastmod>[^<]*</lastmod>', ('<lastmod>' + $today + '</lastmod>')
  Set-Content -Path $sitemap -Value $body -NoNewline -Encoding utf8
  Write-Host ('  sitemap.xml - lastmod -> ' + $today)
}

$quote = [char]34
Write-Host ''
Write-Host 'Done. Review the diff, then:' -ForegroundColor Green
Write-Host '  git add -A'
Write-Host ('  git commit -m ' + $quote + 'Point the site at ' + $Domain + $quote)
Write-Host '  git push'
Write-Host ''
Write-Host 'Then tick Enforce HTTPS under GitHub / Settings / Pages.' -ForegroundColor Yellow
Write-Host 'The certificate can take up to an hour to issue. That is normal.'
