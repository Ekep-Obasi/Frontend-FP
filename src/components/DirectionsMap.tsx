"use client";

import {
  GoogleMap,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

type LatLon = { lat: number; lon: number };

type DirectionsMapProps = {
  points: Array<{ id: string; position: LatLon; title?: string }>;
  travelMode?: google.maps.TravelMode;
};

export default function DirectionsMap({
  points,
  travelMode = google.maps.TravelMode.DRIVING,
}: DirectionsMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useLoadScript({
    id: "google-maps",
    googleMapsApiKey: apiKey || "",
    libraries: ["places"],
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const center = useMemo(() => {
    const first = points[0]?.position;
    return first ? { lat: first.lat, lng: first.lon } : { lat: 0, lng: 0 };
  }, [points]);

  useEffect(() => {
    if (!isLoaded || points.length < 2) return;
    const origin = { lat: points[0].position.lat, lng: points[0].position.lon };
    const destination = {
      lat: points[points.length - 1].position.lat,
      lng: points[points.length - 1].position.lon,
    };
    const waypoints: google.maps.DirectionsWaypoint[] = points
      .slice(1, -1)
      .map((p) => ({ location: { lat: p.position.lat, lng: p.position.lon } }));
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        waypoints,
        travelMode,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          setDirections(null);
        }
      },
    );
  }, [isLoaded, points, travelMode]);

  if (!apiKey) {
    return (
      <div className="w-full h-[420px] rounded-xl overflow-hidden grid place-items-center border">
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={12}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {directions ? (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: false }}
            />
          ) : null}
        </GoogleMap>
      ) : (
        <div className="w-full h-full grid place-items-center text-sm text-zinc-500">
          Loading map…
        </div>
      )}
    </div>
  );
}
