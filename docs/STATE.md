### State management

The app uses two persisted Zustand stores.

#### `useTripStore` (`src/store/tripStore.ts`)

- Shape

```
{
  plans: TripPlan[],
  activePlanId?: string,
  setActivePlan(id?: string): void,
  upsertPlan(plan: TripPlan): void,
  removePlan(id: string): void,
  updateDayItem(planId: string, dayIndex: number, itemIndex: number, item: Partial<TripDayItem>): void
}
```

- Persistence key: `trip-store`.
- Typical flow
  1. After `/api/ai`, build a `TripPlan` and `upsertPlan` it.
  2. Navigate to `/itinerary/[id]`; UI reads the active plan from the store.
  3. CRUD actions in `history/page.tsx` sync with the DB and local store.

#### `useUIStore` (`src/store/uiStore.ts`)

- Fields: `placeModalOpen`, `selectedPlaceId`, `selectedQuery`, `selectedCoordinates`, `mapCenter`, `mapMarkers`.
- Actions
  - `openPlace({ placeId?, query?, lat?, lon?, title? })` – opens modal, optionally sets a single marker and centers the map.
  - `closePlace()` – closes the modal and clears selection.
  - `setMapTo(center, markers?)` – adjusts the map view.
- Persistence key: `ui-store`.
