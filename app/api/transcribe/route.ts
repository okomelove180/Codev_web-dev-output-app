import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/whisper";
import OpenAI from "openai";

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
      size: audioFile.size,
      name: audioFile.name
    });

    // Content-Typeが正しく設定されていることを確認
    if (!audioFile.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: "Invalid content type. Must be audio/*" },
        { status: 400 }
      );
    }

    // ファイルの内容を確認
    const arrayBuffer = await audioFile.arrayBuffer();
    console.log('File content length:', arrayBuffer.byteLength);

    const transcription = await transcribeAudio(audioFile);
    
    if (!transcription) {
      throw new Error("Transcription result is empty");
    }

    return NextResponse.json({ text: transcription, language: language });
  } catch (error) {
    console.error("Error in transcribe API:", error);
    // エラーメッセージをより詳細に
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof OpenAI.APIError ? {
      status: error.status,
      code: error.code,
      type: error.type
    } : {};
    return NextResponse.json(
      { 
        error: "Failed to transcribe audio",
        message: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}