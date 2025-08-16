"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { TripPlan, useTripStore } from "~/store/tripStore";
import { Timeline as UITimeline } from "~/components/ui/timeline";
import { buildPhotoUrl } from "~/lib/googlePlaces";
import Image from "next/image";
import { useState } from "react";
import { useUIStore } from "~/store/uiStore";
import { Button } from "~/components/ui/button";
import { formatDateFriendly } from "~/lib/utils";
import MapView from "~/components/MapView";
import DirectionsMap from "~/components/DirectionsMap";
import PlaceDetails from "~/components/PlaceDetails";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function DayItemCard({
  item,
}: {
  item: TripPlan["days"][number]["items"][number];
}) {
  const openPlace = useUIStore((s) => s.openPlace);
  // try fetching place details if we have a placeId for richer images
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
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group rounded-xl border border-border overflow-hidden bg-background"
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

export default function ItineraryByIdPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { plans, upsertPlan, setActivePlan } = useTripStore();
  const localPlan = plans.find((p) => p.id === params.id);

  // try to fetch from DB by _id if local not found
  const { data: remotePlan } = useSWR<TripPlan>(
    !localPlan ? `/api/plans/${params.id}` : null,
    fetcher,
  );

  const plan = localPlan || remotePlan;

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">
        <div className="text-xl font-semibold">Itinerary not found</div>
        <Button onClick={() => router.push("/")}>Back to home</Button>
      </div>
    );
  }

  // Ensure active plan in store
  if (!localPlan) {
    upsertPlan(plan);
    setActivePlan(plan.id);
  }

  return (
    <div className="w-full">
      <UITimeline
        title={<span>{plan.name}</span>}
        description={
          <span>
            {plan.destinations?.join(", ") || "Your custom itinerary"}
          </span>
        }
        data={plan.days.map((day, idx) => ({
          title: formatDateFriendly(day.date) ?? `Day ${idx + 1}`,
          content: (
            <div className="space-y-4">
              {/* explicit date header */}
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                {formatDateFriendly(day.date) ?? `Day ${idx + 1}`}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.items.map((item, j) => (
                  <DayItemCard key={`${idx}-${j}`} item={item} />
                ))}
              </div>
              {day.items.filter((it) => it.coordinates).length >= 2 ? (
                <DirectionsMap
                  points={
                    day.items
                      .map((it, i) =>
                        it.coordinates
                          ? {
                              id: `${idx}-${i}`,
                              position: {
                                lat: it.coordinates.lat,
                                lon: it.coordinates.lon,
                              },
                              title: it.title,
                            }
                          : null,
                      )
                      .filter(Boolean) as Array<{
                      id: string;
                      position: { lat: number; lon: number };
                      title?: string;
                    }>
                  }
                />
              ) : day.items.some((it) => it.coordinates) ? (
                <MapView
                  fitBounds
                  markers={day.items
                    .filter((it) => !!it.coordinates)
                    .map((it, i) => ({
                      id: `${idx}-${i}`,
                      lat: it.coordinates!.lat,
                      lon: it.coordinates!.lon,
                      title: it.title,
                    }))}
                  center={
                    day.items.find((it) => it.coordinates)?.coordinates ??
                    undefined
                  }
                />
              ) : null}
            </div>
          ),
        }))}
      />
      <PageModal />
    </div>
  );
}

function PageModal() {
  const placeModalOpen = useUIStore((s) => s.placeModalOpen);
  const selectedPlaceId = useUIStore((s) => s.selectedPlaceId);
  const selectedQuery = useUIStore((s) => s.selectedQuery);
  const closePlace = useUIStore((s) => s.closePlace);
  return (
    <Dialog
      open={placeModalOpen}
      onOpenChange={(open) => {
        if (!open) closePlace();
      }}
    >
      <DialogContent>
        <DialogTitle>Place details</DialogTitle>
        <DialogDescription>Photos, ratings and reviews</DialogDescription>
        <div className="mt-2">
          <PlaceDetails placeId={selectedPlaceId} query={selectedQuery} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
