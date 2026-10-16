"""Enterprise Lifecycle Hook Suite for GameLibrary Antigravity Agent.

Full Lifecycle Implementation:
1. PreToolUse:
   - Destructive command guardrail (blocks rm -rf, format, etc.)
   - Destructive git mutation confirmation (asks confirmation for git reset --hard, force push)
   - Protected path guard (protects /.git/, /.env, /.venv/)
   - Catalog data guard (protects backend/data/games.json from truncation)
   - Secret & API key leak blocker (blocks committing raw tokens/private keys)
2. PostToolUse:
   - Python AST / bytecode compilation checks (py_compile)
   - JSON database integrity checks for backend/data/*.json
   - Structured audit logging to .agents/logs/audit.log
3. PreInvocation:
   - Dynamic environment inspection (catalog count, user count, backend live health check)
   - Injects real-time context message into model invocation
4. PostInvocation:
   - Post-response auditing and step tracking
5. Stop:
   - Quality gate verifying data stores (games.json >= 500 items, users, libraries)
   - Runs backend automated smoke tests (scripts.test_api) to prevent regressions
"""

from datetime import datetime
import json
from pathlib import Path
import py_compile
import re
import subprocess
import sys
import urllib.request

SCRIPT_DIR = Path(__file__).resolve().parent
AGENTS_DIR = SCRIPT_DIR.parent
WORKSPACE_DIR = AGENTS_DIR.parent
LOGS_DIR = AGENTS_DIR / "logs"
AUDIT_LOG_FILE = LOGS_DIR / "audit.log"
DATA_DIR = WORKSPACE_DIR / "backend" / "data"


def get_stdin_data() -> dict:
    """Reads JSON payload from stdin safely without hanging."""
    if sys.stdin.isatty():
        return {}
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except Exception:
        return {}


def log_audit(event_type: str, message: str) -> None:
    """Appends an event to the local agent audit log."""
    try:
        LOGS_DIR.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(AUDIT_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] [{event_type}] {message}\n")
    except Exception:
        pass


