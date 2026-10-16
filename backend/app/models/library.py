from datetime import UTC, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.game import GameResponse
from app.types.library import PlayStatus


class AddLibraryEntryRequest(BaseModel):
    game_id: str


class UpdateLibraryEntryRequest(BaseModel):
    status: PlayStatus | None = None
    rating: int | None = Field(None, ge=1, le=10)


class LibraryEntryInDb(BaseModel):
    id: str
    user_id: str
    game_id: str
    status: PlayStatus = PlayStatus.WANT_TO_PLAY
    rating: int | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class LibraryEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    game_id: str
    status: PlayStatus
    rating: int | None = None
    created_at: datetime
    updated_at: datetime
    game: GameResponse | None = None


class UserStatsResponse(BaseModel):
    total_games: int
    want_to_play_count: int
    playing_count: int
    completed_count: int
    average_rating: float | None = None
