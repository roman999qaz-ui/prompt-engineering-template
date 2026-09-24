from pathlib import Path
from typing import Optional

from app.models.user import UserInDb
from app.utils.json_store import read_list_file, write_list_file


class UserRepository:
    def __init__(self, storage_path: Path):
        self._path = storage_path

    def list_all(self) -> list[UserInDb]:
        return read_list_file(self._path, UserInDb)

    def get_by_id(self, user_id: str) -> Optional[UserInDb]:
        users = self.list_all()
        for u in users:
            if u.id == user_id:
                return u
        return None

    def get_by_email(self, email: str) -> Optional[UserInDb]:
        users = self.list_all()
        target = email.strip().lower()
        for u in users:
            if u.email.strip().lower() == target:
                return u
        return None

    def get_by_username(self, username: str) -> Optional[UserInDb]:
        users = self.list_all()
        target = username.strip().lower()
        for u in users:
            if u.username.strip().lower() == target:
                return u
        return None

    def create(self, user: UserInDb) -> UserInDb:
        users = self.list_all()
        users.append(user)
        write_list_file(self._path, users)
        return user
