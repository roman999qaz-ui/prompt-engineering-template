@echo off
setlocal enabledelayedexpansion

title GameLibrary Stop Script
echo ====================================================================
echo      GameLibrary - Stopping Background Services
echo ====================================================================
echo.

echo Stopping processes on port 8001 (FastAPI Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001 ^| findstr LISTENING') do (
    echo Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo Stopping processes on port 5174 (Vite Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING') do (
    echo Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All GameLibrary dev servers have been stopped.
echo ====================================================================
echo.
if "%1"=="" pause
