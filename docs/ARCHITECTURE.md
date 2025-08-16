### Architecture overview

The app is a client-first planner that generates and visualizes travel itineraries. Major layers:

- UI (React components in `src/components` and `src/app/*` pages)
- Client state (Zustand stores in `src/store`)
- Server routes (Next.js Route Handlers in `src/app/api/*`)
- External services (Google Maps/Places, Google Gemini, MongoDB)

### Routing

- `src/app/page.tsx` – Home/Planner. Entry point to generate itineraries.
- `src/app/history/page.tsx` – Saved itineraries list; supports open/rename/delete/duplicate.
- `src/app/itinerary/[id]/page.tsx` – Timeline visualization of the active plan.

### State management

- `useTripStore` (`src/store/tripStore.ts`)
  - Persists to localStorage via `zustand/middleware/persist` (key: `trip-store`).
  - Holds `plans: TripPlan[]`, `activePlanId`, and mutators: `setActivePlan`, `upsertPlan`, `removePlan`, `updateDayItem`.
- `useUIStore` (`src/store/uiStore.ts`)
  - Persists with key `ui-store`.
  - Controls the Place modal state and lightweight map state (`mapCenter`, `mapMarkers`).

### API routes

- `POST /api/ai` (`src/app/api/ai/route.ts`)
  - Validates body with Zod; calls Google Gemini; extracts JSON itinerary and returns it.
- Plans CRUD
  - `GET /api/plans` – list recent plans
  - `POST /api/plans` – create plan
  - `GET /api/plans/[id]` – fetch one
  - `PUT /api/plans/[id]` – replace one
  - `DELETE /api/plans/[id]` – remove
  - Uses `getDb()` from `src/lib/db.ts`, which connects via `NEXT_PUBLIC_MONGODB_URI`.
- Places
  - `GET /api/places` – text or nearby search (Google default; Mapbox optional)
  - `GET /api/places/details` – place details with selected fields
  - `GET /api/places/photo` – streams a photo from the Places Photo API

### Components

- Planner
  - `DestinationAutocomplete` – Google Places Autocomplete input.
  - `InterestsSelector` – pick interest tags.
  - `ExploreGrid` + `LocationCard` – render search results; opens `PlaceDetails` modal.
  - `AiGeneratingOverlay` – non-blocking overlay while generating.
- Itinerary
  - `ui/timeline` – parallax timeline component used by `itinerary/[id]` page.
  - `ItineraryItemCard` – a card per item with lazy photo fetching.
  - `MapView` / `DirectionsMap` – Google Maps integrations.
- UI kit
  - `ui/button`, `ui/card`, `ui/dialog`, `ui/placeholders-and-vanish-input` etc.

### Data models

`TripPlan` (client + API)
- `id: string` – client identifier
- `name: string`
- `travelers: number`
- `budgetLevel: "low" | "medium" | "high"`
- `interests: string[]`
- `constraints: string[]`
- `destinations?: string[]`
- `estimatedCostUSD?: number`
- `days: TripDay[]`

`TripDay`
- `date?: string`
- `summary?: string`
- `items: TripDayItem[]`

`TripDayItem`
- `time?: string`
- `title: string`
- `description?: string`
- `placeQuery?: string`
- `type?: string`
- `coordinates?: { lat: number; lon: number }`
- `placeId?: string`

### External service integration

- Google Gemini: server-only generation in `/api/ai`; model `gemini-1.5-flash`.
- Google Maps JavaScript: client components load via `@react-google-maps/api` using `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- Google Places APIs: proxied through server routes to avoid exposing raw calls and to standardize responses.
- MongoDB: connected lazily and memoized using a global promise to prevent multiple connections in dev.

### Error handling & fallbacks

- Missing env keys return 500 with a clear message in API routes; UI components show inline notices for missing Maps keys.
- `/api/ai` attempts to parse a JSON object from the LLM response; returns 502 if parsing fails.
- Places and photo endpoints bubble upstream errors as 502.

### Caching

- SWR handles client fetch caching and revalidation for places and plans.
- Images from `/api/places/photo` are served with `Cache-Control: public, max-age=86400`.


