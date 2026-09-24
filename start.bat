@echo off
setlocal

title GameLibrary Launcher
echo ====================================================================
echo      GameLibrary Full-Stack Application Launcher
echo ====================================================================
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

if not exist "%BACKEND_DIR%" (
    echo [ERROR] Backend directory not found: "%BACKEND_DIR%"
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo [ERROR] Frontend directory not found: "%FRONTEND_DIR%"
    pause
    exit /b 1
)

echo [1/3] Starting FastAPI Backend on port 8001...
start "GameLibrary - Backend API (Port 8001)" cmd /k "cd /d "%BACKEND_DIR%" && title GameLibrary Backend (Port 8001) && echo Syncing backend dependencies... && uv sync && echo Starting uvicorn server... && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8001"

echo [2/3] Starting React / Vite Frontend on port 5174...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo       node_modules not found. Running npm install first...
    start "GameLibrary - Frontend UI (Port 5174)" cmd /k "cd /d "%FRONTEND_DIR%" && title GameLibrary Frontend (Port 5174) && echo Installing node dependencies... && npm install && echo Starting Vite development server... && npm run dev"
) else (
    start "GameLibrary - Frontend UI (Port 5174)" cmd /k "cd /d "%FRONTEND_DIR%" && title GameLibrary Frontend (Port 5174) && echo Starting Vite development server... && npm run dev"
)

echo [3/3] Waiting for servers to initialize...
ping 127.0.0.1 -n 4 >nul

echo.
echo ====================================================================
echo   All services have been launched!
echo.
echo   - Frontend Web UI:  http://localhost:5174
echo   - Backend REST API: http://localhost:8001
echo   - API Swagger Docs: http://localhost:8001/docs
echo   - API Health Check: http://localhost:8001/health
echo ====================================================================
echo.
echo Opening browser in 2 seconds...
ping 127.0.0.1 -n 3 >nul
start http://localhost:5174

echo.
echo [INFO] You can minimize or close this launcher window.
echo        Servers will continue running in their respective command windows.
echo        To stop servers, close their terminal windows or press Ctrl+C.
echo.
pause
