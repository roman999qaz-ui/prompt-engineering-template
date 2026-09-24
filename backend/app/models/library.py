from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

from app.models.game import GameResponse
from app.types.library import PlayStatus


class AddLibraryEntryRequest(BaseModel):
    game_id: str


class UpdateLibraryEntryRequest(BaseModel):
    status: Optional[PlayStatus] = None
    rating: Optional[int] = Field(None, ge=1, le=10)


class LibraryEntryInDb(BaseModel):
    id: str
    user_id: str
    game_id: str
    status: PlayStatus = PlayStatus.WANT_TO_PLAY
    rating: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LibraryEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    game_id: str
    status: PlayStatus
    rating: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    game: Optional[GameResponse] = None


class UserStatsResponse(BaseModel):
    total_games: int
    want_to_play_count: int
    playing_count: int
    completed_count: int
    average_rating: Optional[float] = None
