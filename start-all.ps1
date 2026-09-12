# EkSutra — Launch Complete Live Full Stack Ecosystem
$rootDir = $PSScriptRoot
if (-not $rootDir) { $rootDir = (Get-Location).Path }

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   EK SUTRA - FULL STACK LIVE SYSTEM LAUNCHER" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

function Check-Port($port) {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    return [bool]$conn
}

# 1. Check MongoDB
Write-Host ""
Write-Host "[1/7] MongoDB (Port 27017)..." -ForegroundColor Yellow
if (Check-Port 27017) {
    Write-Host "  MongoDB is ALREADY RUNNING on port 27017." -ForegroundColor Green
} else {
    Write-Host "  Starting MongoDB service..." -ForegroundColor Yellow
    Start-Service -Name "MongoDB" -ErrorAction SilentlyContinue
}

# 2. System B (Port 8082)
Write-Host ""
Write-Host "[2/7] System B REST Verifier (Port 8082)..." -ForegroundColor Yellow
if (Check-Port 8082) {
    Write-Host "  System B is ALREADY RUNNING on port 8082." -ForegroundColor Green
} else {
    Write-Host "  Launching System B in background window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\system-b'; `$host.UI.RawUI.WindowTitle = 'System B (:8082)'; mvn spring-boot:run '-Dspring-boot.run.jvmArguments=-Dserver.port=8082'"
}

# 3. System C (Port 8083)
Write-Host ""
Write-Host "[3/7] System C Legacy XML Verifier (Port 8083)..." -ForegroundColor Yellow
if (Check-Port 8083) {
    Write-Host "  System C is ALREADY RUNNING on port 8083." -ForegroundColor Green
} else {
    Write-Host "  Launching System C in background window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\system-c'; `$host.UI.RawUI.WindowTitle = 'System C (:8083)'; mvn spring-boot:run '-Dspring-boot.run.jvmArguments=-Dserver.port=8083'"
}

# 4. EK SUTRA Core Integration Platform (Port 8080)
Write-Host ""
Write-Host "[4/7] EK SUTRA Integration Platform (Port 8080)..." -ForegroundColor Yellow
if (Check-Port 8080) {
    Write-Host "  EK SUTRA Backend is ALREADY RUNNING on port 8080." -ForegroundColor Green
} else {
    Write-Host "  Launching EK SUTRA Backend in background window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\integration-plateform'; `$host.UI.RawUI.WindowTitle = 'EK SUTRA Backend (:8080)'; mvn spring-boot:run '-Dspring-boot.run.jvmArguments=-Dserver.port=8080'"
}

# 5. System A Civic Backend (Port 8081)
Write-Host ""
Write-Host "[5/7] System A Civic Backend (Port 8081)..." -ForegroundColor Yellow
if (Check-Port 8081) {
    Write-Host "  System A Backend is ALREADY RUNNING on port 8081." -ForegroundColor Green
} else {
    Write-Host "  Launching System A Backend in background window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\system-a'; `$host.UI.RawUI.WindowTitle = 'System A Backend (:8081)'; mvn spring-boot:run '-Dspring-boot.run.jvmArguments=-Dserver.port=8081'"
}

# 6. EK SUTRA Officer & Admin Frontend (Port 5173)
Write-Host ""
Write-Host "[6/7] EK SUTRA Frontend (Port 5173)..." -ForegroundColor Yellow
if (Check-Port 5173) {
    Write-Host "  EK SUTRA Frontend is ALREADY RUNNING on port 5173." -ForegroundColor Green
} else {
    Write-Host "  Launching EK SUTRA Frontend..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; `$host.UI.RawUI.WindowTitle = 'EK SUTRA Frontend (:5173)'; npm run dev"
}

# 7. System A Citizen Portal Frontend (Port 5174)
Write-Host ""
Write-Host "[7/7] System A Citizen Frontend (Port 5174)..." -ForegroundColor Yellow
if (Check-Port 5174) {
    Write-Host "  System A Frontend is ALREADY RUNNING on port 5174." -ForegroundColor Green
} else {
    Write-Host "  Launching System A Frontend..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\system-a-frontend'; `$host.UI.RawUI.WindowTitle = 'System A Citizen Frontend (:5174)'; npm run dev"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  SYSTEM STATUS SUMMARY:" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  EK SUTRA Officer Portal : http://localhost:5173" -ForegroundColor White
Write-Host "  System A Citizen Portal : http://localhost:5174" -ForegroundColor White
Write-Host "  EK SUTRA Middleware API : http://localhost:8080" -ForegroundColor White
Write-Host "  System A Civic API      : http://localhost:8081" -ForegroundColor White
Write-Host "  System B REST Verifier  : http://localhost:8082" -ForegroundColor White
Write-Host "  System C XML Verifier   : http://localhost:8083" -ForegroundColor White
Write-Host "  MongoDB Datastore       : localhost:27017" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
