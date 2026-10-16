---
description: "Architectural boundaries, state management and component separation rules for the React frontend."
trigger: glob
globs: ["frontend/**"]
---
# Frontend Architecture Boundaries

## Context
This project is a React (TypeScript) single-page application built with Vite, Tailwind CSS v4, shadcn/ui primitives, and Redux Toolkit.

## State Management Rules
1. **Server State (API Cache)**:
   - Must be managed exclusively through **RTK Query** endpoints in `frontend/src/store/api/` (`gamesApi.ts`, `authApi.ts`, `libraryApi.ts`).
   - Use auto-generated query and mutation hooks for all server interactions and cache invalidation (`providesTags` / `invalidatesTags`).
2. **Client / UI State**:
   - Global UI state (active modal, current view, active filter selection) must be managed through standard **Redux Toolkit slices** in `frontend/src/store/slices/` (e.g. `appSlice.ts`, `authSlice.ts`).
   - Local component state should use standard React hooks (`useState`, `useRef`).
   - Encapsulate reusable domain logic and composite state into custom hooks in `frontend/src/hooks/` (e.g. `useAuth`, `useLibrary`, `useCatalogFilters`, `useTheme`).

## Component Structure & Separation
1. **Feature Views (`frontend/src/features/<feature>/`)**:
   - Group domain views and feature-specific dialogs together (e.g. `src/features/games/`, `src/features/auth/`).
2. **Shared UI Primitives (`frontend/src/components/ui/`)**:
   - Reusable, headless/accessible UI building blocks (`button.tsx`, `dialog.tsx`, `badge.tsx`, `input.tsx`, `label.tsx`).
   - Must remain independent of domain business logic.
3. **Global Layout (`frontend/src/components/`)**:
   - Shared layout components like `Navbar.tsx`, `ThemeToggle.tsx`, and site-wide widgets reside in `src/components/`.
