# GameLibrary — Test Cases

## Environment & Setup

- **Backend API**: Running on `http://localhost:8001` (Swagger docs at `http://localhost:8001/docs`).
- **Frontend App**: Running on `http://localhost:5174`.
- **Data Persistence Files**: Located in `backend/data/` (`games.json`, `libraries.json`, `users.json`).

All test cases are defined as end-to-end scenarios covering user actions, UI state, API interactions, and storage verification across the full stack.

---

## 1. User Registration & Authentication

| ID | Title | Steps | Expected Result |
|----|-------|-------|-----------------|
| **TC-AUTH-01** | Successful Registration | 1. Open app as guest.<br>2. Click "Register".<br>3. Submit valid `username`, `email`, `password`. | Account created, user automatically authenticated or prompted to log in; user profile becomes accessible. |
| **TC-AUTH-02** | Duplicate Registration Rejection | 1. Attempt to register with an email or username already present in `users.json`. | UI displays validation error ("Email or username already in use"); API returns `409 Conflict`; no duplicate record saved. |
| **TC-AUTH-03** | Successful Login & Session | 1. Click "Log In".<br>2. Submit valid registered credentials. | User session established; navigation bar updates to show username, "My Library", and "Profile". |
| **TC-AUTH-04** | Invalid Login Credentials | 1. Submit incorrect password or non-existent email. | UI displays error ("Invalid credentials"); access to private library routes blocked; API returns `401 Unauthorized`. |
| **TC-AUTH-05** | Guest Route Guarding | 1. As unauthenticated visitor, navigate directly to `/library` or `/profile`. | User redirected to login modal or catalog; private data is not exposed. |

---

## 2. Catalog Browsing, Search & Filtering

| ID | Title | Steps | Expected Result |
|----|-------|-------|-----------------|
| **TC-CAT-01** | View Catalog Listing | 1. Navigate to `/catalog` or root URL. | Grid of available games loads displaying cover images, titles, genres, platforms, and release years. |
| **TC-CAT-02** | Search by Title Match | 1. Enter known game title (e.g. "Witcher") into search input. | Catalog immediately updates to show only matching games; URL query/filter state updates. |
| **TC-CAT-03** | Search with No Matches | 1. Enter a query that matches no games (e.g. "xyz123"). | Catalog displays "No games found." message with suggestion to clear search. |
| **TC-CAT-04** | Filter by Single Genre | 1. Select genre filter (e.g. "RPG"). | Only games containing "RPG" in their genre list are displayed. |
| **TC-CAT-05** | Filter by Platform | 1. Select platform filter (e.g. "Nintendo Switch"). | Only games available on "Nintendo Switch" are shown. |
| **TC-CAT-06** | Combined Multi-Filter | 1. Select genre "Action" AND platform "PlayStation" AND enter search term. | Results satisfy all criteria simultaneously. |

---

## 3. Game Details & Library Addition

| ID | Title | Steps | Expected Result |
|----|-------|-------|-----------------|
| **TC-DET-01** | View Game Details | 1. Click any game card in the catalog. | Game Details page opens showing title, full description, cover image, release date, developer, genres, and platforms. |
| **TC-DET-02** | Add Game as Authenticated User | 1. Log in.<br>2. On game details page, click "Add to Library". | Button updates to indicate game is in library; new record appended to `libraries.json` with status `"want_to_play"`. |
| **TC-DET-03** | Prevent Duplicate Library Additions | 1. Attempt to add a game that is already present in user's library. | "Add to Library" button is disabled or replaced with "In Library" status badge; API returns error if called. |
| **TC-DET-04** | Add Game Prompt for Guest | 1. As guest visitor, click "Add to Library" on game details. | Auth modal prompts visitor to register or log in; upon login, addition can proceed. |

---

## 4. Personal Library Management

| ID | Title | Steps | Expected Result |
|----|-------|-------|-----------------|
| **TC-LIB-01** | View My Library | 1. Navigate to "My Library" while logged in. | All games added by the user are displayed with their current status badge and rating. |
| **TC-LIB-02** | Filter Library by Status | 1. Click status tabs: "All", "Want to Play", "Playing", "Completed". | List filters instantly to show only games matching the active status tab. |
| **TC-LIB-03** | Change Play Status | 1. On a library game card, change status from "Want to Play" to "Playing". | Status badge updates immediately; record in `libraries.json` is updated; profile statistics recalculate. |
| **TC-LIB-04** | Set & Update Rating | 1. Select rating (e.g. 8/10) for a game.<br>2. Modify rating to 10/10. | Rating is saved in `libraries.json`; UI displays updated score; profile average rating updates. |
| **TC-LIB-05** | Rating Validation | 1. Submit rating outside the 1–10 range (e.g. 0, 11, or string). | Input is rejected with validation error; API returns `422 Unprocessable Entity`. |
| **TC-LIB-06** | Remove Game from Library | 1. Click "Remove from Library" on a game card.<br>2. Confirm removal prompt. | Game is removed from `libraries.json` and disappears from My Library; game remains intact in the global catalog. |

---

## 5. Profile & Statistics

| ID | Title | Steps | Expected Result |
|----|-------|-------|-----------------|
| **TC-PROF-01** | Accurate Stat Counters | 1. User has 2 Want to Play, 1 Playing, 2 Completed games.<br>2. Navigate to Profile. | Dashboard displays: Total = 5, Want to Play = 2, Playing = 1, Completed = 2. |
| **TC-PROF-02** | Average Rating Calculation | 1. User rates two games: 8 and 10.<br>2. Check profile average rating. | Displays average of 9.0; unrated games are excluded from the average calculation. |
| **TC-PROF-03** | Real-Time Stat Synchronization | 1. Move a game from "Playing" to "Completed" in My Library.<br>2. Switch to Profile. | Playing count decrements by 1; Completed count increments by 1 without requiring page reload. |

---

## 6. Tenant Isolation & Data Persistence

| ID | Title | Steps | Expected Result |
|----|-------|-------|-----------------|
| **TC-INT-01** | Multi-User Library Isolation | 1. User A adds Game X.<br>2. User B logs in. | User B's library does not display Game X; User B cannot edit or view User A's library entries. |
| **TC-INT-02** | Persistence Across Server Restarts | 1. Add games, change status, and submit ratings.<br>2. Restart backend server process.<br>3. Reload browser. | All library entries, statuses, and ratings remain intact from `libraries.json`. |
| **TC-INT-03** | Global Catalog Immutability | 1. User removes a game from their personal library. | Game entry in `games.json` remains completely unmodified. |
| **TC-INT-04** | Graceful Backend Offline Handling | 1. Stop backend service.<br>2. Attempt actions in frontend. | Clear visual error banner displayed; no unhandled crashes; retry action available when backend resumes. |

