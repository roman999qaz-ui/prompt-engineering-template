from pathlib import Path
from typing import Optional

from app.models.game import GameInDb
from app.utils.json_store import read_list_file, write_list_file


class GameRepository:
    def __init__(self, storage_path: Path):
        self._path = storage_path

    def list_all(
        self,
        search: Optional[str] = None,
        genre: Optional[str] = None,
        platform: Optional[str] = None,
    ) -> list[GameInDb]:
        games = read_list_file(self._path, GameInDb)

        if search:
            query = search.strip().lower()
            games = [g for g in games if query in g.title.lower()]

        if genre:
            target_genre = genre.strip().lower()
            games = [
                g for g in games if any(target_genre == gen.lower() for gen in g.genres)
            ]

        if platform:
            target_platform = platform.strip().lower()
            games = [
                g
                for g in games
                if any(target_platform == plat.lower() for plat in g.platforms)
            ]

        return games

    def get_by_id(self, game_id: str) -> Optional[GameInDb]:
        games = read_list_file(self._path, GameInDb)
        for g in games:
            if g.id == game_id:
                return g
        return None

    def create(self, game: GameInDb) -> GameInDb:
        games = read_list_file(self._path, GameInDb)
        games.append(game)
        write_list_file(self._path, games)
        return game
