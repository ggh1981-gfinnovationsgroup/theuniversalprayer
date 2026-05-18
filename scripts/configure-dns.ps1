# =============================================================
# DNS Configurator for theuniversalprayer.com via Namecheap API
# =============================================================
# IMPORTANT: This script sets up the INITIAL DNS before migrating
# to Cloudflare. Once Cloudflare nameservers are active, manage
# DNS directly in the Cloudflare dashboard.
#
# Architecture:
#   - Root domain: GitHub Pages (A records)
#   - Subdomains: Cloudflare CNAME + Worker proxy (SSL handled by Cloudflare)
#   - Worker: workers/subdomain-proxy.js
#
# Prerequisites:
#   1. Enable Namecheap API: namecheap.com > Profile > Tools > API
#   2. Whitelist your public IP in that same page
#   3. Run this script and enter your credentials when prompted
# =============================================================

$SLD = "theuniversalprayer"
$TLD = "com"
$GitHubPages = "ggh1981-gfinnovationsgroup.github.io"

# Prompt for credentials (never stored)
$ApiUser = Read-Host "Namecheap username"
$ApiKey  = Read-Host "Namecheap API key"

# Auto-detect public IP
Write-Host "Detecting your public IP..." -ForegroundColor Cyan
$ClientIp = (Invoke-RestMethod "https://api.ipify.org").Trim()
Write-Host "Detected IP: $ClientIp" -ForegroundColor Cyan

# Build DNS records list
# NOTE: setHosts REPLACES all existing records. This is a clean setup.
$records = @(
    # GitHub Pages A records for root domain
    @{ Host="@";             Type="A";     Address="185.199.108.153"; TTL=1800 },
    @{ Host="@";             Type="A";     Address="185.199.109.153"; TTL=1800 },
    @{ Host="@";             Type="A";     Address="185.199.110.153"; TTL=1800 },
    @{ Host="@";             Type="A";     Address="185.199.111.153"; TTL=1800 },
    # www
    @{ Host="www";           Type="CNAME"; Address=$GitHubPages;      TTL=1800 },
    # Intercessor subdomains — CNAME to main domain, proxied via Cloudflare Worker
    # The Worker (workers/subdomain-proxy.js) handles SSL and routes to correct content
    @{ Host="padrepio";      Type="CNAME"; Address="theuniversalprayer.com"; TTL=1800 },
    @{ Host="misericordia";  Type="CNAME"; Address="theuniversalprayer.com"; TTL=1800 },
    @{ Host="guadalupe";     Type="CNAME"; Address="theuniversalprayer.com"; TTL=1800 },
    @{ Host="sagradocorazon";Type="CNAME"; Address="theuniversalprayer.com"; TTL=1800 },
    @{ Host="sanjose";       Type="CNAME"; Address="theuniversalprayer.com"; TTL=1800 },
    @{ Host="fatima";        Type="CNAME"; Address="theuniversalprayer.com"; TTL=1800 }
)

# Build query parameters
$params = [System.Collections.Specialized.OrderedDictionary]::new()
$params["ApiUser"]   = $ApiUser
$params["ApiKey"]    = $ApiKey
$params["UserName"]  = $ApiUser
$params["ClientIp"]  = $ClientIp
$params["Command"]   = "namecheap.domains.dns.setHosts"
$params["SLD"]       = $SLD
$params["TLD"]       = $TLD

$i = 1
foreach ($r in $records) {
    $params["HostName$i"]   = $r.Host
    $params["RecordType$i"] = $r.Type
    $params["Address$i"]    = $r.Address
    $params["TTL$i"]        = $r.TTL
    $i++
}

$query = ($params.Keys | ForEach-Object { "$_=$([Uri]::EscapeDataString($params[$_]))" }) -join "&"
$url   = "https://api.namecheap.com/xml.response?$query"

Write-Host "`nSending DNS configuration to Namecheap..." -ForegroundColor Yellow

try {
    [xml]$response = Invoke-RestMethod -Uri $url -Method Get
    $status = $response.ApiResponse.Status

    if ($status -eq "OK") {
        Write-Host "`n✅ DNS configured successfully!" -ForegroundColor Green
        Write-Host "`nRecords set:" -ForegroundColor Cyan
        foreach ($r in $records) {
            Write-Host "  $($r.Type.PadRight(5))  $($r.Host.PadRight(18))  →  $($r.Address)"
        }
        Write-Host "`nDNS propagation typically takes 5-30 minutes." -ForegroundColor Gray
        Write-Host "Test with: nslookup theuniversalprayer.com 8.8.8.8" -ForegroundColor Gray
    } else {
        Write-Host "`n❌ Error from Namecheap API:" -ForegroundColor Red
        $response.ApiResponse.Errors.Error | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
        Write-Host "`nFull response:" -ForegroundColor Gray
        $response.ApiResponse.OuterXml
    }
}
catch {
    Write-Host "`n❌ Request failed: $_" -ForegroundColor Red
}
