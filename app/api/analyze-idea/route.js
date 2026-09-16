import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      idea,
      category,
      location,
      budget,
    } = body;

    // Basic validation
    if (!idea || !category || !location || !budget) {
      return NextResponse.json(
        {
          error: "Please provide idea, category, location and budget.",
        },
        { status: 400 }
      );
    }

  const prompt = `
You are the AI advisory engine for Rural Advisor, an Indian rural
micro-business advisory application.

Analyze the following proposed business:

Business owner: ${name || "Not provided"}
Business idea: ${idea}
Business category: ${category}
Location: ${location}
Available budget: ₹${budget}

Your job is to evaluate the business idea realistically.

Consider:

1. Likely local demand
2. Customer need
3. Competition
4. Starting investment
5. Whether the stated budget is realistic
6. Operational difficulty
7. Main business risks
8. Potential for sustainable income
9. Suitability for a rural/semi-rural Indian market
10. Potential Indian government funding/support schemes

IMPORTANT:
- Do not invent facts about the specific village or district.
- If local market information is unavailable, say that the assessment
  is an estimate based on the business category and location.
- Do not guarantee loan approval or government-scheme eligibility.
- Government scheme suggestions must be treated as possible matches,
  not confirmed eligibility.
- Give practical reasoning rather than generic motivational statements.

CONFIDENCE SCORING:
Along with your analysis, assess how confident you are in this analysis
based on the DATA actually available to you — not how promising the idea
sounds.

For each of the following inputs, classify what kind of basis you had:
- Category/price norms for this type of business
- Competition level in this location
- Government scheme eligibility fit
- Local demand for this specific idea in this specific location

Classify each as exactly one of:
- "verified": stated directly by the user or a fact you can state with certainty
- "data-derived": reasonably inferred from category/location norms you have general knowledge of
- "estimated": no reliable basis beyond generic assumption (this applies to almost
  all hyper-local demand claims, since you have no real-time local market data)

Calculate an overall confidence_score (0-100) that is LOWER when more factors
are "estimated," especially local demand. A high viability score does NOT
justify a high confidence score — they measure different things.

Score the idea from 0 to 100.

Use approximately this interpretation:

0-39   = High risk
40-59  = Needs significant improvement
60-74  = Moderately promising
75-89  = Promising
90-100 = Highly promising

Return the result strictly in the requested JSON format.
`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: prompt,

      text: {
        format: {
          type: "json_schema",
          name: "business_advisory_result",
          strict: true,
       schema: {
  type: "object",
  properties: {
    score: { type: "integer", minimum: 0, maximum: 100 },
    verdict: { type: "string" },
    summary: { type: "string" },
    strengths: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    recommendations: { type: "array", items: { type: "string" } },
    scheme: {
      type: "object",
      properties: {
        name: { type: "string" },
        reason: { type: "string" },
        eligibilityNote: { type: "string" },
      },
      required: ["name", "reason", "eligibilityNote"],
      additionalProperties: false,
    },
    confidence_score: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    confidence_factors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          type: {
            type: "string",
            enum: ["verified", "data-derived", "estimated"],
          },
        },
        required: ["label", "type"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "score",
    "verdict",
    "summary",
    "strengths",
    "risks",
    "recommendations",
    "scheme",
    "confidence_score",
    "confidence_factors",
  ],
  additionalProperties: false,
},
        },
      },
    });

    const result = JSON.parse(response.output_text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI advisory error:", error);

    return NextResponse.json(
      {
        error: "Unable to analyze the business idea right now.",
      },
      { status: 500 }
    );
  }
}