from enum import Enum
from typing import NewType

LibraryEntryId = NewType("LibraryEntryId", str)


class PlayStatus(str, Enum):
    WANT_TO_PLAY = "want_to_play"
    PLAYING = "playing"
    COMPLETED = "completed"
