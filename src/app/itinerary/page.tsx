"use client";

import { useUIStore } from "~/store/uiStore";
import { useTripStore } from "~/store/tripStore";
import { Timeline as UITimeline } from "~/components/ui/timeline";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDateFriendly } from "~/lib/utils";
import MapView from "~/components/MapView";
import DirectionsMap from "~/components/DirectionsMap";
import ItineraryItemCard from "~/components/ItineraryItemCard";
import PlaceDetails from "~/components/PlaceDetails";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";

export default function ItineraryPage() {
  const { plans, activePlanId } = useTripStore();
  const activePlan = plans.find((p) => p.id === activePlanId);
  const openPlace = useUIStore((s) => s.openPlace);
  const router = useRouter();

  if (!activePlan) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="text-xl font-semibold">No active itinerary</div>
        <p className="text-sm text-muted-foreground">
          Go back and generate an itinerary first.
        </p>
        <Button onClick={() => router.push("/")}>Back to home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      <UITimeline
        title={<span>{activePlan.name}</span>}
        description={
          <span>
            {activePlan.destinations?.join(", ") || "Your custom itinerary"}
          </span>
        }
        data={activePlan.days.map((day, idx) => ({
          title: formatDateFriendly(day.date) ?? `Day ${idx + 1}`,
          content: (
            <div className="rounded-none p-4 md:p-6 space-y-4">
              {day.summary ? (
                <div className="text-sm text-zinc-500 mb-3">{day.summary}</div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.items.map((item, j) => (
                  <ItineraryItemCard key={`${idx}-${j}`} item={item} />
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
