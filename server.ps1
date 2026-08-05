# ============================================================
# LinguaBridge AI - Zero-Dependency PowerShell HTTP Server
# Usage: Right-click -> Run with PowerShell
#        OR: powershell -ExecutionPolicy Bypass -File server.ps1
# Then open: http://localhost:8080
# ============================================================

$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "  LinguaBridge AI - Local Server Started!" -ForegroundColor Green
    Write-Host "  Open browser at: http://localhost:$port/" -ForegroundColor Yellow
    Write-Host "  Press Ctrl+C to stop the server." -ForegroundColor Gray
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""

    # Auto-open browser
    Start-Process "http://localhost:$port/"

    while ($true) {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        $urlPath  = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") { $urlPath = "/index.html" }

        $filePath = Join-Path $root ($urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar))

        if (Test-Path $filePath -PathType Leaf) {
            # Determine content type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json" }
                ".png"  { $response.ContentType = "image/png" }
                ".ico"  { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "application/octet-stream" }
            }

            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found: $urlPath")
            $response.ContentType = "text/plain"
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }

        $response.OutputStream.Flush()
        $response.OutputStream.Close()
        $response.Close()

        Write-Host "$(Get-Date -Format 'HH:mm:ss')  $($response.StatusCode)  $urlPath"
    }
} catch {
    if ($_.Exception.Message -notlike "*thread abort*") {
        Write-Host "Server error: $_" -ForegroundColor Red
    }
} finally {
    if ($listener.IsListening) { $listener.Stop() }
    Write-Host "Server stopped." -ForegroundColor Gray
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        