"use client";

import useSWR from "swr";
import { buildPhotoUrl } from "~/lib/googlePlaces";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PlaceDetails({
  placeId,
  query,
}: {
  placeId?: string;
  query?: string;
}) {
  const { data: searchData, isLoading: isSearching } = useSWR(
    !placeId && query
      ? `/api/places?q=${encodeURIComponent(query)}&provider=google`
      : null,
    fetcher,
  );

  const resolvedId: string | undefined =
    placeId ||
    searchData?.results?.[0]?.place_id ||
    searchData?.candidates?.[0]?.place_id;

  const { data: detailsData, isLoading: isLoadingDetails } = useSWR(
    resolvedId
      ? `/api/places/details?place_id=${encodeURIComponent(resolvedId)}`
      : null,
    fetcher,
  );

  const loading = isSearching || isLoadingDetails;
  const result = detailsData?.result;
  const upstreamStatus = detailsData?.status || searchData?.status;
  const upstreamError = detailsData?.error_message || searchData?.error_message;

  if (loading) {
    return <div className="text-sm text-zinc-500">Loading…</div>;
  }

  if (!result) {
    return (
      <div className="text-sm text-zinc-500">
        No details found{query ? ` for “${query}”` : ""}
        {upstreamStatus ? ` (${upstreamStatus})` : ""}
        {upstreamError ? ` — ${upstreamError}` : ""}
      </div>
    );
  }

  const photos = Array.isArray(result.photos) ? result.photos.slice(0, 6) : [];
  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold">{result.name}</div>
        {result.formatted_address && (
          <div className="text-sm text-zinc-500">
            {result.formatted_address}
          </div>
        )}
        {typeof result.rating === "number" && (
          <div className="text-sm mt-1">
            ⭐ {result.rating} ({result.user_ratings_total ?? 0})
          </div>
        )}
      </div>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p: { photo_reference?: string }, idx: number) => {
            const src = p.photo_reference
              ? buildPhotoUrl(p.photo_reference, 500)
              : undefined;
            return src ? (
              <img
                key={idx}
                src={src}
                alt="Photo"
                className="w-full h-24 object-cover rounded-md"
              />
            ) : null;
          })}
        </div>
      )}
      {Array.isArray(result.reviews) && result.reviews.length > 0 && (
        <div className="space-y-3">
          <div className="font-medium">Reviews</div>
          <ul className="space-y-2">
            {result.reviews
              .slice(0, 3)
              .map(
                (
                  r: { author_name?: string; rating?: number; text?: string },
                  i: number,
                ) => (
                  <li
                    key={i}
                    className="text-sm border rounded-md p-3 bg-white/50 dark:bg-zinc-900/50"
                  >
                    <div className="font-medium">
                      {r.author_name} — {r.rating}★
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">
                      {r.text}
                    </div>
                  </li>
                ),
              )}
          </ul>
        </div>
      )}
      <div className="text-sm text-zinc-500">
        {result.opening_hours?.open_now !== undefined && (
          <span className="mr-2">
            {result.opening_hours.open_now ? "Open now" : "Closed"}
          </span>
        )}
        {result.website && (
          <a
            className="underline"
            href={result.website}
            target="_blank"
            rel="noreferrer"
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}
