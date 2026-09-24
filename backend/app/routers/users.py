from fastapi import APIRouter, Depends

from app.dependencies import get_current_user, get_library_service
from app.models.library import UserStatsResponse
from app.models.user import UserResponse
from app.services.library_service import LibraryService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/stats", response_model=UserStatsResponse)
def get_my_statistics(
    current_user: UserResponse = Depends(get_current_user),
    library_service: LibraryService = Depends(get_library_service),
) -> UserStatsResponse:
    return library_service.get_user_stats(user_id=current_user.id)
