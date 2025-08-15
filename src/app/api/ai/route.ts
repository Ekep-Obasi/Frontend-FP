import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const RequestSchema = z.object({
  interests: z.array(z.string()).default([]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  homeAirport: z.string().optional(),
  budgetLevel: z.enum(["low", "medium", "high"]).optional(),
  travelers: z.number().int().positive().default(1),
  constraints: z.array(z.string()).default([]),
  destinationHint: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a travel planner. Create a JSON itinerary with fields: days[ { date, summary, items: [ { time, title, description, placeQuery, type } ] } ], overallTips, estimatedCostUSD (number), destinations (array of strings). Consider: interests=${parsed.data.interests.join(", ")}, constraints=${parsed.data.constraints.join(", ")}, budget=${parsed.data.budgetLevel ?? "medium"}, travelers=${parsed.data.travelers}, destinationHint=${parsed.data.destinationHint ?? ""}, start=${parsed.data.startDate ?? ""}, end=${parsed.data.endDate ?? ""}. Keep it concise and realistic.`;

    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    const text = result.response.text();

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return NextResponse.json({ error: "AI did not return JSON", raw: text }, { status: 502 });
    }
    const jsonStr = text.slice(jsonStart, jsonEnd + 1);
    const itinerary = JSON.parse(jsonStr);

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error("/api/ai error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


