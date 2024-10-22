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

    // デバッグ情報の追加
    console.log('Received audio file:', {
      type: audioFile.type,
      size: audioFile.size
    });

    // ファイルの内容を確認
    const arrayBuffer = await audioFile.arrayBuffer();
    console.log('File content length:', arrayBuffer.byteLength);

    const transcription = await transcribeAudio(audioFile);
    return NextResponse.json({ text: transcription, language: language });
  } catch (error) {
    console.error("Error in transcribe API:", error);
    return NextResponse.json(
      { 
        error: "Failed to transcribe output",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}