import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // タイムアウトを30秒に設定
});

export async function transcribeAudio(audioFile: File): Promise<string> {
  try {

    // FileをNodeのReadableStreamに変換
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // OpenAI APIに送信するファイル形式を明示的に指定
    const file = new File([buffer], "audio.mp4", { 
      type: audioFile.type 
    });

    console.log("Sending file to OpenAI:", {
      filename: file.name,
      type: file.type,
      size: file.size
    });
   
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "ja",
    });

    return transcription.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    // エラーの詳細をログに出力
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API error details:", {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type
      });
    }
    throw error;
  }
}