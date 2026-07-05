# Recruitment Management System Ver2

This repository is configured for GitHub Pages static hosting through GitHub Actions.

No build step is required for deployment.

## Deploy

GitHub Pages should be configured as:

- Source: `GitHub Actions`

The published files are:

- `index.html`
- `assets/app.js`
- `styles.css`
- `.nojekyll`

`index.html` loads the app with:

```html
<script type="module" src="./assets/app.js"></script>
```

Because the app is loaded directly from `assets/app.js`, Vite, pnpm, TypeScript, and ESLint are not required for Pages deployment.

Deployment is handled by `.github/workflows/deploy.yml` using `actions/upload-pages-artifact` and `actions/deploy-pages`.

## Source Notes

```text
/
 ├─ index.html
 ├─ assets/
 │   └─ app.js
 ├─ .nojekyll
 └─ README.md
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

Supabase and Airwork integration are intentionally not included.
