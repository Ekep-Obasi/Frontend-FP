"use client";

import useSWR from "swr";
import LocationCard from "./LocationCard";
import { useUIStore } from "~/store/uiStore";
import { buildPhotoUrl } from "~/lib/googlePlaces";
import { PlacesSearchResponse, PlaceSearchResult } from "~/types/places";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ExploreGrid({
  query,
  location,
  hero,
}: {
  query: string;
  location?: { lat: number; lon: number };
  hero?: boolean;
}) {
  const openPlace = useUIStore((s) => s.openPlace);
  const qs = new URLSearchParams();
  if (query) qs.set("q", query);
  if (location) qs.set("location", `${location.lat},${location.lon}`);
  const { data, isLoading } = useSWR<PlacesSearchResponse>(
    query ? `/api/places?${qs.toString()}` : null,
    fetcher,
  );

  if (!query) return null;
  if (isLoading)
    return (
      <div
        className={
          hero
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        }
      >
        {Array.from({ length: hero ? 6 : 6 }).map((_, idx) => (
          <LocationCard
            key={idx}
            title=""
            loading
            size={hero ? "hero" : "default"}
          />
        ))}
      </div>
    );

  const results: PlaceSearchResult[] = data?.results || [];

  return (
    <div
      className={
        hero
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      }
    >
      {results.map((r) => (
        <LocationCard
          key={r.place_id}
          title={r.name}
          subtitle={r.formatted_address || r.vicinity}
          imageUrl={
            r.photos?.[0]?.photo_reference
              ? buildPhotoUrl(r.photos[0].photo_reference, 600)
              : undefined
          }
          rating={r.rating}
          ratingCount={r.user_ratings_total}
          description={r.types?.slice(0, 3)?.join(" · ")}
          size={hero ? "hero" : "default"}
          onClick={() =>
            openPlace({
              placeId: r.place_id,
              query: r.name,
              lat: r.geometry?.location?.lat,
              lon: r.geometry?.location?.lng,
            })
          }
        />
      ))}
    </div>
  );
}
