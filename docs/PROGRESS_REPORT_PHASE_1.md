### CPAN144 Group Project – Phase 1 Progress Report

Project: Tripee – AI-assisted itinerary planner

Date: {{update as needed}}

### 1) Project setup and structure

- New Next.js 15 project configured with React 19 and Tailwind CSS v4.
- File structure established per proposal:
  - `src/app` for routes (`/`, `/history`, `/itinerary/[id]`).
  - `src/components` for reusable UI components.
  - `src/store` for Zustand stores (`tripStore`, `uiStore`).
  - `src/lib` for utilities and integrations (`db`, `googlePlaces`, `utils`).
  - `src/app/api` for Route Handlers (AI generation, Places, Plans CRUD).
- Scripts in `package.json` to dev, build, start, lint, and format.

Evidence

- See `docs/ARCHITECTURE.md` and `docs/SETUP.md`.

### 2) Basic components and state

- Primary components implemented:
  - `Header` – top navigation and branding.
  - Planner widgets: `DestinationAutocomplete`, `InterestsSelector`, `ExploreGrid`, `LocationCard`, `PlaceDetails`, `AiGeneratingOverlay`.
  - Itinerary widgets: `ui/timeline`, `ItineraryItemCard`, `MapView`, `DirectionsMap`.
- State management:
  - `useTripStore` persists plans and provides `upsertPlan`, `removePlan`, `setActivePlan`, `updateDayItem`.
  - `useUIStore` manages place modal and map context.
- State lifting:
  - Home/Planner page (`src/app/page.tsx`) holds interests, destination hint and coordinates, and triggers itinerary generation; passes down state via props as needed.

### 3) Routing

- Implemented at least three pages:
  - `/` – planner and popular sights grid.
  - `/history` – list with open/rename/duplicate/delete actions against DB API.
  - `/itinerary/[id]` – timeline rendering of the active plan with maps/directions.

### 4) Basic styling and responsiveness

- Tailwind utility classes for layout and spacing.
- Responsive grids for `ExploreGrid` and cards; mobile-friendly modals and timeline.
- Accessible labels, focus styles, and hover states.

### 5) Interactive component example (screenshots requested)

- Suggested screenshots to include with submission:
  - Home planner showing autocomplete and interests.
  - Itinerary page with timeline and a map section.
  - History page showing actions.

### Known limitations / next steps

- Env configuration required to fully exercise AI and Maps features.
- Authentication and per-user plan isolation are out of scope for Phase 1.
- Additional validation and error UI can be added for edge cases.

### Rubric checklist mapping (10 points)

- Project Structure and Setup – implemented (2/2)
- Component Creation and Basic State – implemented (2/2)
- Navigation and Routing – implemented (2/2)
- Basic Styling and Responsiveness – implemented (2/2)
- Documentation and Submission – this docs folder (2/2)
