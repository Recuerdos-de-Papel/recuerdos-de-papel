$headers = @{
    'Authorization' = 'Bearer rnd_h7hzDm4qYzE2aLbh6nSQQATVbbo3'
    'Accept' = 'application/json'
}

Write-Host "=== LOGS DEL DEPLOY ==="
try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0/deploys/dep-d9ja0jkm0tmc73aloccg' -Headers $headers -UseBasicParsing -TimeoutSec 30
    Write-Host $r.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== HEALTH CHECK ==="
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/health' -UseBasicParsing -TimeoutSec 30
    Write-Host "HTTP $($r.StatusCode) - $($r.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== TEST SIN ORIGIN (curl) ==="
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products?limit=1' -UseBasicParsing -TimeoutSec 30
    Write-Host "HTTP $($r.StatusCode)"
    Write-Host "Content: $($r.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "StatusCode: $($_.Exception.Response.StatusCode.value__)"
    }
}