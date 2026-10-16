---
name: data-management
description: >-
  Use this skill to safely inspect, query, back up, and validate JSON data stores in backend/data/ while enforcing tenant isolation and catalog immutability.
---

# Data Management Skill

Procedures and invariants for interacting with the file-based persistence layer under `backend/data/`.

## Data Stores
- `backend/data/games.json`: Global catalog of 2,279 games. **IMMUTABLE** during normal operations.
- `backend/data/users.json`: Registered users with salted password hashes (`hashlib.pbkdf2_hmac`).
- `backend/data/libraries.json`: User library tracking entries (`user_id`, `game_id`, `status`, `rating`, `notes`, `updated_at`).

## Invariant Rules
1. **Never wipe or truncate `games.json`**:
   - The catalog must never be cleared, overwritten with empty lists, or mutated by user library operations.
2. **Tenant Isolation**:
   - All queries and mutations in `libraries.json` must be strictly filtered by `user_id`.
   - Never allow user A to view, modify, or delete user B's library items.
3. **Atomic File Operations**:
   - Always read and write via `app.utils.json_store.read_list_file` and `app.utils.json_store.write_list_file`.
   - Never use raw file writes that could lead to partial or corrupted JSON on process termination.

## Backup & Recovery
Before running migration or sync scripts:
```powershell
Copy-Item backend\data\games.json backend\data\games.backup.json
Copy-Item backend\data\users.json backend\data\users.backup.json
Copy-Item backend\data\libraries.json backend\data\libraries.backup.json
```

To verify JSON validity:
```powershell
uv run python -c "import json; json.load(open('backend/data/games.json', encoding='utf-8')); print('games.json OK')"
```
