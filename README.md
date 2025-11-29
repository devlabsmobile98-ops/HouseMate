
# Housemates Mobile App UI

This is a Vite + React build of the Housemates Mobile UI. The original design files are available at https://www.figma.com/design/ftAWR5YVALtB7aMlWekd2P/Housemates-Mobile-App-UI.

## Running the code

```bash
npm install
npm run dev
```

## Data layer & persistence

The UI now ships with a lightweight `HouseMateProvider` (see `src/state/houseMateContext.tsx`). It behaves like an in-browser backend:

- Stores houses, members, tasks, groceries, bills, bulletin notes, calendar events, and chat messages.
- Persists the entire state tree to `localStorage` under the key `housemate-state-v1`.
- Generates invite codes for each house so new roommates can join locally.

Because persistence is handled in the browser, every user on the same device gets a consistent experience even after refreshing. To reset all data, clear the `localStorage` key mentioned above.

### When you need a real backend

House data currently lives only in the visitor’s browser. To collaborate across devices you’ll eventually need an API + database. A minimal path would be:

1. Stand up a small backend (Supabase, Firebase, or a simple REST API) that can store houses, members, and all list/event collections.
2. Swap the context’s reducer actions with async calls to that backend.
3. Keep the same React hooks so screens don’t need to change again.

Until then, the current implementation is perfect for demos, prototyping flows, or user testing on a single device.
  