"use client";

import useSWR from "swr";
import Image from "next/image";
import { useState } from "react";
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
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});

  const loading = isSearching || isLoadingDetails;
  const result = detailsData?.result;

  const isReady = !!result && !loading;

  const photos = Array.isArray(result?.photos)
    ? result!.photos.slice(0, 6)
    : [];

  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold">
          {isReady ? (
            result!.name
          ) : (
            <div className="h-6 w-48 rounded bg-zinc-200 animate-pulse" />
          )}
        </div>
        {isReady && result!.formatted_address ? (
          <div className="text-sm text-zinc-500">
            {result!.formatted_address}
          </div>
        ) : (
          <div className="h-4 w-64 rounded bg-zinc-200 animate-pulse mt-1" />
        )}
        {isReady && typeof result!.rating === "number" ? (
          <div className="text-sm mt-1">
            ⭐ {result!.rating} ({result!.user_ratings_total ?? 0})
          </div>
        ) : null}
      </div>
      {isReady ? (
        photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p: { photo_reference?: string }, idx: number) => {
              const src = p.photo_reference
                ? buildPhotoUrl(p.photo_reference, 500)
                : undefined;
              return src ? (
                <div
                  key={idx}
                  className="w-full h-24 relative rounded-md overflow-hidden"
                >
                  <Image
                    src={src}
                    alt="Photo"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 33vw, 33vw"
                    priority={false}
                  />
                </div>
              ) : null;
            })}
          </div>
        ) : null
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-24 rounded-md bg-zinc-200 animate-pulse"
            />
          ))}
        </div>
      )}
      {isReady &&
        Array.isArray(result!.reviews) &&
        result!.reviews.length > 0 && (
          <div className="space-y-3">
            <div className="font-medium">Reviews</div>
            <ul className="space-y-2">
              {result!.reviews
                .slice(0, 3)
                .map(
                  (
                    r: { author_name?: string; rating?: number; text?: string },
                    i: number,
                  ) => (
                    <li
                      key={i}
                      className="text-sm border rounded-md p-3 bg-background/50"
                    >
                      <div className="font-medium">
                        {r.author_name} — {r.rating}★
                      </div>
                      <div className="whitespace-pre-wrap" title={r.text ?? ""}>
                        {(() => {
                          const text = r.text ?? "";
                          const isLong = text.length > 200;
                          const expanded = !!expandedReviews[i];
                          const toShow =
                            isLong && !expanded
                              ? `${text.slice(0, 200)}…`
                              : text;
                          return (
                            <>
                              {toShow}
                              {isLong ? (
                                <button
                                  className="ml-1 underline text-zinc-600 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedReviews((prev) => ({
                                      ...prev,
                                      [i]: !prev[i],
                                    }));
                                  }}
                                >
                                  {expanded ? "Show less" : "View more"}
                                </button>
                              ) : null}
                            </>
                          );
                        })()}
                      </div>
                    </li>
                  ),
                )}
            </ul>
          </div>
        )}
      <div className="text-sm text-zinc-500">
        {isReady && result!.opening_hours?.open_now !== undefined && (
          <span className="mr-2">
            {result!.opening_hours.open_now ? "Open now" : "Closed"}
          </span>
        )}
        {isReady && result!.website && (
          <a
            className="underline"
            href={result!.website}
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
