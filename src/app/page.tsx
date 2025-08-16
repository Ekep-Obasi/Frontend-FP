"use client";

import { useState } from "react";
import { useTripStore, TripPlan } from "~/store/tripStore";
import Loader from "~/components/Loader";
import ExploreGrid from "~/components/ExploreGrid";
import PlaceDetails from "~/components/PlaceDetails";
import DestinationAutocomplete from "~/components/DestinationAutocomplete";
import InterestsSelector from "~/components/InterestsSelector";
import AiGeneratingOverlay from "~/components/AiGeneratingOverlay";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { useUIStore } from "~/store/uiStore";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { upsertPlan } = useTripStore();
  const [interests, setInterests] = useState<string[]>([
    "food",
    "museums",
    "nature",
  ]);
  const [destinationHint, setDestinationHint] = useState<string>("");
  const [destinationCoords, setDestinationCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const placeModalOpen = useUIStore((s) => s.placeModalOpen);
  const selectedPlaceId = useUIStore((s) => s.selectedPlaceId);
  const selectedQuery = useUIStore((s) => s.selectedQuery);
  const mapCenter = useUIStore((s) => s.mapCenter);
  const closePlace = useUIStore((s) => s.closePlace);

  const router = useRouter();

  async function generateItinerary() {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
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
          interests,
          constraints: [],
          destinations: json.itinerary.destinations ?? [],
          estimatedCostUSD: json.itinerary.estimatedCostUSD,
          days: json.itinerary.days ?? [],
        };
        upsertPlan(plan);
        // Immediately navigate to the itinerary page using the client id
        router.push(`/itinerary/${plan.id}`);
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

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-8 md:py-12 space-y-12 md:space-y-14">
      <div className="text-center space-y-5 md:space-y-6 lg:py-8 py-16">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Plan your next adventure
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Tell Tripee where you&apos;re going and what you love. We&apos;ll
          craft the perfect itinerary.
        </p>
        <div className="max-w-2xl mx-auto">
          <DestinationAutocomplete
            onPlaceSelected={({ name, lat, lon }) => {
              setDestinationHint(name);
              setDestinationCoords({ lat, lon });
            }}
          />
        </div>

        {destinationHint ? (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-left font-medium">Pick your interests</div>
            <InterestsSelector onChange={(sel) => setInterests(sel)} />
            <Button
              className="mt-2 w-full h-11 text-base"
              onClick={generateItinerary}
              disabled={isGenerating || !destinationHint}
            >
              {isGenerating ? (
                <Loader label="Generating" />
              ) : (
                "Generate itinerary"
              )}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="space-y-8">
        <div className="rounded-2xl p-6 bg-background">
          <div className="mt-2">
            <ExploreGrid
              query={"popular sights"}
              location={destinationCoords ?? mapCenter}
              hero
            />
          </div>
        </div>
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

      <AiGeneratingOverlay visible={isGenerating} />
    </div>
  );
}
