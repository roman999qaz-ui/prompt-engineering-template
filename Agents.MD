# Project agents guide

This repository is a full-stack boilerplate: **FastAPI** backend and **React 19 (TypeScript)** frontend.

## Layout

- `backend/` — API with layered architecture (`types`, `models`, `repositories`, `services`, `routers`, `utils`). Data is stored in JSON files under `backend/data/` (`games.json`, `libraries.json`, `users.json`). Uses **uv**, **Pydantic v2**, and FastAPI dependency injection (routers depend on services; services use repositories). Includes automated smoke test suite in `backend/scripts/test_api.py`.
- `frontend/` — **React 19 + TypeScript**, **Vite**, **Tailwind CSS v4**, **shadcn/ui**, **Redux Toolkit** (RTK Query for API, slices for UI state). Features full authentication (login/register modal, JWT bearer tokens, tenant isolation) and dynamic Dark/Light theme switching.
- `docs/` — Feature documentation organized by feature (`docs/<feature>/` containing business requirements, architecture, test cases).
- `.agents/` — AI Assistant configuration:
  - `rules/` — Modular scoped rules (`backend-architecture.md`, `frontend-architecture.md`, `coding-style.md`, `security-and-data.md`, `testing-and-contracts.md`, `documentation-standards.md`, `ui-ux-accessibility.md`).
  - `hooks.json` & `scripts/hook_handler.py` — Lifecycle hooks (PreToolUse security guard, PostToolUse syntax auditor, PreInvocation dynamic context, Stop quality gate).
  - `skills/` — Reusable domain procedures (`api-testing`, `run-app`, `quality-gate`, `stop-app`, `add-feature`, `data-management`, `catalog-sync`).

## Current scope

Domain feature: **GameLibrary** (`games`):
- Rich catalog of **2,279 games** with titles, high-resolution cover artwork, descriptions, genres, platforms, release years, and developers.
- Search and multi-criteria filtering by genre and platform.
- Personal library management: play status ("Want to Play", "Playing", "Completed"), custom 1–10 ratings, and removals.
- User profile with automatic real-time statistics calculation and multi-user tenant isolation.
- Dark and Light theme toggle.

## Working conventions

- Add new features under the same layer folders on the backend and under `src/features/` on the frontend.
- Document each feature under `docs/<feature>/` (e.g. `docs/games/`).
- Follow strict architectural boundaries defined in `.agents/rules/`.
- Never wipe or truncate `backend/data/games.json`.
- Keep AI assistant entry points minimal: this file is the source of truth; `Claude.md` points here.

## Local development & Tooling

- One-click launch: run `start.bat` from project root (starts backend on `8001`, frontend on `5174`, opens browser).
- One-click stop: run `stop.bat` to cleanly terminate background dev servers.
- One-click quality gate (lint, format, types): run `check.bat`.
- Automated smoke testing: run `test.bat` (or `cd backend && uv run python -m scripts.test_api`).
- Interactive API Docs: `http://localhost:8001/docs` (Swagger UI).
- Manual start:
  1. Backend: from `backend/`, run `uv sync` then `uv run dev`.
  2. Frontend: from `frontend/`, run `npm install` then `npm run dev`.

