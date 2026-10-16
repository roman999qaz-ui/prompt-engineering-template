from enum import StrEnum
from typing import NewType

LibraryEntryId = NewType("LibraryEntryId", str)


class PlayStatus(StrEnum):
    WANT_TO_PLAY = "want_to_play"
    PLAYING = "playing"
    COMPLETED = "completed"
