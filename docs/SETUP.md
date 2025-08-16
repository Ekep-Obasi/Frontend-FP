### Project setup

This project is a Next.js 15 app using React 19, Tailwind CSS v4, Zustand for state, SWR for data fetching, and MongoDB for persistence.

### Requirements

- Node 20+
- pnpm 10+ (project uses `packageManager` lock)
- A MongoDB database (Atlas or local)
- API keys
  - Google Maps/Places: client-side usage and server-side Places endpoints
  - Google Gemini: for itinerary generation
  - Optional Mapbox token if you choose the Mapbox provider for places search

### Installation

1. Install dependencies:

```
pnpm install
```

2. Create a `.env.local` in the project root and add the following:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_js_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_MONGODB_DB=smart-travel-itineraries
# Optional: used only if provider=mapbox is passed to /api/places
MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

Notes

- The `/api/places/photo` endpoint accepts several env var names for Google Places: `GOOGLE_PLACES_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Prefer setting `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- If MongoDB envs are missing, DB routes will respond with 500 and a warning is logged at runtime.

### Scripts

- `pnpm dev` – run the app locally with Turbopack
- `pnpm build` – production build
- `pnpm start` – start production server
- `pnpm lint` – run Next/ESLint
- `pnpm format` – format with Prettier
- `pnpm format:check` – check formatting

### Running locally

```
pnpm dev
```

Visit `http://localhost:3000`.

### Deployment

- Works out-of-the-box on Vercel. Ensure the same env vars are configured in the dashboard. MongoDB network access must permit Vercel IPs or use Atlas with proper access lists.
