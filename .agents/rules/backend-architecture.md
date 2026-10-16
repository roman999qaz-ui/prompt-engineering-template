---
description: "Architectural boundaries, strict layering and dependency injection rules for the FastAPI backend."
trigger: glob
globs: ["backend/**"]
---
# Backend Architecture Boundaries

## Context
This project follows a strict layered architecture on the FastAPI backend with atomic JSON file persistence (`backend/data/`).

## Strict Layering Rules
1. **Routers (`backend/app/routers/`)**:
   - Handle incoming HTTP requests, route parameters, query parameters, request bodies, and response status codes.
   - Inject and call `Services`.
   - **Strict prohibition**: Routers **must never** import or call repositories directly, and **must never** read or write JSON storage files directly.
2. **Services (`backend/app/services/`)**:
   - Implement business logic, domain validations, orchestration, and business rules.
   - Coordinate with `Repositories` for data persistence and queries.
   - Raise standard HTTP exceptions (`fastapi.HTTPException`) or domain errors with descriptive detail messages.
3. **Repositories (`backend/app/repositories/`)**:
   - Encapsulate data access and persistence layer (reading and writing JSON entity files under `backend/data/`).
   - Implement query filtering, record lookup, creation, update, and deletion operations.
   - Use atomic read and write utilities (`app.utils.json_store`).
4. **Models (`backend/app/models/`) & Types (`backend/app/types/`)**:
   - Define Pydantic v2 schemas:
     - Request validation schemas (`*Request` / `*Create` / `*Update`)
     - Database storage schemas (`*InDb`)
     - API response schemas (`*Response`)
   - Define strongly typed IDs (`GameId`, `UserId`, `LibraryEntryId`) in `app/types/`.

## Dependency Injection Rules
- Always inject dependencies (repositories into services, services into routers) using FastAPI's `Depends()`.
- Centralize dependency providers in `backend/app/dependencies.py`.
- Never manually instantiate repositories or services inside route handler functions.
