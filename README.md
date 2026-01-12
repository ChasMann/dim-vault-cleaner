# DIM Vault Toolkit

A self-hosted, dark-mode web app for building DIM search queries, tracking armor sets, and composing DIM wishlist files. The app runs locally with SQLite, no login required.

## Features
- Template-driven DIM search builder with quoting rules
- Favorites library with JSON export/import
- Armor set tracker with checkbox grids and progress
- DIM wishlist builder with notes, block notes, wildcard, and trashlist entries
- Settings screen for defaults and backups
- Error logs screen with filtering and copy support
- Optional Sentry forwarding when `SENTRY_DSN` is set

## Tech stack
- Next.js App Router + React + TypeScript
- Tailwind CSS
- Prisma + SQLite
- Zod validation

## Local development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a database file:
   ```bash
   npx prisma db push
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`.

## Docker
1. Copy `.env.example` to `.env` and adjust if needed.
2. Build and run:
   ```bash
   docker compose up --build
   ```
3. Visit `http://localhost:3000`.

The SQLite database is stored in `./prisma/dev.db` and is mounted into the container for persistence.

## Backup and restore
- **Export:** Use **Settings → Backup & Restore** to export a full JSON backup of templates, favorites, armor sets, wishlists, and settings.
- **Import:** Paste a JSON backup into the same screen and click **Import backup**.
- **Templates/Favorites only:** Use **Templates & Favorites → Backup & Import** for template/favorite-only backups.

## Adding new templates and favorites
- **Templates:** Go to **Templates & Favorites → Template Editor**, click **New template**, add rules, and save.
- **Favorites:** Build a query in **Search Builder**, then save it in the output section.

## Environment variables
- `DATABASE_URL`: SQLite database path (example: `file:./dev.db`).
- `SENTRY_DSN`: Optional server-side Sentry DSN.
- `NEXT_PUBLIC_SENTRY_DSN`: Optional client-side Sentry DSN.

## Notes
- Error logs are stored in SQLite and viewable in the **Error Logs** screen.
- Request IDs are logged on the server for traceability.
