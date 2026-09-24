"""Automated Smoke Test Suite for GameLibrary Backend.

Validates all test cases from docs/games/test-cases.md:
- TC-AUTH: Registration, Duplicate rejection, Login, Token access
- TC-CAT: Catalog listing, Title search, Genre filter, Platform filter
- TC-DET: Game details
- TC-LIB: Add to library (default want_to_play), Prevent duplicate, Change status, Rating, Removal
- TC-PROF: Calculated statistics
- TC-INT: Tenant isolation
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def run_tests():
    print("=== STARTING GAMELIBRARY BACKEND TESTS ===")

    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200, res.text
    assert res.json() == {"status": "ok"}
    print("PASS: Health Check")

    import uuid

    run_id = uuid.uuid4().hex[:6]
    user1_email = f"gamer_{run_id}@example.com"
    user1_username = f"Gamer_{run_id}"
    reg_res = client.post(
        "/api/auth/register",
        json={
            "username": user1_username,
            "email": user1_email,
            "password": "Password123!",
        },
    )
    assert reg_res.status_code == 201, reg_res.text
    auth_data = reg_res.json()
    token1 = auth_data["token"]
    user1_id = auth_data["user"]["id"]
    headers1 = {"Authorization": f"Bearer {token1}"}
    print(f"PASS: TC-AUTH-01 (Registered user {user1_id})")

    # 3. TC-AUTH-02: Duplicate registration rejection
    dup_res = client.post(
        "/api/auth/register",
        json={
            "username": user1_username,
            "email": "different@example.com",
            "password": "Password123!",
        },
    )
    assert dup_res.status_code == 409, dup_res.text
    print("PASS: TC-AUTH-02 (Duplicate username blocked with 409)")

    # 4. TC-AUTH-03: Login
    login_res = client.post(
        "/api/auth/login",
        json={"email": user1_email, "password": "Password123!"},
    )
    assert login_res.status_code == 200, login_res.text
    print("PASS: TC-AUTH-03 (Login succeeded)")

    # 5. TC-AUTH-04: Invalid login
    bad_login = client.post(
        "/api/auth/login",
        json={"email": user1_email, "password": "WrongPassword"},
    )
    assert bad_login.status_code == 401, bad_login.text
    print("PASS: TC-AUTH-04 (Invalid password blocked with 401)")

    # 6. TC-AUTH-05: Authenticated route protection
    me_res = client.get("/api/auth/me", headers=headers1)
    assert me_res.status_code == 200, me_res.text
    assert me_res.json()["username"] == user1_username

    unauth_res = client.get("/api/auth/me")
    assert unauth_res.status_code == 401
    print("PASS: TC-AUTH-05 (Protected routes correctly guard without token)")

    # 7. TC-CAT-01: Catalog listing
    games_res = client.get("/api/games")
    assert games_res.status_code == 200, games_res.text
    games = games_res.json()
    assert len(games) >= 5, f"Expected at least 5 games, got {len(games)}"
    first_game_id = games[0]["id"]
    print(f"PASS: TC-CAT-01 (Loaded {len(games)} catalog games)")

    # 8. TC-CAT-02: Search by title match
    search_res = client.get("/api/games?search=Witcher")
    assert search_res.status_code == 200
    search_games = search_res.json()
    assert any("Witcher" in g["title"] for g in search_games)
    print(f"PASS: TC-CAT-02 (Title search found {len(search_games)} matching games)")

    # 9. TC-CAT-03: Search with no matches
    no_match_res = client.get("/api/games?search=xyzNonExistent999")
    assert no_match_res.status_code == 200
    assert len(no_match_res.json()) == 0
    print("PASS: TC-CAT-03 (Search with no matches returned empty list)")

    # 10. TC-CAT-04: Filter by genre
    rpg_res = client.get("/api/games?genre=RPG")
    assert rpg_res.status_code == 200
    rpg_games = rpg_res.json()
    assert len(rpg_games) > 0
    assert all("RPG" in g["genres"] for g in rpg_games)
    print(f"PASS: TC-CAT-04 (Genre filter returned {len(rpg_games)} RPG games)")

    # 11. TC-CAT-05: Filter by platform
    switch_res = client.get("/api/games?platform=Nintendo%20Switch")
    assert switch_res.status_code == 200
    switch_games = switch_res.json()
    assert len(switch_games) > 0
    assert all("Nintendo Switch" in g["platforms"] for g in switch_games)
    print(f"PASS: TC-CAT-05 (Platform filter returned {len(switch_games)} Switch games)")

    # 12. TC-DET-01: Get game details
    detail_res = client.get(f"/api/games/{first_game_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == first_game_id
    print("PASS: TC-DET-01 (Single game details fetched)")

    # 13. TC-DET-02 & TC-LIB-01: Add game to library
    add_res = client.post(
        "/api/library",
        json={"game_id": first_game_id},
        headers=headers1,
    )
    assert add_res.status_code == 201, add_res.text
    entry1 = add_res.json()
    entry1_id = entry1["id"]
    assert entry1["status"] == "want_to_play", "Default status must be want_to_play"
    assert entry1["game"]["id"] == first_game_id
    print("PASS: TC-DET-02 & TC-LIB-01 (Added game to library with status 'want_to_play')")

    # 14. TC-DET-03: Prevent duplicate library addition
    dup_add = client.post(
        "/api/library",
        json={"game_id": first_game_id},
        headers=headers1,
    )
    assert dup_add.status_code == 400
    print("PASS: TC-DET-03 (Duplicate library addition blocked)")

    # 15. TC-LIB-03: Change status to 'playing'
    patch_res = client.patch(
        f"/api/library/{entry1_id}",
        json={"status": "playing"},
        headers=headers1,
    )
    assert patch_res.status_code == 200, patch_res.text
    assert patch_res.json()["status"] == "playing"
    print("PASS: TC-LIB-03 (Updated status to 'playing')")

    # 16. TC-LIB-04 & 05: Rate game
    rate_res = client.patch(
        f"/api/library/{entry1_id}",
        json={"rating": 9},
        headers=headers1,
    )
    assert rate_res.status_code == 200, rate_res.text
    assert rate_res.json()["rating"] == 9
    print("PASS: TC-LIB-04 (Set rating to 9/10)")

    # Invalid rating
    bad_rate = client.patch(
        f"/api/library/{entry1_id}",
        json={"rating": 15},
        headers=headers1,
    )
    assert bad_rate.status_code == 422
    print("PASS: TC-LIB-05 (Invalid rating rejected with 422)")

    # Add second game and complete it
    second_game_id = games[1]["id"]
    client.post(
        "/api/library",
        json={"game_id": second_game_id},
        headers=headers1,
    )
    # Find entry id
    lib_res = client.get("/api/library", headers=headers1)
    entry2 = [e for e in lib_res.json() if e["game_id"] == second_game_id][0]
    client.patch(
        f"/api/library/{entry2['id']}",
        json={"status": "completed", "rating": 7},
        headers=headers1,
    )

    # 17. TC-PROF-01 to 03: Profile statistics
    stats_res = client.get("/api/users/me/stats", headers=headers1)
    assert stats_res.status_code == 200, stats_res.text
    stats = stats_res.json()
    assert stats["total_games"] == 2
    assert stats["playing_count"] == 1
    assert stats["completed_count"] == 1
    assert stats["want_to_play_count"] == 0
    assert stats["average_rating"] == 8.0  # (9 + 7) / 2
    print(f"PASS: TC-PROF-01 to 03 (Statistics calculated: {stats})")

    # 18. TC-INT-01: Tenant isolation
    reg_user2 = client.post(
        "/api/auth/register",
        json={
            "username": f"UserTwo_{run_id}",
            "email": f"user2_{run_id}@example.com",
            "password": "Password123!",
        },
    )
    token2 = reg_user2.json()["token"]
    headers2 = {"Authorization": f"Bearer {token2}"}
    user2_lib = client.get("/api/library", headers=headers2)
    assert len(user2_lib.json()) == 0, "User 2 library should be empty"

    # User 2 cannot delete user 1 entry
    forbidden_delete = client.delete(f"/api/library/{entry1_id}", headers=headers2)
    assert forbidden_delete.status_code == 404
    print("PASS: TC-INT-01 (Tenant isolation validated)")

    # 19. TC-LIB-06: Remove game from library
    del_res = client.delete(f"/api/library/{entry1_id}", headers=headers1)
    assert del_res.status_code == 204
    lib_after_del = client.get("/api/library", headers=headers1)
    assert len(lib_after_del.json()) == 1
    # Global game still exists
    catalog_check = client.get(f"/api/games/{first_game_id}")
    assert catalog_check.status_code == 200
    print("PASS: TC-LIB-06 (Game removed from library, global catalog preserved)")

    print("\nALL BACKEND TEST CASES PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    run_tests()
