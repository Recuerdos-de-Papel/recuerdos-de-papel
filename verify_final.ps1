Write-Host "Esperando 60s al deploy..."
Start-Sleep -Seconds 60

Write-Host "=== VERIFICACION FINAL ==="
Write-Host ""

Write-Host "1. Health Check:"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/health' -UseBasicParsing -TimeoutSec 30
    Write-Host "   HTTP $($r.StatusCode) - $($r.Content)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "2. Products API (sin Origin):"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products?limit=1' -UseBasicParsing -TimeoutSec 30
    Write-Host "   HTTP $($r.StatusCode)"
    Write-Host "   Length: $($r.Content.Length)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "3. Products API (con Origin = https://recuerdos-de-papel.onrender.com):"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products?limit=1' -UseBasicParsing -TimeoutSec 30 -Headers @{'Origin' = 'https://recuerdos-de-papel.onrender.com'}
    Write-Host "   HTTP $($r.StatusCode)"
    Write-Host "   Access-Control-Allow-Origin: $($r.Headers['Access-Control-Allow-Origin'])"
    Write-Host "   Length: $($r.Content.Length)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}
</arg_value>
</write_to_file></tool_call>