param(
  [switch]$Apply,
  [switch]$BumpCache
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$mainPath = Join-Path $repoRoot 'assets/js/main.js'
$swPath = Join-Path $repoRoot 'sw.js'

if (-not (Test-Path $mainPath)) { throw "main.js not found: $mainPath" }
if (-not (Test-Path $swPath)) { throw "sw.js not found: $swPath" }

$mainText = Get-Content $mainPath -Raw -Encoding UTF8
$swText = Get-Content $swPath -Raw -Encoding UTF8

$intercessorsMatch = [regex]::Match($mainText, "const INTERCESSORS = \[(?<block>[\s\S]*?)\];")
if (-not $intercessorsMatch.Success) {
  throw 'Could not find INTERCESSORS block in assets/js/main.js'
}

$ids = [regex]::Matches($intercessorsMatch.Groups['block'].Value, "\{\s*id:\s*'([^']+)'") |
  ForEach-Object { $_.Groups[1].Value } |
  Select-Object -Unique

if (-not $ids -or $ids.Count -eq 0) {
  throw 'No intercessor ids parsed from INTERCESSORS block.'
}

$imageLines = ($ids | ForEach-Object { "  '/assets/images/$_.svg'," }) -join "`r`n"
$dataLines = ($ids | ForEach-Object { "  '/data/$_.json'," }) -join "`r`n"

$blockPattern = "(?ms)(?<prefix>\s*// Intercessor images\r?\n)(?<images>(?:\s*'/assets/images/[^']+\.svg',\r?\n)+)(?<mid>\s*// Intercessor data \(JSON\)\r?\n)(?<data>(?:\s*'/data/[^']+\.json',\r?\n)+)(?<suffix>\s*\];)"

$blockMatch = [regex]::Match($swText, $blockPattern)
if (-not $blockMatch.Success) { throw 'Could not find Intercessor precache block in sw.js' }

$currentImages = $blockMatch.Groups['images'].Value.Trim()
$currentData = $blockMatch.Groups['data'].Value.Trim()
$expectedImages = $imageLines.Trim()
$expectedData = $dataLines.Trim()

$imagesInSync = $currentImages -eq $expectedImages
$dataInSync = $currentData -eq $expectedData

if ($imagesInSync -and $dataInSync -and -not $BumpCache) {
  Write-Host "SW precache already in sync for $($ids.Count) intercessors."
  return
}

if (-not $Apply) {
  Write-Host "SW precache is out of sync. Run with -Apply to rewrite sw.js."
  Write-Host "Intercessors parsed: $($ids.Count)"
  Write-Host "Images in sync: $imagesInSync"
  Write-Host "Data in sync: $dataInSync"
  if ($BumpCache) {
    Write-Host "Use -Apply -BumpCache to also increment cache version."
  }
  exit 1
}

$swText = [regex]::Replace(
  $swText,
  $blockPattern,
  {
    param($m)
    return $m.Groups['prefix'].Value +
      ($imageLines + "`r`n") +
      $m.Groups['mid'].Value +
      ($dataLines + "`r`n") +
      $m.Groups['suffix'].Value
  },
  1
)

if ($BumpCache) {
  $cacheMatch = [regex]::Match($swText, "const CACHE = 'tup-v(?<n>\d+)';")
  if ($cacheMatch.Success) {
    $current = [int]$cacheMatch.Groups['n'].Value
    $next = $current + 1
    $swText = [regex]::Replace($swText, "const CACHE = 'tup-v\d+';", "const CACHE = 'tup-v$next';", 1)
    Write-Host "Cache bumped: tup-v$current -> tup-v$next"
  } else {
    throw 'Could not parse CACHE version in sw.js for bump.'
  }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($swPath, $swText, $utf8NoBom)

Write-Host "Updated sw.js precache from INTERCESSORS ($($ids.Count) ids)."
