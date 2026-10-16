import json
import os
import tempfile
from collections.abc import Sequence
from pathlib import Path
from typing import TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


def read_list_file(path: Path, model: type[T]) -> list[T]:
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("[]", encoding="utf-8")
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise ValueError(f"Expected JSON array in {path}")
    return [model.model_validate(item) for item in raw]


def write_list_file(path: Path, items: Sequence[BaseModel]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = [item.model_dump(mode="json") for item in items]
    content = json.dumps(payload, indent=2)

    # Atomic write: write to temp file in same directory, flush and replace
    temp_file = tempfile.NamedTemporaryFile(
        mode="w",
        dir=path.parent,
        prefix=f".{path.name}.",
        suffix=".tmp",
        delete=False,
        encoding="utf-8",
    )
    try:
        temp_file.write(content)
        temp_file.flush()
        os.fsync(temp_file.fileno())
        temp_file.close()
        os.replace(temp_file.name, path)
    except Exception:
        temp_file.close()
        if os.path.exists(temp_file.name):
            try:
                os.remove(temp_file.name)
            except OSError:
                pass
        raise
