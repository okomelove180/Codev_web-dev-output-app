import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/whisper";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const language = formData.get("language") as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    const transcription = await transcribeAudio(audioFile);

    return NextResponse.json({ text: transcription, language: language });
  } catch (error) {
    console.error("Error in transcribe API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}