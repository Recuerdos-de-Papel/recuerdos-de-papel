$headers = @{
    'Authorization' = 'Bearer rnd_h7hzDm4qYzE2aLbh6nSQQATVbbo3'
    'Accept' = 'application/json'
    'Content-Type' = 'application/json'
}

# 1. Actualizar CORS_ORIGIN en web-venta
Write-Host "1. Actualizando CORS_ORIGIN en web-venta..."
$body = @'
[
    {
        "key": "CORS_ORIGIN",
        "value": "http://localhost:5173,https://recuerdos-de-papel.onrender.com"
    }
]
'@
try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0/env-vars' -Method PUT -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 30
    Write-Host "   CORS_ORIGIN HTTP $($r.StatusCode)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# 2. Disparar deploy
Write-Host "2. Disparando deploy..."
$body2 = '{"clearCache": "do_not_clear"}'
try {
    $r = Invoke-WebRequest -Uri 'https://api.render.com/v1/services/srv-d9epb3laeets73bm04i0/deploys' -Method POST -Headers $headers -Body $body2 -UseBasicParsing -TimeoutSec 30
    Write-Host "   Deploy HTTP $($r.StatusCode)"
    Write-Host "   Deploy ID: $((ConvertFrom-Json $r.Content).id)"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
}

# 3. Esperar y verificar
Write-Host "3. Esperando 60s al deploy..."
Start-Sleep -Seconds 60

Write-Host "4. Verificando header CORS..."
try {
    $r = Invoke-WebRequest -Uri 'https://web-venta-hy1x.onrender.com/api/products' -UseBasicParsing -TimeoutSec 30 -Headers @{'Origin' = 'https://recuerdos-de-papel.onrender.com'}
    Write-Host "   HTTP $($r.StatusCode)"
    Write-Host "   Access-Control-Allow-Origin: $($r.Headers['Access-Control-Allow-Origin'])"
} catch {
    Write-Host "   Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $h = $_.Exception.Response.Headers
        Write-Host "   Headers:"
        $h | Format-Table -AutoSize
    }
}