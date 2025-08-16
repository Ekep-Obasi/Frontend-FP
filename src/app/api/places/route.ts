import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const location = searchParams.get("location"); // "lat,lng"
  const provider = (searchParams.get("provider") || "google").toLowerCase();

  if (!query && !location) {
    return NextResponse.json(
      { error: "Provide q or location" },
      { status: 400 },
    );
  }

  try {
    if (provider === "mapbox") {
      const token = process.env.MAPBOX_ACCESS_TOKEN;
      if (!token) {
        return NextResponse.json(
          { error: "Missing MAPBOX_ACCESS_TOKEN" },
          { status: 500 },
        );
      }
      if (!query) {
        return NextResponse.json(
          { error: "Mapbox provider requires q" },
          { status: 400 },
        );
      }
      const proximity = location
        ? `&proximity=${encodeURIComponent(location)}`
        : "";
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}${proximity}&limit=10`;
      const res = await fetch(url);
      const data = await res.json();
      return NextResponse.json(data);
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_PLACES_API_KEY" },
        { status: 500 },
      );
    }

    const endpoint = query
      ? `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}${location ? `&location=${encodeURIComponent(location)}&radius=3000` : ""}&key=${apiKey}`
      : `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(location ?? "")}&radius=3000&key=${apiKey}`;

    const res = await fetch(endpoint);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("/api/places error", error);
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
