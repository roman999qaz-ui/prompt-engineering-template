from typing import Optional

from fastapi import APIRouter, Depends

from app.dependencies import get_game_service
from app.models.game import GameResponse
from app.services.game_service import GameService

router = APIRouter(prefix="/games", tags=["games"])


@router.get("", response_model=list[GameResponse])
def list_games(
    search: Optional[str] = None,
    genre: Optional[str] = None,
    platform: Optional[str] = None,
    game_service: GameService = Depends(get_game_service),
) -> list[GameResponse]:
    return game_service.list_games(search=search, genre=genre, platform=platform)


@router.get("/{game_id}", response_model=GameResponse)
def get_game(
    game_id: str,
    game_service: GameService = Depends(get_game_service),
) -> GameResponse:
    return game_service.get_game(game_id)
