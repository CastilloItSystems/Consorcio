# Frontend structure notes

- `app/` - Next.js app router pages and layouts (already present).
- `components/` - Reusable UI components (Navbar, Footer, etc.).
- `hooks/` - Custom React hooks and providers (`useAuth` exists).
- `lib/` - Small client utilities for API and auth (already present).
- `types/` - Shared TypeScript types.

Next steps:

1. Add more components (Button, Loading, Error) and a top-level `Layout` that imports `Navbar`/`Footer`.
2. Optionally move `AuthProvider` into `context/AuthProvider.tsx` if you prefer separation of concerns.
3. Add tests under `__tests__` and storybook if desired.
