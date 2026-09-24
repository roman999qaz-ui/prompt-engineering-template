import hashlib
import secrets
import uuid
from typing import Optional

from fastapi import HTTPException, status

from app.models.user import (
    AuthResponse,
    UserInDb,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.repositories.user_repository import UserRepository


class AuthService:
    # In-memory session store mapping token -> user_id
    _active_tokens: dict[str, str] = {}

    def __init__(self, user_repo: UserRepository):
        self._user_repo = user_repo

    @staticmethod
    def _hash_password(password: str, salt: str) -> str:
        return hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000
        ).hex()

    def register(self, req: UserRegisterRequest) -> AuthResponse:
        # Check uniqueness of email and username
        if self._user_repo.get_by_email(req.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already in use",
            )
        if self._user_repo.get_by_username(req.username):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username is already in use",
            )

        salt = secrets.token_hex(16)
        hashed_password = self._hash_password(req.password, salt)
        user_id = str(uuid.uuid4())

        user_in_db = UserInDb(
            id=user_id,
            username=req.username.strip(),
            email=req.email.strip().lower(),
            hashed_password=hashed_password,
            salt=salt,
        )
        self._user_repo.create(user_in_db)

        token = secrets.token_urlsafe(32)
        AuthService._active_tokens[token] = user_id

        return AuthResponse(
            token=token,
            user=UserResponse(
                id=user_in_db.id,
                username=user_in_db.username,
                email=user_in_db.email,
                created_at=user_in_db.created_at,
            ),
        )

    def login(self, req: UserLoginRequest) -> AuthResponse:
        user = self._user_repo.get_by_email(req.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        expected_hash = self._hash_password(req.password, user.salt)
        if not secrets.compare_digest(expected_hash, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        token = secrets.token_urlsafe(32)
        AuthService._active_tokens[token] = user.id

        return AuthResponse(
            token=token,
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                created_at=user.created_at,
            ),
        )

    def get_user_by_token(self, token: str) -> Optional[UserResponse]:
        user_id = AuthService._active_tokens.get(token)
        if not user_id:
            return None
        user = self._user_repo.get_by_id(user_id)
        if not user:
            return None
        return UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            created_at=user.created_at,
        )
