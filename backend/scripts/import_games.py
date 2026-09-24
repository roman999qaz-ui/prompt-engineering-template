"""Script to import real games from Steam Database (SteamSpy) and FreeToGame Database
into backend/data/games.json, while preserving curated titles.
"""

import json
from pathlib import Path
import re
import uuid
import httpx

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
GAMES_FILE = DATA_DIR / "games.json"

NON_GAME_TITLES = {
    "wallpaper engine",
    "soundpad",
    "3dmark",
    "aseprite",
    "blender",
    "source sdk",
    "steamvr",
    "lossless scaling",
    "voicemeeter",
}

VALVE_APPIDS = {
    730: 2012,  # CS:GO / CS2
    570: 2013,  # Dota 2
    440: 2007,  # TF2
    550: 2009,  # L4D2
    620: 2011,  # Portal 2
    400: 2007,  # Portal
    220: 2004,  # Half-Life 2
    10: 2000,  # Counter-Strike 1.6
    240: 2004,  # CS: Source
    300: 2004,  # Day of Defeat: Source
}

KNOWN_YEARS = {
    1091500: 2020,  # Cyberpunk 2077
    292030: 2015,  # The Witcher 3
    1245620: 2022,  # Elden Ring
    271590: 2015,  # GTA V PC
    1172470: 2020,  # Apex Legends
    578080: 2017,  # PUBG
    1623730: 2024,  # Palworld
    2358720: 2024,  # Black Myth: Wukong
    1086940: 2023,  # Baldur's Gate 3
    1172620: 2020,  # Sea of Thieves
    252490: 2018,  # Rust
    346110: 2017,  # ARK
    105600: 2011,  # Terraria
    413150: 2016,  # Stardew Valley
    367520: 2017,  # Hollow Knight
    1145360: 2020,  # Hades
    553850: 2024,  # Helldivers 2
    2246340: 2025,  # Monster Hunter Wilds
    2694490: 2024,  # Path of Exile 2
    1599340: 2022,  # Lost Ark
    230410: 2013,  # Warframe
    236390: 2013,  # War Thunder
    304930: 2014,  # Unturned
    1063730: 2021,  # New World
    1938090: 2022,  # COD MW II
}


def estimate_release_year(appid: int) -> int:
    if appid in VALVE_APPIDS:
        return VALVE_APPIDS[appid]
    if appid in KNOWN_YEARS:
        return KNOWN_YEARS[appid]
    if appid < 20000:
        return 2008
    elif appid < 60000:
        return 2010
    elif appid < 150000:
        return 2011
    elif appid < 250000:
        return 2013
    elif appid < 350000:
        return 2014
    elif appid < 450000:
        return 2015
    elif appid < 600000:
        return 2016
    elif appid < 750000:
        return 2017
    elif appid < 950000:
        return 2018
    elif appid < 1150000:
        return 2019
    elif appid < 1400000:
        return 2020
    elif appid < 1700000:
        return 2021
    elif appid < 2000000:
        return 2022
    elif appid < 2350000:
        return 2023
    else:
        return 2024


def normalize_freetogame_genre(raw_genre: str) -> list[str]:
    genre = raw_genre.strip()
    mapping = {
        "ARPG": ["RPG", "Action"],
        "Action RPG": ["RPG", "Action"],
        "MMOARPG": ["RPG", "Action", "MMORPG"],
        "Action Game": ["Action"],
        "Dungeon Crawler": ["RPG", "Adventure"],
        "Fantasy": ["RPG", "Adventure"],
        "MMO": ["MMORPG"],
        "MMORPG": ["MMORPG"],
        "Social": ["Simulation", "Indie"],
        "Battle Royale": ["Battle Royale", "Action"],
        "Card Game": ["Card Game", "Strategy"],
        "Fighting": ["Fighting", "Action"],
        "MOBA": ["MOBA", "Strategy"],
        "Sports": ["Sports"],
        "Racing": ["Racing"],
        "Shooter": ["Shooter", "Action"],
        "Strategy": ["Strategy"],
        "RPG": ["RPG"],
        "Action": ["Action"],
    }
    return mapping.get(genre, [genre])


def normalize_platforms(
    developer: str, publisher: str, positive_reviews: int = 0
) -> list[str]:
    platforms = ["PC"]
    dev_pub = f"{developer} {publisher}".lower()
    multiplatform_publishers = [
        "electronic arts",
        "ubisoft",
        "capcom",
        "square enix",
        "bethesda",
        "activision",
        "rockstar",
        "bandai namco",
        "sega",
        "warner bros",
        "2k",
        "cd projekt",
        "konami",
        "playstation",
        "xbox",
        "fromsoftware",
    ]
    if (
        any(pub in dev_pub for pub in multiplatform_publishers)
        or positive_reviews > 80000
    ):
        platforms.extend(["PlayStation", "Xbox"])
    return platforms


