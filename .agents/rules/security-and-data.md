---
description: "Security standards, tenant isolation, authentication requirements, and JSON file store data protection."
trigger: glob
globs: ["backend/app/**", "backend/data/**", "frontend/src/**"]
---
# Security and Data Management Rules

## 1. Authentication & Passwords
1. **Password Hashing**: Passwords must never be stored in plaintext. Always use salted PBKDF2 (`hashlib.pbkdf2_hmac` with SHA-256 and at least 100,000 iterations).
2. **Session & Token Verification**:
   - Protected API routes must depend on authentication token verification (`get_current_user` in `backend/app/dependencies.py`).
   - Invalid or missing tokens must return `401 Unauthorized`.
3. **Tenant Isolation**:
   - Every database and repository lookup, mutation, and deletion on user libraries **must** be scoped to the authenticated user's `user_id`.
   - Never trust client-supplied `user_id` in request bodies or query parameters. Always extract `user_id` directly from the authenticated session/token.

## 2. Data Persistence & File Store Integrity
1. **Atomic File Writes**:
   - All mutations to JSON files in `backend/data/` (`games.json`, `users.json`, `libraries.json`) must use atomic read-modify-write patterns (`app.utils.json_store`).
   - Partial writes or raw file truncation are strictly forbidden.
2. **Global Catalog Immutability**:
   - The game catalog (`backend/data/games.json`) is a shared, read-only entity for normal application users.
   - User actions (adding to library, updating status, rating, removing) must **never** modify or delete items from `games.json`.
3. **Data Loss Prevention**:
   - Never overwrite JSON store files with empty lists or unvalidated payloads.
   - Always validate data models with Pydantic before committing to disk.
