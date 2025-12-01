
# Housemates Mobile App UI

This is a Vite + React build of the Housemates Mobile UI. The original design files were created on Figma.

## Running the code

```bash
npm install
npm run dev
```
Or, on Netlify: housemateapp.netlify.app

## Frontend

- Dashboard, Profile, Notifications, Settings
- Chat w/ HouseMates
- Grocery List, Bill Splitter, Calendar/Scheduler

## Backend

Lightweight `HouseMateProvider` (see `src/state/houseMateContext.tsx`). It behaves like an in-browser backend:

- Stores houses, members, tasks, groceries, bills, bulletin notes, calendar events, and chat messages.
- Persists the entire state tree to `localStorage` under the key `housemate-state-v1`.
- Generates invite codes for each house so new roommates can join locally.

Because persistence is handled in the browser, every user on the same device gets a consistent experience even after refreshing. To reset all data, clear the `localStorage` key mentioned above.
