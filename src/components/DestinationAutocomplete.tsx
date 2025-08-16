"use client";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useRef } from "react";
import { cn } from "~/lib/utils";

type DestinationAutocompleteProps = {
  className?: string;
  placeholder?: string;
  onPlaceSelected: (args: { name: string; lat: number; lon: number }) => void;
};

export default function DestinationAutocomplete({
  className,
  placeholder = "Where are you going?",
  onPlaceSelected,
}: DestinationAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    id: "google-maps",
    googleMapsApiKey: apiKey || "",
    libraries: ["places"],
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!apiKey) {
    return (
      <div className={cn("w-full", className)}>
        <div className="rounded-full border px-5 py-3 text-sm text-muted-foreground">
          Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full relative", className)}>
      {isLoaded ? (
        <Autocomplete
          onLoad={(ac: google.maps.places.Autocomplete) =>
            (autocompleteRef.current = ac)
          }
          onPlaceChanged={() => {
            const ac = autocompleteRef.current;
            if (!ac) return;
            const place = ac.getPlace();
            const name = place.name || place.formatted_address || "";
            const loc = place.geometry?.location;
            if (name && loc) {
              onPlaceSelected({ name, lat: loc.lat(), lon: loc.lng() });
            }
          }}
        >
          <input
            ref={inputRef}
            placeholder={placeholder}
            className="w-full h-14 rounded-full px-6 pr-12 bg-background border focus:outline-none focus:ring-2 focus:ring-primary/40 text-base shadow-sm"
            type="text"
          />
        </Autocomplete>
      ) : (
        <div className="rounded-full border px-5 py-3 text-sm text-muted-foreground">
          Loading…
        </div>
      )}
      {/* Help the PAC container visually attach to the input */}
      <style jsx global>{`
        .pac-container {
          margin-top: 8px;
          border-top-left-radius: var(--radius-xl) !important;
          border-top-right-radius: var(--radius-xl) !important;
          border-bottom-left-radius: var(--radius-xl) !important;
          border-bottom-right-radius: var(--radius-xl) !important;
          z-index: 60 !important;
        }
        .pac-item {
          border-top: 1px solid var(--color-border) !important;
        }
        .pac-item:first-child {
          border-top: none !important;
        }
      `}</style>
    </div>
  );
}
