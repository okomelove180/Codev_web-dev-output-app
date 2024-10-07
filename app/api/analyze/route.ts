import { NextRequest, NextResponse } from "next/server";
import { analyzeAndCorrectWithGPT } from "@/lib/gptAnalysis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid content provided" },
        { status: 400 }
      );
    }

    const analysisResult = await analyzeAndCorrectWithGPT(content);
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      { error: "Failed to analyze output" },
      { status: 500 }
    );
  }
}
