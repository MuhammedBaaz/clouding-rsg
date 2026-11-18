@echo off
rem Starts the concierge page and its e-mail verification API from one
rem local HTTP origin, then opens the browser at that address.
rem Usage:  start.cmd            (port 8100; V1 keeps 8080, V2 8090)
rem         start.cmd 8101       (an explicitly selected test port)
rem Studio Web channels allow exact origins, so do not move to another port.
rem Mail settings and the Claude connection (ANTHROPIC_*) are read by server.py
rem from the environment or from a .env file next to it (see .env.example).
rem Nothing is sent on start.
setlocal
cd /d "%~dp0"
set "PORT=%~1"
if "%PORT%"=="" set "PORT=8100"
netstat -ano -p tcp | findstr /R /C:":%PORT% .*LISTENING" >nul 2>&1
if not errorlevel 1 (
  echo Cannot start: port %PORT% is already in use.
  echo If the live concierge is already running, open http://127.0.0.1:%PORT%/.
  echo To reload changes, press Ctrl+C in the existing server window and run this file again.
  echo The Studio widget requires an allowed origin; no other port was started.
  pause
  exit /b 1
)
where python >nul 2>&1
if errorlevel 1 (
  echo Python 3 was not found on PATH. Install it from python.org and run start.cmd again.
  exit /b 1
)
python -c "import anthropic" >nul 2>&1
if errorlevel 1 (
  echo The Anthropic SDK is not installed. Run:  python -m pip install -r requirements.txt
  exit /b 1
)
echo Live concierge page, agent API and verification API: http://127.0.0.1:%PORT%/
echo Open index.html only through this address, never as a file:// path.
echo Press Ctrl+C in this window to stop the server.
start "" cmd /c "timeout /t 2 >nul & start "" http://127.0.0.1:%PORT%/"
python server.py %PORT%
