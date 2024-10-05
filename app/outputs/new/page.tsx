"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AudioRecorder from "@/components/AudioRecorder";

const NewOutputPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!session?.user) {
      console.error("User not authenticated");
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      // 音声認識
      const transcribeResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed");
      }

      const { text: transcription } = await transcribeResponse.json();

      // GPTによる分析と修正
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: transcription }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Analysis failed");
      }

      const analysisResult = await analyzeResponse.json();

      // 結果をデータベースに保存
      const saveResponse = await fetch("/api/outputs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalContent: transcription,
          correctedContent: analysisResult.correctedText,
          analysis: analysisResult.analysis,
          officialDocs: analysisResult.officialDocs,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save output");
      }

      const { id } = await saveResponse.json();

      // アウトプット詳細ページにリダイレクト
      router.push(`/outputs/${id}`);
    } catch (error) {
      console.error("Error during processing:", error);
      // エラーハンドリングをここに追加（例：ユーザーへの通知）
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h1>新規アウトプット</h1>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      {isProcessing && <p>処理中...</p>}
    </div>
  );
};

export default NewOutputPage;
