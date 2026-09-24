from typing import Optional

from fastapi import HTTPException, status

from app.models.game import GameResponse
from app.repositories.game_repository import GameRepository


class GameService:
    def __init__(self, game_repo: GameRepository):
        self._game_repo = game_repo

    def list_games(
        self,
        search: Optional[str] = None,
        genre: Optional[str] = None,
        platform: Optional[str] = None,
    ) -> list[GameResponse]:
        games = self._game_repo.list_all(search=search, genre=genre, platform=platform)
        return [GameResponse.model_validate(g) for g in games]

    def get_game(self, game_id: str) -> GameResponse:
        game = self._game_repo.get_by_id(game_id)
        if not game:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Game with id {game_id} not found",
            )
        return GameResponse.model_validate(game)
