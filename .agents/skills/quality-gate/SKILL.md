---
name: quality-gate
description: >-
  Use this skill to run static code analysis, linting, formatting checks, and type validation across both backend and frontend.
---

# Quality Gate Skill

Enforce code quality and type safety across the entire GameLibrary repository before committing changes or completing tasks.

## One-Click Execution (Windows)

Run the root batch script:
```cmd
check.bat
```

## Step-by-Step Manual Execution

### 1. Backend Validation (Python / FastAPI)
From the `backend/` directory:
```bash
cd backend

# Linter check
uv run ruff check app

# Formatter check
uv run ruff format --check app

# Type checker (strict mode)
uv run mypy app
```

Auto-fixing backend issues:
```bash
# Auto-fix linter rules
uv run ruff check --fix app

# Auto-format Python code
uv run ruff format app
```

### 2. Frontend Validation (React 19 / TypeScript)
From the `frontend/` directory:
```bash
cd frontend

# Oxlint linter
npm run lint

# Prettier formatting check
npm run format:check

# TypeScript type check (noEmit)
npm run type-check
```

Auto-fixing frontend issues:
```bash
# Format code with Prettier
npm run format:write
```

## Quality Invariants
- Zero Mypy errors: all models, repository methods, services, and route handlers must be strictly typed.
- Zero TypeScript errors: avoid `any`, ensure types match backend DTOs.
- Clean formatting: all code must be formatted with Ruff and Prettier.