def import_games():
    final_games = []
    seen_titles = set()

    # 1. Load curated games from existing file
    if GAMES_FILE.exists():
        try:
            with open(GAMES_FILE, "r", encoding="utf-8") as f:
                existing_list = json.load(f)
            # Find curated games (like Witcher 3, Cyberpunk, Breath of the Wild, etc.)
            for g in existing_list:
                # If it's a curated AAA game (has rich description or console platform)
                if (
                    "Nintendo Switch" in g.get("platforms", [])
                    or "PlayStation" in g.get("platforms", [])
                    or len(g.get("description", "")) > 120
                ):
                    title_norm = re.sub(r"[^a-z0-9]", "", g["title"].lower())
                    if title_norm not in seen_titles:
                        seen_titles.add(title_norm)
                        final_games.append(g)
            print(f"Preserved {len(final_games)} curated high-profile titles.")
        except Exception as e:
            print(f"Could not load existing games: {e}")

    # 2. Fetch genre mapping from SteamSpy
    print("Fetching genre classifications from SteamSpy...")
    genres_to_fetch = [
        ("Action", "Action"),
        ("Strategy", "Strategy"),
        ("RPG", "RPG"),
        ("Indie", "Indie"),
        ("Adventure", "Adventure"),
        ("Simulation", "Simulation"),
        ("Sports", "Sports"),
        ("Racing", "Racing"),
        ("Massively+Multiplayer", "MMORPG"),
    ]
    appid_genres = {}
    with httpx.Client(
        timeout=25.0, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    ) as client:
        for query_genre, label in genres_to_fetch:
            try:
                res = client.get(
                    f"https://steamspy.com/api.php?request=genre&genre={query_genre}"
                )
                if res.status_code == 200:
                    data = res.json()
                    for aid in data.keys():
                        appid_genres.setdefault(int(aid), []).append(label)
                    print(f"  Mapped {len(data)} games for genre '{label}'")
            except Exception as e:
                print(f"  Warning: failed to fetch genre '{label}': {e}")

        # 3. Fetch top Steam games (pages 0 and 1 = 2000 top games)
        print("Fetching top Steam games database (pages 0 & 1)...")
        steam_games_raw = {}
        for page in [0, 1]:
            try:
                res = client.get(
                    f"https://steamspy.com/api.php?request=all&page={page}"
                )
                if res.status_code == 200:
                    data = res.json()
                    steam_games_raw.update(data)
                    print(f"  Fetched {len(data)} games from SteamSpy page {page}")
            except Exception as e:
                print(f"  Error fetching SteamSpy page {page}: {e}")

        # 4. Fetch FreeToGame database
        print("Fetching FreeToGame database...")
        freetogame_list = []
        try:
            res = client.get("https://www.freetogame.com/api/games")
            if res.status_code == 200:
                freetogame_list = res.json()
                print(f"  Fetched {len(freetogame_list)} games from FreeToGame")
        except Exception as e:
            print(f"  Error fetching FreeToGame: {e}")

    # Process Steam games
    steam_added = 0
    for appid_str, item in steam_games_raw.items():
        try:
            aid = int(appid_str)
        except ValueError:
            continue

        raw_name = item.get("name", "").strip()
        if not raw_name:
            continue

        name_lower = raw_name.lower()
        if any(non in name_lower for non in NON_GAME_TITLES):
            continue

        norm_title = re.sub(r"[^a-z0-9]", "", name_lower)
        if norm_title in seen_titles:
            continue

        seen_titles.add(norm_title)

        dev = (
            item.get("developer", "").strip()
            or item.get("publisher", "").strip()
            or "Independent Developer"
        )
        pub = item.get("publisher", "").strip() or dev
        positive = item.get("positive", 0)
        genres = appid_genres.get(aid, [])
        if not genres:
            genres = ["Action", "Adventure"]

        platforms = normalize_platforms(dev, pub, positive)
        year = estimate_release_year(aid)
        cover_image = f"https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/{aid}/header.jpg"

        primary_genre = genres[0]
        desc = (
            f"{raw_name} is an acclaimed {primary_genre} title developed by {dev}. "
            f"Featuring immersive gameplay and rich mechanics, it has garnered over "
            f"{positive:,} positive reviews from players worldwide on Steam."
        )

        game_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"steam-{aid}"))
        final_games.append(
            {
                "id": game_id,
                "title": raw_name,
                "description": desc,
                "cover_image": cover_image,
                "genres": genres[:3],
                "platforms": platforms,
                "release_year": year,
                "developer": dev,
            }
        )
        steam_added += 1

    print(f"Added {steam_added} games from Steam database.")

    # Process FreeToGame games
    ftg_added = 0
    for item in freetogame_list:
        raw_name = item.get("title", "").strip()
        if not raw_name:
            continue

        norm_title = re.sub(r"[^a-z0-9]", "", raw_name.lower())
        if norm_title in seen_titles:
            continue

        seen_titles.add(norm_title)

        release_date = item.get("release_date", "")
        year = 2022
        if release_date:
            parts = release_date.split("-")
            if parts and parts[0].isdigit():
                year = int(parts[0])

        platforms = ["PC"]
        if "web" in item.get("platform", "").lower():
            platforms.append("Web Browser")

        game_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"freetogame-{item['id']}"))
        final_games.append(
            {
                "id": game_id,
                "title": raw_name,
                "description": item.get(
                    "short_description",
                    f"Experience {raw_name}, a premier online multiplayer game.",
                ),
                "cover_image": item.get("thumbnail", ""),
                "genres": normalize_freetogame_genre(item.get("genre", "Action")),
                "platforms": platforms,
                "release_year": year,
                "developer": item.get("developer")
                or item.get("publisher")
                or "Unknown Developer",
            }
        )
        ftg_added += 1

    print(f"Added {ftg_added} games from FreeToGame database.")
    print(f"Total games in database: {len(final_games)}")

    with open(GAMES_FILE, "w", encoding="utf-8") as f:
        json.dump(final_games, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(final_games)} games to {GAMES_FILE}!")


if __name__ == "__main__":
    import_games()
