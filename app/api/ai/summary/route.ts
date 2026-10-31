import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Notice } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const notices: Notice[] = body.notices || [];

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured on the server. Please add your Gemini API key in .env.local to enable real-time AI summaries.",
          isConfigError: true,
        },
        { status: 503 }
      );
    }

    if (!notices || notices.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          headline: "All Quiet on Campus This Week",
          overview: "There are currently no active notices or events scheduled for this period.",
          importantEvents: [],
          examinations: [],
          deadlines: [],
          workshopsAndCompetitions: [],
          actionItems: ["Enjoy your free time or get ahead on upcoming semester coursework!"],
        },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const formattedList = notices.map((n, i) => {
      return `${i + 1}. [${n.category}] ${n.title}
   Details: ${n.description}
   Event Date: ${n.event_date || "N/A"} ${n.event_time ? "at " + n.event_time : ""}
   Venue: ${n.venue || "N/A"}
   Registration/Submission Deadline: ${n.registration_deadline || "N/A"}
   Priority: ${n.priority}`;
    }).join("\n\n");

    const prompt = `You are Campus Pulse AI. Synthesize the following real college notices into a structured weekly campus briefing.
DO NOT invent any dates, events, or facts not present in this list. Use the exact dates provided.

NOTICES LIST:
${formattedList}

Respond strictly with valid JSON with this exact structure:
{
  "headline": "A concise headline capturing the week's theme",
  "overview": "A 2-sentence executive summary of academic activities and major deadlines this week",
  "importantEvents": [
    { "title": "Event Name", "date": "Date string", "time": "Time string", "venue": "Location" }
  ],
  "examinations": [
    { "title": "Exam Name", "date": "Date string", "details": "Key details" }
  ],
  "deadlines": [
    { "title": "Assignment or Fee deadline", "deadline": "Date string", "urgent": true }
  ],
  "workshopsAndCompetitions": [
    { "title": "Workshop/Competition Name", "date": "Date string", "venue": "Location" }
  ],
  "actionItems": [
    "Clear, bulleted action items students must complete this week"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || "";

    let cleanJson = responseText;
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/i, "").replace(/\s*```$/i, "");
    }

    const parsed = JSON.parse(cleanJson);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("AI Summary Generation Error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to generate weekly summary.",
        details: err.toString(),
      },
      { status: 500 }
    );
  }
}
