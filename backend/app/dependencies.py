from functools import lru_cache
from typing import Optional

from fastapi import Depends, Header, HTTPException, status

from app.models.user import UserResponse
from app.repositories.game_repository import GameRepository
from app.repositories.library_repository import LibraryRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.game_service import GameService
from app.services.library_service import LibraryService
from app.utils.paths import get_data_dir


@lru_cache
def get_user_repository() -> UserRepository:
    return UserRepository(get_data_dir() / "users.json")


@lru_cache
def get_game_repository() -> GameRepository:
    return GameRepository(get_data_dir() / "games.json")


@lru_cache
def get_library_repository() -> LibraryRepository:
    return LibraryRepository(get_data_dir() / "libraries.json")


def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(user_repo=user_repo)


def get_game_service(
    game_repo: GameRepository = Depends(get_game_repository),
) -> GameService:
    return GameService(game_repo=game_repo)


def get_library_service(
    library_repo: LibraryRepository = Depends(get_library_repository),
    game_repo: GameRepository = Depends(get_game_repository),
) -> LibraryService:
    return LibraryService(library_repo=library_repo, game_repo=game_repo)


def get_current_user(
    authorization: Optional[str] = Header(None),
    auth_service: AuthService = Depends(get_auth_service),
) -> UserResponse:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]
    user = auth_service.get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
