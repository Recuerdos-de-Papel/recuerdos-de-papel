$headers = @{
    'Authorization' = 'Bearer rnd_h7hzDm4qYzE2aLbh6nSQQATVbbo3'
    'Accept' = 'application/json'
}

Write-Host "=== LOGS DEL SERVICIO web-venta (ultimos) ==="
try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0/deploys/dep-d9ja0jkm0tmc73aloccg' -Headers $headers -UseBasicParsing -TimeoutSec 30
    Write-Host $r.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "=== ENV VARS ACTUALES ==="
try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0/env-vars' -Headers $headers -UseBasicParsing -TimeoutSec 30
    Write-Host $r.Content
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}