import { NextRequest, NextResponse } from "next/server";
import { analyzeAndCorrectWithGPT } from "@/lib/gptAnalysis";

export async function POST(request: NextRequest) {
  try {
    const { content, language } = await request.json();

    if (!content || !language) {
      return NextResponse.json(
        { error: "Content and language are required" },
        { status: 400 }
      );
    }

    const analysisResult = await analyzeAndCorrectWithGPT(content, language);
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      { error: "Failed to analyze output" },
      { status: 500 }
    );
  }
}
