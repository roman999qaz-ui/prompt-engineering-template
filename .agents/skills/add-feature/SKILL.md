---
name: add-feature
description: >-
  Use this skill to guide the end-to-end implementation of new full-stack features following strict layering, typing, and architectural rules.
---

# Add Feature Skill

Step-by-step procedure for designing, documenting, and implementing new features across both FastAPI backend and React frontend.

## 1. Documentation First
Before writing code, establish feature requirements and contracts under `docs/<feature>/`:
- `business-requirements.md`: user stories, functional scope, acceptance criteria.
- `architecture.md`: layer breakdown, data flow, DTO contracts.
- `test-cases.md`: manual and automated test specifications.

## 2. Backend Implementation Flow (Strict Layering)
Implement strictly from core types out to API endpoints:
1. **Types (`backend/app/types/<feature>.py`)**:
   - Define strong ID types (e.g. `NewEntityId = NewType("NewEntityId", str)`) or Enums.
2. **Models (`backend/app/models/<feature>.py`)**:
   - Pydantic v2 schemas: `*Request` (incoming validation), `*InDb` (file store schema), `*Response` (outgoing DTO).
3. **Repository (`backend/app/repositories/<feature>_repository.py`)**:
   - Encapsulate file persistence with `app.utils.json_store` (`read_list_file`, `write_list_file`).
   - Implement query, filter, get, create, update, delete methods.
4. **Service (`backend/app/services/<feature>_service.py`)**:
   - Pure business logic, validations, HTTPException raising (with status codes).
   - Coordinate repositories; never directly touch files.
5. **Dependency Injection (`backend/app/dependencies.py`)**:
   - Register provider functions: `get_<feature>_repo()` and `get_<feature>_service()`.
6. **Router (`backend/app/routers/<feature>.py`)**:
   - Declare APIRouter, inject service with `Depends(get_<feature>_service)`.
   - Mount router in `backend/app/main.py`.

## 3. Frontend Implementation Flow
1. **Types (`frontend/src/types/<feature>.ts`)**:
   - TypeScript interfaces mirroring backend Response and Request DTOs.
2. **Server Cache (`frontend/src/store/api/<feature>Api.ts`)**:
   - RTK Query API slice with `providesTags` and `invalidatesTags`.
   - Register reducer and middleware in `frontend/src/store/store.ts`.
3. **UI / Feature Components (`frontend/src/features/<feature>/`)**:
   - Domain-specific views, dialogs, cards.
   - Use custom hooks (`src/hooks/`) for state composition.
   - Use headless UI primitives (`src/components/ui/`) for styling.
4. **Navigation**:
   - Add routes / tabs in `frontend/src/App.tsx` and links in `frontend/src/components/Navbar.tsx`.

## 4. Verification & Testing
1. Add automated test cases in `backend/scripts/test_api.py`.
2. Run smoke tests:
   ```cmd
   test.bat
   ```
3. Run the complete quality gate:
   ```cmd
   check.bat
   ```
