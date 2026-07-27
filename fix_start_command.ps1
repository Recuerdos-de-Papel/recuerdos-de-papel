$headers = @{
    'Authorization' = 'Bearer rnd_h7hzDm4qYzE2aLbh6nSQQATVbbo3'
    'Accept' = 'application/json'
    'Content-Type' = 'application/json'
}

# 1. Actualizar el servicio web-venta para que use render-start
Write-Host "1. Actualizando startCommand a 'npm run render-start'..."
$body = @'
{
    "service": {
        "startCommand": "npm run render-start"
    }
}
'@

try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0' -Method PATCH -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 30
    Write-Host "   HTTP $($r.StatusCode)"
    Write-Host "   $($r.Content)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "2. Verificando servicio actualizado..."
try {
    $r = Invoke-WebRequest -Uri "https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0" -Headers $headers -UseBasicParsing -TimeoutSec 30
    Write-Host "   HTTP $($r.StatusCode)"
    $parsed = $r.Content | ConvertFrom-Json
    Write-Host "   startCommand: $($parsed.service.serviceDetails.envSpecificDetails.startCommand)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# 3. Disparar nuevo deploy
Write-Host ""
Write-Host "3. Disparando deploy..."
$body2 = '{"clearCache": "do_not_clear"}'
try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0/deploys' -Method POST -Headers $headers -Body $body2 -UseBasicParsing -TimeoutSec 30
    Write-Host "   Deploy HTTP $($r.StatusCode)"
    Write-Host "   Deploy ID: $((ConvertFrom-Json $r.Content).id)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}