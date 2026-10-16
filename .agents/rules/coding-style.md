---
description: "Coding style, typing conventions, and quality standards for Python backend and TypeScript/React frontend."
trigger: glob
globs: ["**/*.py", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
---
# Coding Style & Quality Guidelines

## Python (FastAPI Backend)
1. **Type Checker (Mypy)**: All functions, methods, parameters, and return values must have explicit type annotations. Code must pass `uv run mypy app`.
2. **Linter & Formatter (Ruff)**: Code must pass Ruff linter (`uv run ruff check app`) and formatter (`uv run ruff format --check app`).
3. **Pydantic v2**: Use `pydantic.BaseModel` with field constraints (`Field(min_length=...)`). Avoid raw dictionaries for incoming or outgoing HTTP payloads.
4. **Error Handling**: Use standard HTTP exceptions (`fastapi.HTTPException`) with clear, descriptive detail messages and proper status codes (`400`, `401`, `404`, `409`, `422`).
5. **Code Organization**: Keep files focused and under 300 lines. Avoid circular dependencies by separating types, models, repositories, and services.
6. **Data Protection**: Never overwrite `backend/data/*.json` with unvalidated or empty payloads. Always use atomic writes.

## TypeScript & React (Frontend)
1. **Type Checker (TypeScript)**: Strict typing, no `any`. Use strict TypeScript interfaces matching backend DTO schemas (`npm run type-check`).
2. **Linter (Oxlint)**: Zero lint errors or warnings (`npm run lint`).
3. **Formatter (Prettier)**: Code must adhere to Prettier formatting (`npm run format` / `npm run format:check`).
4. **Tailwind CSS & Styling**: Use Tailwind utility classes. Maintain consistent color tokens and accessible focus states. Support both light and dark themes.
5. **React Hooks**: Encapsulate reusable state and effect logic into custom hooks under `src/hooks/`.
6. **Clean Components**: Avoid monolithic components (>250 lines). Split complex UI into subcomponents under feature folders.

