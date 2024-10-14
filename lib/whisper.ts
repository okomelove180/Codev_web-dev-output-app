import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // タイムアウトを30秒に設定
});

export async function transcribeAudio(audioFile: File): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "ja",
    });

    return transcription.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API error:", error.status, error.message);
      throw new Error(`OpenAI API error: ${error.message}`);
    } else {
      throw new Error("Failed to transcribe audio: " + (error as Error).message);
    }
  }
}