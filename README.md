# Recruitment Management System Ver2

Sprint1 focuses on architecture, reusable UI components, and a modern responsive interface.

This sprint does not include authentication, Supabase, Airwork integration, or backend logic.

## Setup

```bash
pnpm install
pnpm run dev
```

## Quality Checks

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Deploy

For GitHub Pages static deployment, upload:

- `index.html`
- `assets/`

For a Vite build deployment:

```bash
pnpm run build
```

Then deploy `dist/`.

Do not upload `node_modules/`.

## Folder Structure

```text
src/
 ├─ components/   Reusable UI components
 ├─ layouts/      Sidebar, header, app shell
 ├─ pages/        Dashboard, Applicants, Interviews, Stores, Analytics, Settings, errors
 ├─ hooks/        UI state helpers
 ├─ services/     Placeholder data access layer
 ├─ lib/          Small framework helpers
 ├─ types/        TypeScript domain types
 ├─ utils/        Formatting and derived stats
 ├─ constants/    Navigation, theme, mock data
 ├─ assets/       Static assets
 └─ styles/       Tailwind entry
```

## Sprint1 Scope

- Global layout with responsive sidebar, header, and main content
- Sidebar pages: Dashboard, Applicants, Interviews, Stores, Analytics, Settings
- Header actions: notifications, dark mode toggle UI, profile icon
- Dashboard KPI cards with placeholder data
- Reusable components: Button, Card, Input, Select, Textarea, Badge, Modal, Table, Skeleton, Empty State
- 404 and 500 pages
- Tailwind design system using:
  - Primary `#2563EB`
  - Success `#22C55E`
  - Warning `#F59E0B`
  - Danger `#EF4444`
  - Background `#F8FAFC`

## Notes

Existing recruitment screens remain represented with placeholder data. No database or backend integration is used in this sprint.
