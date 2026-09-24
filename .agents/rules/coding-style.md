# Coding Style & Quality Guidelines

## Python (FastAPI Backend)
1. **Type Annotations**: All functions, methods, parameters, and return values must have explicit type annotations.
2. **Pydantic v2**: Use `pydantic.BaseModel` with field constraints (`Field(min_length=...)`). Avoid raw dictionaries for incoming or outgoing HTTP payloads.
3. **Error Handling**: Use standard HTTP exceptions (`fastapi.HTTPException`) with clear, descriptive detail messages and proper status codes (`400`, `401`, `404`, `409`, `422`).
4. **Code Organization**: Keep files focused and under 300 lines. Avoid circular dependencies by separating types, models, repositories, and services.

## TypeScript & React (Frontend)
1. **Strict Typing**: No `any`. Use strict TypeScript interfaces matching backend DTO schemas.
2. **Tailwind CSS & Styling**: Use Tailwind utility classes. Maintain consistent color tokens and accessible focus states.
3. **React Hooks**: Encapsulate reusable state and effect logic into custom hooks under `src/hooks/`.
4. **Zero Lint Errors**: Ensure code passes Oxlint without warnings or errors.
