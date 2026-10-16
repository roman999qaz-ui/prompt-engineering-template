@echo off
setlocal

title GameLibrary Code Quality Runner
echo ====================================================================
echo      GameLibrary - Quality Gate (Linter, Formatter, Type Checker)
echo ====================================================================
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"

echo [1/6] Backend Linter (Ruff)...
cd /d "%BACKEND_DIR%"
call uv run ruff check app
if %ERRORLEVEL% NEQ 0 goto :failed

echo.
echo [2/6] Backend Formatter Check (Ruff)...
call uv run ruff format --check app
if %ERRORLEVEL% NEQ 0 goto :failed

echo.
echo [3/6] Backend Type Checker (Mypy)...
call uv run mypy app
if %ERRORLEVEL% NEQ 0 goto :failed

echo.
echo [4/6] Frontend Linter (Oxlint)...
cd /d "%FRONTEND_DIR%"
call npm run lint
if %ERRORLEVEL% NEQ 0 goto :failed

echo.
echo [5/6] Frontend Formatter Check (Prettier)...
call npm run format:check
if %ERRORLEVEL% NEQ 0 goto :failed

echo.
echo [6/6] Frontend Type Checker (TypeScript)...
call npm run type-check
if %ERRORLEVEL% NEQ 0 goto :failed

echo.
echo ====================================================================
echo [SUCCESS] All linters, formatters, and type checkers passed!
echo ====================================================================
goto :end

:failed
echo.
echo ====================================================================
echo [FAILURE] Quality checks encountered errors. See trace above.
echo ====================================================================

:end
echo.
if "%1"=="" pause
