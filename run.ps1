$python = "$PSScriptRoot\venv\Scripts\python.exe"

Write-Host "Starting Career GPS..." -ForegroundColor Cyan

# Kill any old instances on these ports
Get-Process -Name python* -ErrorAction SilentlyContinue | ForEach-Object {
    $conn = netstat -ano 2>$null | Select-String "(:8000|:5500)"
    if ($conn -match $_.Id) { $_ | Stop-Process -Force -ErrorAction SilentlyContinue }
}

# Start backend (FastAPI on port 8000)
$backend = Start-Process -FilePath $python `
    -ArgumentList "-m uvicorn backend.main:app --host 127.0.0.1 --port 8000" `
    -WorkingDirectory $PSScriptRoot `
    -PassThru -WindowStyle Normal

Write-Host "Backend starting on http://localhost:8000" -ForegroundColor Green
Write-Host "  API docs: http://localhost:8000/docs" -ForegroundColor DarkGray
Start-Sleep -Seconds 3

# Start frontend (static files on port 5500)
$frontend = Start-Process -FilePath $python `
    -ArgumentList "-m http.server 5500 --directory `"$PSScriptRoot\frontend`"" `
    -WorkingDirectory $PSScriptRoot `
    -PassThru -WindowStyle Normal

Write-Host "Frontend starting on http://localhost:5500" -ForegroundColor Green
Start-Sleep -Seconds 1

# Open browser
Start-Process "http://localhost:5500/index.html"
Write-Host ""
Write-Host "Landing page: http://localhost:5500/index.html" -ForegroundColor Yellow
Write-Host "Press Enter to stop both servers..." -ForegroundColor Yellow
Read-Host

# Cleanup
$backend  | Stop-Process -Force -ErrorAction SilentlyContinue
$frontend | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Servers stopped." -ForegroundColor Red
