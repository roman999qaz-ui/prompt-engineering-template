---
description: "API testing standards, test case specifications, HTTP status code contracts, and frontend/backend type parity."
trigger: glob
globs: ["backend/scripts/**", "backend/app/routers/**", "frontend/src/store/api/**", "docs/**/test-cases.md"]
---
# Testing & API Contracts Rules

## 1. Automated Smoke Verification (`test_api.py`)
1. **Mandatory Test Parity**: Every public API endpoint must have a corresponding test case in `backend/scripts/test_api.py`.
2. **Regression Prevention**: Never delete or disable existing test cases in `test_api.py` to make a failing test pass.
3. **Execution**: Tests must pass with exit code `0` before completing any API modification or feature additions:
   ```bash
   uv run python -m scripts.test_api
   ```

## 2. HTTP Status Code Contracts
1. **Standardized Status Codes**:
   - `200 OK`: Successful read or update operations.
   - `201 Created`: Successful entity creation (e.g., user registration, adding game to library).
   - `204 No Content`: Successful deletion operations.
   - `400 Bad Request`: Malformed requests or invalid query parameters.
   - `401 Unauthorized`: Missing, expired, or invalid authentication tokens.
   - `403 Forbidden`: Authenticated user attempting an operation outside their authorized scope.
   - `404 Not Found`: Requested entity (game, user, library item) does not exist.
   - `409 Conflict`: Resource collision (e.g. duplicate username, duplicate library entry).
   - `422 Unprocessable Entity`: Pydantic request validation failure (e.g. rating < 1 or > 10).

## 3. End-to-End Type Parity
1. **Single Source of Truth**:
   - Backend Pydantic response models (`*Response`) define the network contract.
   - Frontend TypeScript interfaces under `frontend/src/types/` must strictly mirror backend Pydantic schemas (field names, optionality, nullability).
2. **No Untyped Boundaries**:
   - Avoid `any` in RTK Query endpoints.
   - Request payloads must use typed interfaces extending backend `*Request` models.
