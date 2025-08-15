import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref") || searchParams.get("photo_reference");
  const maxwidth = searchParams.get("maxwidth") || "600";
  if (!ref) {
    return new Response(JSON.stringify({ error: "photo_reference required" }), { status: 400 });
  }
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing GOOGLE_PLACES_API_KEY/GOOGLE_MAPS_API_KEY" }), { status: 500 });
  }
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${encodeURIComponent(maxwidth)}&photo_reference=${encodeURIComponent(ref)}&key=${apiKey}`;
  const upstream = await fetch(url);
  if (!upstream.ok || !upstream.body) {
    const txt = await upstream.text();
    return new Response(txt, { status: upstream.status });
  }
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}


