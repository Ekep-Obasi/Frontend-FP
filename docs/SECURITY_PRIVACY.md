### Security & privacy notes

- API keys
  - Never commit keys. Use `.env.local` for local dev and provider-specific secret managers in production.
  - Frontend uses `NEXT_PUBLIC_*` keys only where required by Google Maps JS.

- Server routes
  - All external requests for Places and Gemini are routed server-side to avoid leaking URL shapes from the UI.
  - Errors are sanitized; upstream messages are not forwarded verbatim.

- Data storage
  - Plans are stored in MongoDB with the shape documented in `ARCHITECTURE.md`.
  - No user accounts; plans are not scoped to an authenticated user in Phase 1.

- Images
  - `/api/places/photo` streams with cache headers; no images are stored locally.

- CORS
  - Default Next.js behavior; all API routes are same-origin and consumed by the app.


