@echo off
rem Starts the live backend (Studio bridge) on port 8110 and a Cloudflare quick tunnel in two windows of their own,
rem then prints the Base URL to paste into the Studio Custom Agent. Keep both windows open while the widget is in use.
rem Usage:  start_bridge.cmd            (port 8110)
rem         start_bridge.cmd 8120       (another local port; the tunnel follows it)
setlocal
cd /d "%~dp0"
set "PORT=%~1"
if "%PORT%"=="" set "PORT=8110"
set "CF=C:\Program Files (x86)\cloudflared\cloudflared.exe"
if not exist "%CF%" set "CF=%ProgramFiles%\cloudflared\cloudflared.exe"
if not exist "%CF%" (
  echo cloudflared was not found. Install it with:  winget install --id Cloudflare.cloudflared --exact
  pause
  exit /b 1
)
if not exist "private\bridge_secret.txt" (
  echo private\bridge_secret.txt is missing. It holds the X-Bridge-Key value configured in Studio.
  pause
  exit /b 1
)
set /p STUDIO_BRIDGE_SECRET=<private\bridge_secret.txt
if "%STUDIO_PAGE_ORIGIN%"=="" set "STUDIO_PAGE_ORIGIN=http://127.0.0.1:8100"
python -c "import socket,sys; s=socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1',%PORT%))==0 else 1)" >nul 2>&1
if not errorlevel 1 (
  echo A backend already answers on 127.0.0.1:%PORT%. Close its window first, or pass another port.
  pause
  exit /b 1
)
if exist private\tunnel.log del private\tunnel.log
start "RSG backend %PORT%" cmd /k python server.py %PORT%
start "RSG tunnel -> %PORT%" "%CF%" tunnel --url http://127.0.0.1:%PORT% --no-autoupdate --logfile private\tunnel.log
echo Waiting for the tunnel address...
set "BASE="
for /l %%i in (1,1,30) do (
  if not defined BASE (
    timeout /t 1 >nul
    for /f "usebackq delims=" %%u in (`powershell -NoProfile -Command "if (Test-Path 'private\tunnel.log') { $m = [regex]::Match((Get-Content 'private\tunnel.log' -Raw), 'https://[a-z0-9-]+\.trycloudflare\.com'); if ($m.Success) { $m.Value } }"`) do set "BASE=%%u"
  )
)
if not defined BASE (
  echo The tunnel did not report an address within 30 seconds. Look at the "RSG tunnel" window; the address line contains trycloudflare.com.
  pause
  exit /b 1
)
echo %BASE%/studio> private\base_url.txt
echo.
echo ==========================================================================
echo  Studio Custom Agent  -^>  Base URL:
echo    %BASE%/studio
echo  (also saved to private\base_url.txt; the X-Bridge-Key header stays the same)
echo ==========================================================================
echo.
echo Keep the two windows "RSG backend %PORT%" and "RSG tunnel" open. Closing either one changes the address next time.
pause
