import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      businessIdea,
      category,
      location,
      budget,
      latitude,
      longitude,
    } = body;

    if (!businessIdea || !category || !location || !budget) {
      return NextResponse.json(
        {
          error:
            "Business idea, category, location and budget are required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are the Hyper-Local Business Intelligence module of FINFEASIBILITY,
an AI decision-support system for rural and small-town micro-entrepreneurs.

Analyze the following proposed business:

Business idea:
${businessIdea}

Business category:
${category}

Location:
${location}

Available budget:
₹${budget}

Coordinates:
${latitude ?? "Not provided"}, ${longitude ?? "Not provided"}

IMPORTANT:
- Do NOT invent exact local statistics.
- Do NOT claim that you have verified the number of competitors,
  customers, prices or population unless actual data was provided.
- Clearly distinguish between evidence and an AI-based assessment.
- Give practical, understandable advice for a micro-entrepreneur.
- The analysis is advisory, not a guarantee.

Return ONLY valid JSON with this structure:

{
  "marketScore": 0,
  "demandScore": 0,
  "competitionScore": 0,
  "marketGapScore": 0,
  "pricingScore": 0,
  "growthScore": 0,
  "marketLevel": "Strong",
  "summary": "",
  "demand": "",
  "competition": "",
  "marketGap": "",
  "pricing": "",
  "growth": "",
  "opportunity": "",
  "risks": [],
  "nextSteps": []
}

Scoring:
0-39 = Low
40-59 = Moderate
60-79 = Good
80-100 = Strong

For competitionScore, a HIGH score means HIGH competition.
For the other scores, a HIGH score means stronger opportunity.
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    const text = response.output_text;

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      console.error("OpenAI returned invalid JSON:", text);

      return NextResponse.json(
        {
          error: "AI returned an invalid analysis format.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Hyper-local analysis error:", error);

    return NextResponse.json(
      {
        error: "Unable to perform hyper-local analysis.",
      },
      { status: 500 }
    );
  }
}