"use client";

import { Fragment, useEffect, useState } from "react";
import MapView from "~/components/MapView";
import Timeline from "~/components/Timeline";
import LocationCard, { WeatherBadge } from "~/components/LocationCard";
import { useTripStore, TripPlan } from "~/store/tripStore";
import useSWR from "swr";
import Onboarding from "~/components/Onboarding";
import Loader from "~/components/Loader";
import HistoryList from "~/components/HistoryList";
import ExploreGrid from "~/components/ExploreGrid";
import PlaceDetails from "~/components/PlaceDetails";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { useUIStore } from "~/store/uiStore";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const { plans, activePlanId, upsertPlan, setActivePlan } = useTripStore();
  const activePlan = plans.find((p) => p.id === activePlanId);
  const [interests, setInterests] = useState<string>("food, museums, nature");
  const [destinationHint, setDestinationHint] = useState<string>("Tokyo");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("best cafes");
  const placeModalOpen = useUIStore((s) => s.placeModalOpen);
  const selectedPlaceId = useUIStore((s) => s.selectedPlaceId);
  const selectedQuery = useUIStore((s) => s.selectedQuery);
  const mapCenter = useUIStore((s) => s.mapCenter);
  const mapMarkers = useUIStore((s) => s.mapMarkers);
  const setMapTo = useUIStore((s) => s.setMapTo);
  const closePlace = useUIStore((s) => s.closePlace);

  const { data: weather } = useSWR(
    activePlan?.days?.[0]?.items?.[0]?.coordinates
      ? `/api/weather?lat=${activePlan.days[0].items[0].coordinates.lat}&lon=${activePlan.days[0].items[0].coordinates.lon}`
      : null,
    fetcher,
  );

  async function generateItinerary() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          destinationHint,
          travelers: 2,
          budgetLevel: "medium",
        }),
      });
      const json = await res.json();
      if (json.itinerary) {
        const plan: TripPlan = {
          id: crypto.randomUUID(),
          name: `${destinationHint} Trip`,
          travelers: 2,
          budgetLevel: "medium",
          interests: interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          constraints: [],
          destinations: json.itinerary.destinations ?? [],
          estimatedCostUSD: json.itinerary.estimatedCostUSD,
          days: json.itinerary.days ?? [],
        };
        upsertPlan(plan);
        try {
          await fetch("/api/plans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(plan),
          });
        } catch {}
      }
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    if (!activePlan) setShowOnboarding(true);
  }, [activePlan]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {showOnboarding && plans.length === 0 ? (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      ) : (
        <Fragment>
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1">
              <MapView center={mapCenter} markers={mapMarkers} />
            </div>
            <div className="w-full md:w-80 space-y-3">
              <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-zinc-900">
                <div className="font-semibold mb-2">Smart Itinerary</div>
                <label className="text-sm block mb-1">Destination hint</label>
                <Input
                  value={destinationHint}
                  onChange={(e) => {
                    setDestinationHint(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && destinationHint.trim()) {
                      // Try geocoding the hint using places text search to center map
                      fetch(
                        `/api/places?q=${encodeURIComponent(
                          destinationHint,
                        )}&provider=google`,
                      )
                        .then((r) => r.json())
                        .then((d) => {
                          const first = d?.results?.[0];
                          const loc = first?.geometry?.location;
                          if (loc) {
                            setMapTo({ lat: loc.lat, lon: loc.lng }, [
                              {
                                id: first.place_id,
                                lat: loc.lat,
                                lon: loc.lng,
                                title: first.name,
                              },
                            ]);
                          }
                        });
                    }
                  }}
                />
                <label className="text-sm block mt-3 mb-1">Interests</label>
                <Input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                />
                <Button
                  className="mt-3 w-full"
                  onClick={generateItinerary}
                  disabled={isGenerating}
                >
                  {isGenerating ? <Loader label="Generating" /> : "Generate"}
                </Button>
              </div>

              <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-zinc-900">
                <div className="font-semibold mb-2">History</div>
                <HistoryList />
              </div>

              {activePlan && (
                <LocationCard
                  title={activePlan.name}
                  subtitle={activePlan.destinations?.join(", ")}
                  description={`Estimated cost: $${
                    activePlan.estimatedCostUSD ?? "—"
                  }`}
                  footer={
                    <WeatherBadge
                      tempC={weather?.list?.[0]?.main?.temp}
                      summary={weather?.list?.[0]?.weather?.[0]?.main}
                    />
                  }
                  onClick={() => setActivePlan(activePlan.id)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900">
                <div className="font-semibold mb-2">Explore</div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search places (e.g. museums, ramen, parks)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <ExploreGrid query={searchQuery} />
                </div>
              </div>
              {activePlan ? (
                <div className="rounded-xl border p-4 bg-white dark:bg-zinc-900">
                  <div className="font-semibold mb-2">Timeline</div>
                  <Timeline plan={activePlan} />
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-10">
                  Generate an itinerary to see the timeline.
                </div>
              )}
            </div>
            <div className="lg:col-span-1" />
          </div>

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
        </Fragment>
      )}
    </div>
  );
}
