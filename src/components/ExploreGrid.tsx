"use client";

import useSWR from "swr";
import LocationCard from "./LocationCard";
import { useUIStore } from "~/store/uiStore";
import { buildPhotoUrl } from "~/lib/googlePlaces";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ExploreGrid({
  query,
  location,
}: {
  query: string;
  location?: { lat: number; lon: number };
}) {
  const openPlace = useUIStore((s) => s.openPlace);
  const qs = new URLSearchParams();
  if (query) qs.set("q", query);
  if (location) qs.set("location", `${location.lat},${location.lon}`);
  const { data, isLoading } = useSWR(
    query ? `/api/places?${qs.toString()}` : null,
    fetcher,
  );

  if (!query) return null;
  if (isLoading)
    return <div className="text-sm text-zinc-500">Searching “{query}”…</div>;

  const results = data?.results || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((r: any) => (
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
