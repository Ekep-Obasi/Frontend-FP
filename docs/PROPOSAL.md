### Smart Travel Itinerary Builder — Proposal (The Company)

**Goal**
Help travelers plan better trips in minutes by generating smart, personalized itineraries and letting them refine, preview, and save plans with a clean, map‑centric UI.

### Why now

- **Overchoice**: Too many sources, not enough synthesis.
- **Time cost**: Research is fragmented across maps, blogs, and booking sites.
- **Personalization gap**: Most tools aren’t tailored to interests, constraints, and budgets.

### What we’re building

- **Smart Itinerary**: AI‑curated day‑by‑day plans based on interests, dates, budget, and group size.
- **Map‑first UI**: Explore places visually and preview photos, ratings, and review snippets.
- **Seamless edits**: Swap items, add nearby picks, re‑run suggestions, keep everything in sync.
- **History & Sync**: Persist plans to the cloud for later retrieval and collaboration.

### Core features

- **Itinerary generation**: Gemini‑powered creation with realistic activities, tips, and cost estimate.
- **Explore & details**: Google Places search with photos, ratings, and top reviews in a modal.
- **Weather glance**: Quick forecast to inform planning.
- **Timeline**: Clean day‑by‑day schedule with tappable items for details.
- **Persistence**: Save, rename, duplicate, delete plans; set active plan and continue later.

### Primary user flow

1. **Onboarding**: Enter trip name, destination hint, and interests.
2. **Generate**: Receive a draft itinerary and cost estimate.
3. **Explore**: Search the map, open details, replace/add items.
4. **Finalize**: Save to history; share/export next.

### Data & AI

- **AI**: Gemini produces structured itineraries from user preferences.
- **Places & reviews**: Google Places (search, details, photos).
- **Weather**: OpenWeather forecast.

### Design principles

- **Map‑centric**: The map anchors exploration and context.
- **Calm UI**: Neutral, modern styling—no noisy gradients; content first.
- **Shallow hierarchy**: Fewer steps, faster decisions.
- **Responsive**: Works across desktop and mobile.

### Differentiators

- **Truly personal**: Interests and constraints shape the plan end‑to‑end.
- **Fast iteration**: One‑click re‑gen, quick swaps from Explore.
- **Grounded previews**: Photos/reviews build confidence before adding.

### Success measures

- **TTV (time‑to‑value)**: Time from onboarding to a usable itinerary.
- **Iteration rate**: Number of itinerary edits per session.
- **Return usage**: Plans created vs. plans reopened.
- **Satisfaction**: Quick pulse rating after generation.

### Risks & mitigations

- **API reliability**: Server‑side proxies and clear fallbacks.
- **AI variance**: Constrain outputs with structured prompts and validation.
- **Quota/keys**: Centralized env config; add caching in later phases.

### Roadmap

- **Phase 1 (current)**: Project setup, navigation, core components (`Header`, `MapView`, `Timeline`, cards), onboarding, AI generation, Google Places details, Mongo persistence, basic styling and responsiveness.
- **Phase 2**: Editing tools (drag to reorder, replace suggestions), export/share, improved cost breakdown, multi‑city support.
- **Phase 3**: Bookings integrations (flights/hotels), collaborative planning, notifications.

### Deliverables for Phase 1

- **Pages**: Planner (`/`), History (`/history`).
- **Components**: `Header`, `MapView`, `Timeline`, `LocationCard`, `PlaceDetails`, onboarding form, shadcn UI primitives (buttons, inputs, dialog).
- **State**: Trip plans and UI state with persistence.
- **APIs**: AI itinerary, places search/details/photo proxy, weather, CRUD for plans.
- **Styling**: Minimal, consistent theme; responsive layouts.

### Requirements to run

- Environment keys: Gemini, Google (Places/Maps), OpenWeather, MongoDB.
- Start: install dependencies and run the dev server.

This scope establishes a polished foundation that already delivers value: users can generate, explore, preview, and save itineraries—with a clear path to richer editing and bookings next.
