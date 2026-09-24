# Architecture Boundaries Rule

## Context
This project is a full-stack vertical application consisting of a FastAPI backend and a React (TypeScript) frontend.

## Backend Architectural Rules
1. **Strict Layering**:
   - `Routers` handle HTTP requests, path/query extraction, status codes, and call `Services`. Routers **must never** call repositories or directly access JSON files.
   - `Services` implement domain rules, business validations, and coordinate `Repositories`. Services raise domain exceptions (e.g. `GameNotFoundError`, `DuplicateLibraryEntryError`).
   - `Repositories` encapsulate storage persistence (atomic JSON file load and save) and low-level filtering.
   - `Models` define Pydantic schemas for request validation (`*Request`), database storage (`*InDb`), and API responses (`*Response`).
2. **Dependency Injection**:
   - Always inject services into routers using FastAPI's `Depends()`.
   - Never instantiate repositories or services directly inside route handlers.

## Frontend Architectural Rules
1. **State Division**:
   - Server state (catalog games, user library, profile stats) must be managed exclusively through **RTK Query** endpoints in `src/store/api/`.
   - Client UI state (active modal, current view, active filter selection) must be managed through standard **Redux Toolkit slices** in `src/store/slices/` or custom React hooks in `src/hooks/`.
2. **Component Separation**:
   - Feature views belong in `src/features/<feature>/`.
   - Shared reusable UI primitives belong in `src/components/ui/` (shadcn/ui style).
   - Global navigation and layout belong in `src/components/`.
