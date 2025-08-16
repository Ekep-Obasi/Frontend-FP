### API reference

All routes live under `src/app/api`. Responses are JSON unless otherwise noted.

#### POST `/api/ai`

- Body

```
{
  interests: string[],
  startDate?: string,
  endDate?: string,
  homeAirport?: string,
  budgetLevel?: "low" | "medium" | "high",
  travelers?: number,
  constraints?: string[],
  destinationHint?: string
}
```

- Returns: `{ itinerary: { days, overallTips?, estimatedCostUSD?, destinations? } }`
- Errors: `400` on validation, `500` missing key, `502` if LLM failed to return JSON.

#### Plans

`GET /api/plans`

- Returns an array of recent plans: each item has `_id`, plan fields, and `createdAt`.

`POST /api/plans`

- Body: a full `TripPlan` object; validated with Zod.
- Returns the inserted document with `_id` and `createdAt`.

`GET /api/plans/[id]`

- Returns the plan by Mongo `_id`.

`PUT /api/plans/[id]`

- Body: full `TripPlan`; replaces `plan` field in the document.

`DELETE /api/plans/[id]`

- Deletes the document.

Environment

- Requires `NEXT_PUBLIC_MONGODB_URI` and optionally `NEXT_PUBLIC_MONGODB_DB`.

#### Places

`GET /api/places`

- Query params
  - `q` – text query (required unless `location` provided)
  - `location` – `lat,lng` string for nearby search
  - `provider` – `google` (default) or `mapbox`
- Returns raw upstream payload from Google Places Text/Nearby Search or Mapbox Geocoding.

`GET /api/places/details`

- Query params: `place_id` (or `id`)
- Returns raw Google Places Details payload (with selected fields).

`GET /api/places/photo`

- Query params: `ref` (or `photo_reference`), `maxwidth`
- Returns streamed image with appropriate `Content-Type` and cache headers.
