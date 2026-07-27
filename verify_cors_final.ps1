Write-Host "Esperando 30s adicionales..."
Start-Sleep -Seconds 30

Write-Host "=== VERIFICACION CORS ==="
Write-Host ""

Write-Host "1. Health Check (sin origin):"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/health' -UseBasicParsing -TimeoutSec 30
    Write-Host "   HTTP $($r.StatusCode) - $($r.Content)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "2. Products API (con Origin = https://recuerdos-de-papel.onrender.com):"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products' -UseBasicParsing -TimeoutSec 30 -Headers @{'Origin' = 'https://recuerdos-de-papel.onrender.com'}
    Write-Host "   HTTP $($r.StatusCode)"
    Write-Host "   Access-Control-Allow-Origin: $($r.Headers['Access-Control-Allow-Origin'])"
    Write-Host "   Data length: $($r.Content.Length)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $h = $_.Exception.Response.Headers
        Write-Host "   Access-Control-Allow-Origin header presente: $($h.Contains('Access-Control-Allow-Origin'))"
    }
}

Write-Host ""
Write-Host "3. Products API (con Origin = http://localhost:5173):"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products' -UseBasicParsing -TimeoutSec 30 -Headers @{'Origin' = 'http://localhost:5173'}
    Write-Host "   HTTP $($r.StatusCode)"
    Write-Host "   Access-Control-Allow-Origin: $($r.Headers['Access-Control-Allow-Origin'])"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "4. Products API (con Origin NO permitido = https://evil.com):"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products' -UseBasicParsing -TimeoutSec 30 -Headers @{'Origin' = 'https://evil.com'}
    Write-Host "   HTTP $($r.StatusCode)"
    Write-Host "   Access-Control-Allow-Origin: $($r.Headers['Access-Control-Allow-Origin'])"
} catch {
    Write-Host "   Error (esperado - CORS bloqueado): $($_.Exception.Message)"
}