from fastapi import APIRouter, Depends, status

from app.dependencies import get_auth_service, get_current_user
from app.models.user import (
    AuthResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    req: UserRegisterRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    return auth_service.register(req)


@router.post("/login", response_model=AuthResponse)
def login(
    req: UserLoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    return auth_service.login(req)


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    return current_user
