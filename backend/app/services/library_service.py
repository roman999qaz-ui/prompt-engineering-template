from datetime import datetime, timezone
from typing import Optional
import uuid

from fastapi import HTTPException, status

from app.models.game import GameResponse
from app.models.library import (
    LibraryEntryInDb,
    LibraryEntryResponse,
    UserStatsResponse,
)
from app.repositories.game_repository import GameRepository
from app.repositories.library_repository import LibraryRepository
from app.types.library import PlayStatus


class LibraryService:
    def __init__(
        self, library_repo: LibraryRepository, game_repo: GameRepository
    ):
        self._library_repo = library_repo
        self._game_repo = game_repo

    def list_user_library(
        self, user_id: str, status_filter: Optional[PlayStatus] = None
    ) -> list[LibraryEntryResponse]:
        entries = self._library_repo.list_by_user(user_id, status=status_filter)
        response: list[LibraryEntryResponse] = []
        for e in entries:
            game = self._game_repo.get_by_id(e.game_id)
            game_resp = GameResponse.model_validate(game) if game else None
            response.append(
                LibraryEntryResponse(
                    id=e.id,
                    user_id=e.user_id,
                    game_id=e.game_id,
                    status=e.status,
                    rating=e.rating,
                    created_at=e.created_at,
                    updated_at=e.updated_at,
                    game=game_resp,
                )
            )
        return response

    def add_to_library(self, user_id: str, game_id: str) -> LibraryEntryResponse:
        # Validate game exists
        game = self._game_repo.get_by_id(game_id)
        if not game:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Game with id {game_id} not found",
            )

        # BR-02: Check duplicate
        existing = self._library_repo.get_by_user_and_game(user_id, game_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Game is already in your library",
            )

        now = datetime.now(timezone.utc)
        entry = LibraryEntryInDb(
            id=str(uuid.uuid4()),
            user_id=user_id,
            game_id=game_id,
            status=PlayStatus.WANT_TO_PLAY,  # BR-03: default want_to_play
            rating=None,
            created_at=now,
            updated_at=now,
        )
        self._library_repo.create(entry)

        return LibraryEntryResponse(
            id=entry.id,
            user_id=entry.user_id,
            game_id=entry.game_id,
            status=entry.status,
            rating=entry.rating,
            created_at=entry.created_at,
            updated_at=entry.updated_at,
            game=GameResponse.model_validate(game),
        )

    def update_entry(
        self,
        entry_id: str,
        user_id: str,
        new_status: Optional[PlayStatus] = None,
        new_rating: Optional[int] = None,
    ) -> LibraryEntryResponse:
        entry = self._library_repo.get_by_id(entry_id)
        if not entry or entry.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Library entry {entry_id} not found",
            )

        if new_status is not None:
            entry.status = new_status
        if new_rating is not None:
            # BR-05: Rating must be 1 to 10
            if new_rating < 1 or new_rating > 10:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Rating must be an integer between 1 and 10",
                )
            entry.rating = new_rating

        entry.updated_at = datetime.now(timezone.utc)
        self._library_repo.update(entry)

        game = self._game_repo.get_by_id(entry.game_id)
        game_resp = GameResponse.model_validate(game) if game else None

        return LibraryEntryResponse(
            id=entry.id,
            user_id=entry.user_id,
            game_id=entry.game_id,
            status=entry.status,
            rating=entry.rating,
            created_at=entry.created_at,
            updated_at=entry.updated_at,
            game=game_resp,
        )

    def remove_entry(self, entry_id: str, user_id: str) -> None:
        deleted = self._library_repo.delete(entry_id, user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Library entry {entry_id} not found",
            )

    def get_user_stats(self, user_id: str) -> UserStatsResponse:
        entries = self._library_repo.list_by_user(user_id)
        total = len(entries)
        want_to_play = sum(1 for e in entries if e.status == PlayStatus.WANT_TO_PLAY)
        playing = sum(1 for e in entries if e.status == PlayStatus.PLAYING)
        completed = sum(1 for e in entries if e.status == PlayStatus.COMPLETED)

        rated_entries = [e.rating for e in entries if e.rating is not None]
        avg_rating = (
            round(sum(rated_entries) / len(rated_entries), 1) if rated_entries else None
        )

        return UserStatsResponse(
            total_games=total,
            want_to_play_count=want_to_play,
            playing_count=playing,
            completed_count=completed,
            average_rating=avg_rating,
        )
