from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, games, library, users

app = FastAPI(title="GameLibrary API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(games.router, prefix="/api")
app.include_router(library.router, prefix="/api")
app.include_router(users.router, prefix="/api")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def start() -> None:
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)


if __name__ == "__main__":
    start()
