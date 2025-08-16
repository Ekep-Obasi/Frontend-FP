"use client";

import Image from "next/image";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { buildPhotoUrl } from "~/lib/googlePlaces";
import { TripPlan } from "~/store/tripStore";
import { useUIStore } from "~/store/uiStore";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ItineraryItemCard({
  item,
}: {
  item: TripPlan["days"][number]["items"][number];
}) {
  const openPlace = useUIStore((s) => s.openPlace);
  const { mutate } = useSWRConfig();
  const [imgError, setImgError] = useState(false);

  const { data: detailsData } = useSWR(
    item.placeId
      ? `/api/places/details?place_id=${encodeURIComponent(item.placeId)}`
      : null,
    fetcher,
  );
  const query = item.placeQuery || item.title;
  const { data: searchData } = useSWR(
    !item.placeId && query
      ? `/api/places?q=${encodeURIComponent(query)}`
      : null,
    fetcher,
  );
  const photoRef: string | undefined =
    detailsData?.result?.photos?.[0]?.photo_reference ||
    searchData?.results?.[0]?.photos?.[0]?.photo_reference ||
    searchData?.candidates?.[0]?.photos?.[0]?.photo_reference;
  const imgUrl = photoRef ? buildPhotoUrl(photoRef, 1200) : undefined;

  async function prefetchPlace() {
    try {
      if (item.placeId) {
        const url = `/api/places/details?place_id=${encodeURIComponent(item.placeId)}`;
        await mutate(url, fetcher(url), { revalidate: false });
        return;
      }
      const q = item.placeQuery || item.title;
      if (!q) return;
      const searchUrl = `/api/places?q=${encodeURIComponent(q)}`;
      const search = (await mutate(searchUrl, fetcher(searchUrl), {
        revalidate: false,
      })) as
        | {
            results?: Array<{
              place_id?: string;
              photos?: Array<{ photo_reference?: string }>;
            }>;
            candidates?: Array<{
              place_id?: string;
              photos?: Array<{ photo_reference?: string }>;
            }>;
          }
        | undefined;
      const candidateId =
        search?.results?.[0]?.place_id || search?.candidates?.[0]?.place_id;
      if (candidateId) {
        const detailsUrl = `/api/places/details?place_id=${encodeURIComponent(candidateId)}`;
        await mutate(detailsUrl, fetcher(detailsUrl), { revalidate: false });
      }
    } catch {}
  }

  return (
    <div
      className="group rounded-xl border border-border overflow-hidden bg-background cursor-pointer"
      onClick={() => {
        const name = item.placeQuery || item.title;
        openPlace({
          query: name,
          placeId: item.placeId,
          lat: item.coordinates?.lat,
          lon: item.coordinates?.lon,
          title: item.title,
        });
      }}
      onMouseEnter={prefetchPlace}
      onFocus={prefetchPlace}
      onTouchStart={prefetchPlace}
    >
      {imgUrl && !imgError ? (
        <div className="relative h-56 w-full">
          <Image
            src={imgUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 900px, 100vw"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="relative h-56 w-full grid place-items-center bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700">
          <Image
            src="/window.svg"
            alt="Placeholder"
            width={64}
            height={64}
            className="opacity-70"
          />
        </div>
      )}
      <div className="p-4">
        <div className="text-sm text-zinc-500">{item.time ?? ""}</div>
        <div className="font-medium">{item.title}</div>
        {item.description ? (
          <div className="text-sm text-muted-foreground mt-1">
            {item.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
