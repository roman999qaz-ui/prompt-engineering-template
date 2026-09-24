# Security and Data Management Rules

## Authentication & Passwords
1. **Password Security**: Passwords must never be stored in plaintext. Use salted hashes (`hashlib.pbkdf2_hmac` with at least 100,000 iterations).
2. **Session / Token Verification**: Protected endpoints must validate the user session/token and raise `401 Unauthorized` when invalid or missing.
3. **Tenant Isolation**: When operating on user libraries, every database/repository lookup, mutation, and deletion MUST be scoped to the authenticated user's `user_id`. Never trust client-supplied `user_id` in request bodies.

## Data Persistence & Integrity
1. **Atomic File Writes**: JSON store writes must ensure complete object arrays are written without partial corruption.
2. **Catalog Immutability**: Actions in a user's library (adding, removing, rating) must NEVER mutate or delete items from the global catalog (`games.json`).
