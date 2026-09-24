from typing import Optional

from fastapi import APIRouter, Depends, Response, status

from app.dependencies import get_current_user, get_library_service
from app.models.library import (
    AddLibraryEntryRequest,
    LibraryEntryResponse,
    UpdateLibraryEntryRequest,
)
from app.models.user import UserResponse
from app.services.library_service import LibraryService
from app.types.library import PlayStatus

router = APIRouter(prefix="/library", tags=["library"])


@router.get("", response_model=list[LibraryEntryResponse])
def get_user_library(
    status: Optional[PlayStatus] = None,
    current_user: UserResponse = Depends(get_current_user),
    library_service: LibraryService = Depends(get_library_service),
) -> list[LibraryEntryResponse]:
    return library_service.list_user_library(
        user_id=current_user.id, status_filter=status
    )


@router.post(
    "",
    response_model=LibraryEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_to_library(
    req: AddLibraryEntryRequest,
    current_user: UserResponse = Depends(get_current_user),
    library_service: LibraryService = Depends(get_library_service),
) -> LibraryEntryResponse:
    return library_service.add_to_library(
        user_id=current_user.id, game_id=req.game_id
    )


@router.patch("/{entry_id}", response_model=LibraryEntryResponse)
def update_library_entry(
    entry_id: str,
    req: UpdateLibraryEntryRequest,
    current_user: UserResponse = Depends(get_current_user),
    library_service: LibraryService = Depends(get_library_service),
) -> LibraryEntryResponse:
    return library_service.update_entry(
        entry_id=entry_id,
        user_id=current_user.id,
        new_status=req.status,
        new_rating=req.rating,
    )


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_library(
    entry_id: str,
    current_user: UserResponse = Depends(get_current_user),
    library_service: LibraryService = Depends(get_library_service),
) -> Response:
    library_service.remove_entry(entry_id=entry_id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
