@echo off
setlocal

title GameLibrary Smoke Test Runner
echo ====================================================================
echo      GameLibrary - Automated Smoke Verification Test Suite
echo ====================================================================
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"

if not exist "%BACKEND_DIR%" (
    echo [ERROR] Backend directory not found: "%BACKEND_DIR%"
    pause
    exit /b 1
)

cd /d "%BACKEND_DIR%"
echo Running API smoke tests (docs/games/test-cases.md)...
echo.
uv run python -m scripts.test_api

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================================
    echo [SUCCESS] All GameLibrary API test cases passed successfully!
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo [FAILURE] Test suite encountered errors. See trace above.
    echo ====================================================================
)

echo.
if "%1"=="" pause
