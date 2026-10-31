# VisionGuard Dual-Process Development Runner
# Launches Next.js frontend (port 3000) and FastAPI backend (port 8000) concurrently

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Starting VisionGuard Full-Stack Platform" -ForegroundColor Cyan
Write-Host " Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host " Backend:  http://localhost:8000 (Docs: /docs)" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "..\backend"
$pythonExe = Join-Path $backendDir ".venv\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
    Write-Warning "Python virtualenv not found at $pythonExe. Setting up..."
    python -m venv (Join-Path $backendDir ".venv")
    & $pythonExe -m pip install -r (Join-Path $backendDir "requirements.txt")
}

# Start backend in a background job or window
$backendProcess = Start-Process -FilePath $pythonExe -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload" -WorkingDirectory $backendDir -PassThru

Write-Host "[Runner] FastAPI backend started (PID $($backendProcess.Id))." -ForegroundColor Yellow

try {
    # Start Next.js frontend in current console
    npm run dev
}
finally {
    Write-Host "[Runner] Shutting down backend process..." -ForegroundColor Yellow
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
}
