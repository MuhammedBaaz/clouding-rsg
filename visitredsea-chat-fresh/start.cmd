@echo off
rem Fresh RSG site with the Empathy Studio web widget.
rem Usage:  start.cmd            (http://127.0.0.1:8100/)
rem         start.cmd 8130       (another port; Studio must allow that exact origin)
rem The Studio channel allows exact browser origins, so this script never moves to another port:
rem when the port is busy it reports the owning process and stops.
setlocal
cd /d "%~dp0"
set "PORT=%~1"
if "%PORT%"=="" set "PORT=8100"
where python >nul 2>&1
if errorlevel 1 (
  echo Python 3 was not found on PATH. Install it from python.org and run start.cmd again.
  exit /b 1
)
rem Busy means something ANSWERS on the port. netstat alone is not enough: for a minute after a server is stopped,
rem Windows keeps its old sockets (TIME_WAIT, FIN_WAIT, even LISTENING) with owner "process 0 / System"; those do
rem not block a new server, and this script used to refuse to start because of them (9 and 10 Nov 2026).
python -c "import socket,sys; s=socket.socket(); sys.exit(0 if s.connect_ex(('127.0.0.1',%PORT%))==0 else 1)" >nul 2>&1
if not errorlevel 1 (
  set "OWNER="
  for /f "tokens=5" %%p in ('netstat -ano -p tcp ^| findstr /R /C:":%PORT% .*LISTENING"') do set "OWNER=%%p"
  echo Cannot start: something answers on 127.0.0.1:%PORT%.
  if defined OWNER if not "%OWNER%"=="0" (
    echo It is process %OWNER%:
    for /f "tokens=1" %%n in ('tasklist /FI "PID eq %OWNER%" /NH') do echo   %%n
    echo If it is the live concierge or an older copy of this site, stop it from its own window first.
  )
  echo This script does not start another port, because the Studio channel only allows http://127.0.0.1:%PORT%
  pause
  exit /b 1
)
echo Fresh RSG site: http://127.0.0.1:%PORT%/
echo Press Ctrl+C in this window to stop the server.
start "" cmd /c "timeout /t 2 >nul & start "" http://127.0.0.1:%PORT%/"
python server.py %PORT%
