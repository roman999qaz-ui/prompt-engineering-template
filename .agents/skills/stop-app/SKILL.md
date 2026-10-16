---
name: stop-app
description: >-
  Use this skill to cleanly terminate backend (FastAPI, port 8001) and frontend (Vite, port 5174) dev servers and free hanging ports.
---

# Stop Application Skill

Safely terminate all background development services and prevent port collisions on Windows.

## One-Click Termination (Windows)

Run the root batch script:
```cmd
stop.bat
```

## Manual Termination via PowerShell / Command Prompt

### 1. Free Port 8001 (FastAPI / Uvicorn)
```powershell
Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
Or via CMD:
```cmd
for /f "tokens=5" %a in ('netstat -aon ^| findstr :8001 ^| findstr LISTENING') do taskkill /F /PID %a
```

### 2. Free Port 5174 (React / Vite)
```powershell
Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```
Or via CMD:
```cmd
for /f "tokens=5" %a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING') do taskkill /F /PID %a
```

## Verification
Confirm that no processes are holding the ports:
```cmd
netstat -aon | findstr :8001
netstat -aon | findstr :5174
```
Both commands should return empty output when successfully stopped.
