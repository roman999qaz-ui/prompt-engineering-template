---
name: api-testing
description: >-
  Use this skill to run automated smoke verification tests against the GameLibrary FastAPI backend endpoints.
---

# API Testing Skill

Run automated smoke tests against the GameLibrary API following the test cases in `docs/games/test-cases.md`.

## Execution
Run the verification test script using Python:
```bash
cd backend
uv run python -m scripts.test_api
```

## Coverage
- **Auth**: Registration, duplicate rejection, login, and token authentication.
- **Catalog**: Game listing, title search, genre filtering, platform filtering.
- **Library**: Adding game with default "want_to_play", updating status, updating rating (1-10), deletion.
- **Stats**: Verifying calculated totals and averages on `/api/users/me/stats`.
