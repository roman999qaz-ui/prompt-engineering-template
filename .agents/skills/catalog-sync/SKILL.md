---
name: catalog-sync
description: >-
  Use this skill to import, enrich, and synchronize games from external web APIs (SteamSpy, FreeToGame) into backend/data/games.json.
---

# Catalog Sync Skill

Instructions for updating and augmenting the GameLibrary catalog using automated ingestion scripts while protecting curated titles.

## Architecture
The sync engine resides in `backend/scripts/import_games.py` and coordinates:
1. **Curated Preservation**: Loads existing `games.json` and preserves all curated AAA entries (rich descriptions, multi-platform tags).
2. **SteamSpy API**: Fetches top games and genre classifications (`https://steamspy.com/api.php?request=genre&genre=...`).
3. **FreeToGame API**: Ingests popular free-to-play titles (`https://www.freetogame.com/api/games`).
4. **Data Normalization**: Cleans title strings, normalizes release years, formats genres, and infers multi-platform availability.

## Execution Procedure

### Step 1: Create Backup
Always backup the existing dataset before syncing:
```powershell
Copy-Item backend\data\games.json backend\data\games.backup.json
```

### Step 2: Run Import Script
From `backend/`:
```bash
cd backend
uv run python -m scripts.import_games
```

### Step 3: Verify Integrity
1. Check total count (should be > 2,000 games):
```powershell
uv run python -c "import json; g = json.load(open('backend/data/games.json', encoding='utf-8')); print(f'Total games: {len(g)}')"
```
2. Run smoke tests:
```cmd
test.bat
```
3. Restart backend or trigger health check:
```cmd
curl http://localhost:8001/health
```
