from pathlib import Path
from typing import Optional

from app.models.library import LibraryEntryInDb
from app.types.library import PlayStatus
from app.utils.json_store import read_list_file, write_list_file


class LibraryRepository:
    def __init__(self, storage_path: Path):
        self._path = storage_path

    def list_by_user(
        self, user_id: str, status: Optional[PlayStatus] = None
    ) -> list[LibraryEntryInDb]:
        entries = read_list_file(self._path, LibraryEntryInDb)
        user_entries = [e for e in entries if e.user_id == user_id]
        if status:
            user_entries = [e for e in user_entries if e.status == status]
        return user_entries

    def get_by_id(self, entry_id: str) -> Optional[LibraryEntryInDb]:
        entries = read_list_file(self._path, LibraryEntryInDb)
        for e in entries:
            if e.id == entry_id:
                return e
        return None

    def get_by_user_and_game(
        self, user_id: str, game_id: str
    ) -> Optional[LibraryEntryInDb]:
        entries = read_list_file(self._path, LibraryEntryInDb)
        for e in entries:
            if e.user_id == user_id and e.game_id == game_id:
                return e
        return None

    def create(self, entry: LibraryEntryInDb) -> LibraryEntryInDb:
        entries = read_list_file(self._path, LibraryEntryInDb)
        entries.append(entry)
        write_list_file(self._path, entries)
        return entry

    def update(self, entry: LibraryEntryInDb) -> LibraryEntryInDb:
        entries = read_list_file(self._path, LibraryEntryInDb)
        updated_entries = []
        found = False
        for e in entries:
            if e.id == entry.id:
                updated_entries.append(entry)
                found = True
            else:
                updated_entries.append(e)
        if not found:
            raise KeyError(f"Library entry {entry.id} not found")
        write_list_file(self._path, updated_entries)
        return entry

    def delete(self, entry_id: str, user_id: str) -> bool:
        entries = read_list_file(self._path, LibraryEntryInDb)
        initial_len = len(entries)
        # Enforce user_id tenant isolation
        entries = [e for e in entries if not (e.id == entry_id and e.user_id == user_id)]
        if len(entries) == initial_len:
            return False
        write_list_file(self._path, entries)
        return True
