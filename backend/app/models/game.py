from pydantic import BaseModel, ConfigDict, Field


class GameBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="")
    cover_image: str = Field(default="")
    genres: list[str] = Field(default_factory=list)
    platforms: list[str] = Field(default_factory=list)
    release_year: int = Field(default=2024)
    developer: str = Field(default="")


class GameInDb(GameBase):
    id: str


class GameResponse(GameBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
