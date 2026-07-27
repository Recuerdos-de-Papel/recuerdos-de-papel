$headers = @{
    'Authorization' = 'Bearer rnd_h7hzDm4qYzE2aLbh6nSQQATVbbo3'
    'Accept' = 'application/json'
}

try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0/deploys?limit=1' -Headers $headers -UseBasicParsing -TimeoutSec 30
    Write-Host "Ultimo deploy:"
    $r.Content
} catch { Write-Host "Error: $($_.Exception.Message)" }

Write-Host ""
Write-Host "Esperando 20s..."
Start-Sleep -Seconds 20

Write-Host "Test CORS con Origin correcto:"
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products' -UseBasicParsing -TimeoutSec 30 -Headers @{'Origin' = 'https://recuerdos-de-papel.onrender.com'}
    Write-Host "HTTP $($r.StatusCode)"
    Write-Host "Access-Control-Allow-Origin: $($r.Headers['Access-Control-Allow-Origin'])"
    if ($r.Content.Length -gt 0) {
        Write-Host "Data recibida OK ($($r.Content.Length) bytes)"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}