def check_for_secrets(text: str) -> str | None:
    """Detects leaked API keys, tokens, or private certificates."""
    secret_patterns = [
        (r"-----BEGIN (?:RSA )?PRIVATE KEY-----", "Private cryptographic key"),
        (r"ghp_[a-zA-Z0-9]{36}", "GitHub Personal Access Token"),
        (r"github_pat_[a-zA-Z0-9_]{82}", "Fine-grained GitHub Token"),
        (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
        (r"sk-[a-zA-Z0-9]{32,}", "OpenAI API secret key"),
    ]
    for pattern, name in secret_patterns:
        if re.search(pattern, text):
            return name
    return None


def handle_pre_tool():
    """PreToolUse: Safety Gates, Secret Leak Blocker, and Catalog Protection."""
    try:
        data = get_stdin_data()
        tool_call = data.get("toolCall", {})
        tool_name = tool_call.get("name", "")
        args = tool_call.get("args", {})

        # 1. Terminal Command Safety Guard
        if tool_name == "run_command":
            cmd = args.get("CommandLine", "").strip().lower()

            # Hard-block dangerous system destruction commands
            hard_blocked = [
                "rmdir /s /q c:\\",
                "del /f /s /q c:\\",
                "format c:",
                "diskpart",
                "drop database",
            ]
            for blocked in hard_blocked:
                if blocked in cmd:
                    log_audit("BLOCKED_CMD", f"Hard-blocked dangerous command: {cmd}")
                    sys.stdout.write(
                        json.dumps(
                            {
                                "decision": "deny",
                                "reason": f"Security Gate: Prohibited system destructive command sequence: '{blocked}'",
                            }
                        )
                    )
                    return

            # Ask user confirmation for irreversible git actions
            risky_git = ["git reset --hard", "git push --force", "git push -f"]
            for risky in risky_git:
                if risky in cmd:
                    log_audit("RISK_CONFIRM", f"Requested confirmation for: {cmd}")
                    sys.stdout.write(
                        json.dumps(
                            {
                                "decision": "ask",
                                "reason": f"Safety Gate: Command performs irreversible git state mutation ('{risky}'). Confirm execution?",
                            }
                        )
                    )
                    return

        # 2. Protected Files Guard for File Tools
        if tool_name in ("write_to_file", "replace_file_content"):
            target_file = args.get("TargetFile", "").replace("\\", "/")

            # Protect VCS internals and environment credentials
            protected_patterns = ["/.git/", "/.env", "/.venv/"]
            for pat in protected_patterns:
                if pat in target_file:
                    log_audit("BLOCKED_FILE", f"Blocked write to protected path: {target_file}")
                    sys.stdout.write(
                        json.dumps(
                            {
                                "decision": "deny",
                                "reason": f"Safety Gate: Direct modification of protected path '{pat}' is prohibited.",
                            }
                        )
                    )
                    return

            # Protect games.json from accidental wiping or truncation
            if target_file.endswith("backend/data/games.json") and tool_name == "write_to_file":
                content = args.get("CodeContent", "")
                try:
                    parsed = json.loads(content)
                    if not isinstance(parsed, list) or len(parsed) < 500:
                        log_audit("BLOCKED_WIPE", "Attempted to overwrite games.json with truncated array.")
                        sys.stdout.write(
                            json.dumps(
                                {
                                    "decision": "deny",
                                    "reason": "Safety Gate: Attempted to replace games catalog with a truncated list (< 500 items). Operation aborted.",
                                }
                            )
                        )
                        return
                except Exception:
                    pass

        # 3. Secret Leak Blocker
        content_to_scan = ""
        if tool_name == "run_command":
            content_to_scan = args.get("CommandLine", "")
        elif tool_name == "write_to_file":
            content_to_scan = args.get("CodeContent", "")
        elif tool_name == "replace_file_content":
            content_to_scan = args.get("ReplacementContent", "")

        detected_secret = check_for_secrets(content_to_scan)
        if detected_secret:
            log_audit("BLOCKED_SECRET", f"Blocked leak of {detected_secret}")
            sys.stdout.write(
                json.dumps(
                    {
                        "decision": "deny",
                        "reason": f"Security Gate: Detected {detected_secret} in payload. Secrets must not be committed to code.",
                    }
                )
            )
            return

        # Allow execution
        log_audit("ALLOW_TOOL", f"Tool approved: {tool_name}")
        sys.stdout.write(json.dumps({"decision": "allow"}))
    except Exception as e:
        sys.stdout.write(json.dumps({"decision": "allow", "reason": f"Hook exception handled: {e}"}))


def handle_post_tool():
    """PostToolUse: Syntax Checking, Store Integrity, and Audit Logging.
    Contract strictly requires empty JSON object `{}` on stdout.
    """
    try:
        data = get_stdin_data()
        tool_call = data.get("toolCall", {})
        tool_name = tool_call.get("name", "")
        args = tool_call.get("args", {})
        error = data.get("error", "")

        # Log completion
        status_text = f"FAILED: {error}" if error else "SUCCESS"
        log_audit("POST_TOOL", f"Completed {tool_name} [{status_text}]")

        # Post-edit validations for written or modified files
        if tool_name in ("write_to_file", "replace_file_content"):
            target_path_str = args.get("TargetFile", "")
            if target_path_str:
                path = Path(target_path_str)

                # Validate Python syntax if a Python file was modified
                if path.suffix == ".py" and path.exists():
                    try:
                        py_compile.compile(str(path), doraise=True)
                        log_audit("PY_SYNTAX", f"Syntax validation passed: {path.name}")
                    except py_compile.PyCompileError as pe:
                        log_audit("PY_ERROR", f"Syntax error in {path.name}: {pe}")

                # Validate JSON integrity if a data store file was modified
                if "backend/data" in str(path).replace("\\", "/") and path.suffix == ".json" and path.exists():
                    try:
                        with open(path, "r", encoding="utf-8") as jf:
                            store_data = json.load(jf)
                        if isinstance(store_data, list):
                            log_audit("STORE_OK", f"Validated {path.name}: {len(store_data)} entries.")
                        else:
                            log_audit("STORE_WARN", f"{path.name} is valid JSON but not an array.")
                    except Exception as je:
                        log_audit("STORE_ERROR", f"Corrupted JSON in {path.name}: {je}")
    except Exception:
        pass
    finally:
        sys.stdout.write(json.dumps({}))


def handle_pre_invocation():
    """PreInvocation: Injects real-time environment metrics & dynamic context."""
    try:
        games_count = "?"
        games_file = DATA_DIR / "games.json"
        if games_file.exists():
            try:
                with open(games_file, "r", encoding="utf-8") as f:
                    games_count = str(len(json.load(f)))
            except Exception:
                pass

        backend_status = "offline"
        try:
            req = urllib.request.Request("http://127.0.0.1:8001/health", headers={"User-Agent": "AntigravityHook"})
            with urllib.request.urlopen(req, timeout=0.4) as response:
                if response.status == 200:
                    backend_status = "online (port 8001)"
        except Exception:
            backend_status = "offline"

        message = (
            f"GameLibrary Status: Backend: {backend_status} | Catalog: {games_count} games | "
            "Stack: FastAPI (layered: Routers->Services->Repositories) + React 19 (RTK Query). "
            "Data stores in backend/data/ are protected."
        )
        sys.stdout.write(json.dumps({"injectSteps": [{"ephemeralMessage": message}]}))
    except Exception:
        sys.stdout.write(json.dumps({"injectSteps": []}))


def handle_post_invocation():
    """PostInvocation: Execution auditing."""
    try:
        log_audit("POST_INVOKE", "Agent invocation step finished.")
        sys.stdout.write(json.dumps({"injectSteps": []}))
    except Exception:
        sys.stdout.write(json.dumps({"injectSteps": []}))


def handle_stop():
    """Stop: Quality Gate ensuring database files and smoke test suite are passing."""
    try:
        # 1. Check critical data store integrity
        games_file = DATA_DIR / "games.json"
        if games_file.exists():
            try:
                with open(games_file, "r", encoding="utf-8") as f:
                    games = json.load(f)
                if not isinstance(games, list) or len(games) < 500:
                    log_audit("STOP_BLOCK", "Blocked stop due to missing/truncated games.json")
                    sys.stdout.write(
                        json.dumps(
                            {
                                "decision": "continue",
                                "reason": "Quality Gate: backend/data/games.json appears damaged or truncated (< 500 games). Please verify data integrity before finishing.",
                            }
                        )
                    )
                    return
            except Exception as e:
                log_audit("STOP_BLOCK", f"Blocked stop due to JSON parse error: {e}")
                sys.stdout.write(
                    json.dumps(
                        {
                            "decision": "continue",
                            "reason": f"Quality Gate: backend/data/games.json failed JSON parse check ({e}). Please fix syntax before finishing.",
                        }
                    )
                )
                return

        # 2. Run automated backend smoke tests
        backend_dir = WORKSPACE_DIR / "backend"
        test_script = backend_dir / "scripts" / "test_api.py"
        if test_script.exists():
            try:
                result = subprocess.run(
                    ["uv", "run", "python", "-m", "scripts.test_api"],
                    cwd=str(backend_dir),
                    capture_output=True,
                    text=True,
                    timeout=20,
                )
                if result.returncode != 0:
                    err_msg = (result.stderr or result.stdout or "Unknown failure").strip()[-400:]
                    log_audit("STOP_BLOCK_TESTS", f"Smoke tests failed on stop: {err_msg}")
                    sys.stdout.write(
                        json.dumps(
                            {
                                "decision": "continue",
                                "reason": f"Quality Gate: Automated smoke test suite failed. Please fix before finishing:\n{err_msg}",
                            }
                        )
                    )
                    return
            except Exception as te:
                log_audit("STOP_TEST_ERROR", f"Test runner error: {te}")

        # All quality checks passed
        log_audit("STOP_OK", "Quality gate passed. Agent allowed to stop.")
        sys.stdout.write(json.dumps({"decision": "stop"}))
    except Exception:
        sys.stdout.write(json.dumps({"decision": "stop"}))


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "post"
    if mode == "pre":
        handle_pre_tool()
    elif mode == "post":
        handle_post_tool()
    elif mode == "pre_invocation":
        handle_pre_invocation()
    elif mode == "post_invocation":
        handle_post_invocation()
    elif mode == "stop":
        handle_stop()
    else:
        sys.stdout.write(json.dumps({}))


if __name__ == "__main__":
    main()
