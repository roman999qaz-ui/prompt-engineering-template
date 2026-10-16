---
description: "UI/UX design system, Tailwind v4 styling, Dark/Light theme switching, accessibility (a11y), and state handling."
trigger: glob
globs: ["frontend/src/**"]
---
# UI/UX, Theme & Accessibility Rules

## 1. Dark & Light Theme Consistency
1. **Dynamic Theme Switching**:
   - The application supports both Dark and Light themes via `useTheme` hook (`frontend/src/hooks/useTheme.ts`).
   - Theme preference is persisted in `localStorage` and applied to the root `<html>` element (`class="dark"` / `class="light"`).
2. **Semantic Color Tokens**:
   - Never use hardcoded arbitrary colors (e.g. `bg-[#1a1a1a]`, `text-black`, `text-white`) for base surfaces and text.
   - Always use theme tokens from Tailwind and CSS variables: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`.
   - Ensure high contrast in both light and dark modes.

## 2. Accessibility (a11y)
1. **Interactive Elements**:
   - Every button, link, and interactive trigger must have an accessible label (`aria-label` or visible text).
   - Dialogs and modals must include `DialogTitle` and `DialogDescription` for screen readers (using Radix/shadcn primitives).
2. **Focus & Keyboard Navigation**:
   - Preserve visible focus indicators (`focus-visible:ring-2 focus-visible:ring-ring`).
   - Modals must support keyboard trap and `Escape` key dismissal.
3. **Form Elements**:
   - All inputs must have associated `<label>` or `htmlFor` identifiers.

## 3. UI State Coverage
Every view and data-fetching component must explicitly handle 4 UI states:
1. **Loading State**: Display skeleton loaders or spinner while RTK Query `isLoading` is true.
2. **Error State**: Gracefully show error alert with user-friendly retry button or fallback message (`isError`).
3. **Empty State**: Meaningful placeholder when result lists are empty (e.g. "No games found matching filters").
4. **Success / Data State**: Polished rendering of cards and lists.
