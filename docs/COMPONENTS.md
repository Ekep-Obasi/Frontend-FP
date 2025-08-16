### Components reference

This document explains the purpose and props for key components.

#### `components/Header.tsx`

- App header with links to `Planner` and `History`.

#### `components/DestinationAutocomplete.tsx`

- Props
  - `className?: string`
  - `placeholder?: string` (default: "Where are you going?")
  - `onPlaceSelected({ name, lat, lon })`
- Uses `@react-google-maps/api` `Autocomplete` and requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

#### `components/InterestsSelector.tsx`

- Props
  - `defaultSelected?: string[]`
  - `onChange?: (selected: string[]) => void`
- Renders a responsive grid of selectable interest chips.

#### `components/ExploreGrid.tsx`

- Props
  - `query: string`
  - `location?: { lat: number; lon: number }`
  - `hero?: boolean`
- Fetches `/api/places` via SWR and renders `LocationCard`s. Clicking a card opens `PlaceDetails` via `useUIStore`.

#### `components/LocationCard.tsx`

- Props
  - `title: string`
  - `subtitle?: string`
  - `description?: string`
  - `imageUrl?: string`
  - `rating?: number`
  - `ratingCount?: number`
  - `onClick?: () => void`
  - `size?: "default" | "hero"` (default `default`)
  - `loading?: boolean` (skeleton state)

#### `components/PlaceDetails.tsx`

- Props
  - `placeId?: string`
  - `query?: string` (used to resolve a place id if `placeId` missing)
- Fetches `/api/places/details` and renders basic information, photos and reviews.

#### `components/ItineraryItemCard.tsx`

- Props
  - `item: TripPlan["days"][number]["items"][number]`
- Resolves a photo from Places search/details, prefetches data on hover, and opens the Place modal on click.

#### `components/MapView.tsx`

- Props
  - `center?: { lat: number; lon: number }`
  - `markers?: Array<{ id: string; lat: number; lon: number; title?: string }>`
  - `fitBounds?: boolean` (default true)
- Renders a basic Google Map and optional markers.

#### `components/DirectionsMap.tsx`

- Props
  - `points: Array<{ id: string; position: { lat: number; lon: number }; title?: string }>`
  - `travelMode?: google.maps.TravelMode` (default DRIVING)
- Computes and renders a directions polyline between points.

#### `components/AiGeneratingOverlay.tsx`

- Props
  - `visible: boolean`
  - `label?: string`
- Full-screen overlay with a minimal animated progress bar.

#### UI primitives (`components/ui/*`)

- `button.tsx` – variant/size props via class-variance-authority.
- `card.tsx` – `Card`, `CardHeader`, `CardContent` containers.
- `dialog.tsx` – Radix-based modal; exports `Dialog`, `DialogContent`, etc.
- `placeholders-and-vanish-input.tsx` – animated input utility.
- `timeline.tsx` – scroll-animated timeline used on itinerary page.
