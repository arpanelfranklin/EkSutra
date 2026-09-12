# EkSutra — Stop All Running Servers
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "   EK SUTRA — STOPPING ALL SERVERS" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow

$ports = @(8080, 8081, 8082, 8083, 5173, 5174)

foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($conn in $conns) {
            $pidToKill = $conn.OwningProcess
            if ($pidToKill -and $pidToKill -ne 0) {
                Write-Host "Stopping service on port $port (PID: $pidToKill)..." -ForegroundColor Red
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    } else {
        Write-Host "Port $port is already free." -ForegroundColor Gray
    }
}

Write-Host "`nAll EkSutra application servers have been stopped." -ForegroundColor Green
Write-Host "(MongoDB on 27017 was left running)" -ForegroundColor Gray
