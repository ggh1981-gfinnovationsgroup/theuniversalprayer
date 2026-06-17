# add-miracles-field.ps1
# Extrae anecdotas correctas del commit original (antes del dano de encoding),
# crea campo "miracles" independiente y deja "history" solo con parrafos biograficos.

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Get-Bio($text) {
    if (-not $text) { return '' }
    $parts = $text -split "`n`n"
    $idx = $parts.Length  # si no hay anecdota, todo es bio
    for ($i = 0; $i -lt $parts.Length; $i++) {
        if ($parts[$i].Trim() -match '^\d+\.') { $idx = $i; break }
    }
    return ($parts[0..($idx - 1)] -join "`n`n")
}

function Get-Anecdotes($text) {
    if (-not $text) { return '' }
    $parts = $text -split "`n`n"
    $idx = $parts.Length  # si no hay anecdota, retorna vacio
    for ($i = 0; $i -lt $parts.Length; $i++) {
        if ($parts[$i].Trim() -match '^\d+\.') { $idx = $i; break }
    }
    if ($idx -ge $parts.Length) { return '' }
    return ($parts[$idx..($parts.Length - 1)] -join "`n`n")
}

$errors = @()
$processed = 0
$skipped = 0

Set-Location C:\Users\ggh19\Documents\theuniversalprayer

foreach ($f in (Get-ChildItem data\*.json | Sort-Object Name)) {
    $name = $f.BaseName

    # Determinar que commit tiene las anecdotas correctas
    $oldCommit = '1fdc5d0'
    $exists = git ls-tree $oldCommit "data/$name.json" 2>$null
    if (-not $exists) {
        $oldCommit = '6aa9486'
        $exists = git ls-tree $oldCommit "data/$name.json" 2>$null
        if (-not $exists) {
            Write-Host "SKIP (no encontrado en git): $name"
            $skipped++
            continue
        }
    }

    try {
        # Obtener JSON del commit original (anecdotas con caracteres correctos)
        $oldContent = (git show "${oldCommit}:data/$name.json") -join "`n"
        $oldJson = $oldContent | ConvertFrom-Json
        $miraclesEs = Get-Anecdotes $oldJson.history.es
        $miraclesEn = Get-Anecdotes $oldJson.history.en

        # Leer JSON actual
        $currentText = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        $currentJson = $currentText | ConvertFrom-Json

        # Extraer solo parrafos biograficos del history actual (quitar anecdotas con U+FFFD)
        $bioEs = Get-Bio $currentJson.history.es
        $bioEn = Get-Bio $currentJson.history.en

        # Actualizar history a solo bio
        $currentJson.history.es = $bioEs
        $currentJson.history.en = $bioEn

        # Agregar campo miracles
        $miracles = [PSCustomObject]@{
            available = if ($miraclesEs -or $miraclesEn) { $true } else { $false }
            es        = $miraclesEs
            en        = $miraclesEn
        }
        $currentJson | Add-Member -NotePropertyName 'miracles' -NotePropertyValue $miracles -Force

        # Serializar y guardar como UTF-8 sin BOM
        $jsonText = $currentJson | ConvertTo-Json -Depth 20
        [System.IO.File]::WriteAllText($f.FullName, $jsonText, $utf8NoBom)

        Write-Host "OK: $name (commit: $oldCommit)"
        $processed++
    }
    catch {
        $msg = "$name ($oldCommit): $_"
        $errors += $msg
        Write-Host "ERROR: $msg"
    }
}

Write-Host ""
Write-Host "=== RESULTADO ==="
Write-Host "Procesados: $processed"
Write-Host "Omitidos:   $skipped"
Write-Host "Errores:    $($errors.Count)"
if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "=== DETALLE ERRORES ==="
    $errors | ForEach-Object { Write-Host $_ }
}
