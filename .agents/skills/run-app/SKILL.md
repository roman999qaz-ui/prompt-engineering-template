---
name: run-app
description: >-
  Use this skill to run, start, and verify the backend (FastAPI) and frontend (React/Vite) servers for local development.
---

# Run Application Skill

Instructions for launching both ends of the GameLibrary full-stack application.

## 1. Backend Server (FastAPI)
From `backend/`:
```bash
uv sync
uv run dev
```
- Host: `0.0.0.0` or `localhost`
- Port: `8001`
- Swagger UI: `http://localhost:8001/docs`
- Health check: `http://localhost:8001/health`

## 2. Frontend Dev Server (React + Vite)
From `frontend/`:
```bash
npm install
npm run dev
```
- Port: `5174`
- URL: `http://localhost:5174`
- Proxies / targets API at `http://localhost:8001/api`

## Verification
- Verify backend: `curl http://localhost:8001/health` should return `{"status":"ok"}`.
- Verify frontend: check `http://localhost:5174` in browser.
