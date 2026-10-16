---
description: "Documentation structure, feature specification rules, and synchronization standards under docs/."
trigger: glob
globs: ["docs/**", "README.md", "Agents.MD"]
---
# Documentation Standards & Specifications

## 1. Feature Folder Organization
Every domain feature must be documented under `docs/<feature>/` with three mandatory documents:

```
docs/<feature>/
├── business-requirements.md   # Functional scope, user stories, acceptance criteria
├── architecture.md            # Layer breakdown, data flows, DTO schemas, endpoints
└── test-cases.md              # Test specifications with IDs, steps, and expected results
```

## 2. Specification Contents

### `business-requirements.md`
- **User Personas & Stories**: Clear "As a [user], I want [action] so that [benefit]" statements.
- **Acceptance Criteria**: Concrete, verifiable checkboxes (Given / When / Then).
- **Out of Scope**: Explicit list of features deferred to future releases.

### `architecture.md`
- **Layer Mapping**: File-by-file breakdown across Backend (`routers`, `services`, `repositories`, `models`, `types`) and Frontend (`types`, `store/api`, `features`, `components`).
- **Data Model Schema**: Attribute names, types, constraints, and relationships.
- **API Endpoints**: Method, route URL, headers, request body schema, response code & schema.

### `test-cases.md`
- **Numbered Test IDs**: Structured identifiers (e.g. `TC-AUTH-01`, `TC-CAT-01`, `TC-LIB-01`).
- **Preconditions**: Required setup (e.g., authenticated user, existing game ID).
- **Test Steps & Assertions**: Input parameters and exact expected status code and response payload.

## 3. Synchronization Rule
- Never modify or add business logic, endpoints, or data models without updating the corresponding specification files under `docs/`.
- Maintain docstrings and inline comments in source code aligned with `docs/`.
