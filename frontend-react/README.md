# React Frontend (Migration)

This repo keeps your existing Vue frontend intact in `../frontend/` and adds a new React frontend here so you can migrate page-by-page.

## Run

- React dev server: `cd frontend-react && npm install && npm run dev`
- Vue dev server (unchanged): `cd frontend && npm run dev`

If you want the API locally while developing:

- Backend API: `cd backend && npm install && npm run dev` (or whichever script you use)

## Routes mirrored from Vue

The React app mirrors the existing Vue paths so URLs can stay consistent while migrating:

- `/events`
- `/videos`
- `/book`
- `/setlist`
- `/admin`

## State

- Redux Toolkit store is wired at `src/store/store.js` (add slices as you port features).
- A simple Context provider lives at `src/providers/AppProvider.jsx` for app-wide UI state.

## Assets

- Vue assets were copied to `src/assets-vue/` and `public-vue/` for reuse.
