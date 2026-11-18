@echo off
rem Restarts ONLY the live backend (Studio bridge) on port 8110 in a window of its own, after a code change.
rem The tunnel window from start_bridge.cmd keeps running, so the Base URL in Studio does not change.
rem Close the old "RSG backend" window first (the port must be free), then run this.
setlocal
cd /d "%~dp0"
set "PORT=%~1"
if "%PORT%"=="" set "PORT=8110"
if not exist "private\bridge_secret.txt" (
  echo private\bridge_secret.txt is missing. It holds the X-Bridge-Key value configured in Studio.
  pause
  exit /b 1
)
set /p STUDIO_BRIDGE_SECRET=<private\bridge_secret.txt
if "%STUDIO_PAGE_ORIGIN%"=="" set "STUDIO_PAGE_ORIGIN=http://127.0.0.1:8100"
python -c "import socket,sys; s=socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1',%PORT%))==0 else 1)" >nul 2>&1
if not errorlevel 1 (
  echo A backend already answers on 127.0.0.1:%PORT%. Close the "RSG backend %PORT%" window first.
  pause
  exit /b 1
)
start "RSG backend %PORT%" cmd /k python server.py %PORT%
echo Backend window started on port %PORT%. The tunnel address is unchanged:
if exist private\base_url.txt type private\base_url.txt
pause
