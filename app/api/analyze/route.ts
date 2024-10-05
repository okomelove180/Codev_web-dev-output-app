import { NextRequest, NextResponse } from "next/server";
import { analyzeAndCorrectWithGPT } from "@/lib/gptAnalysis";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
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
