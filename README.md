# Foodbank4u

## Requirements

- Node.js (LTS recommended)

## Getting started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project structure

- `app/`: Next.js App Router pages/layouts
- `components/`: shared UI/components
- `lib/`: API client and service modules
- `types/`: shared TypeScript types
- `public/`: static assets

## Code quality

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```

Format check (CI-friendly):

```bash
npm run format:check
```

## Notes

- Global styles live in `app/globals.css` (Tailwind v4).
- The app currently loads the Mulish font via a Google Fonts `<link>` in `app/layout.tsx`.
