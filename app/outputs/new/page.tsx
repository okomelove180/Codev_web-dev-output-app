"use client";

import React, { useState } from "react";
import AudioRecorder from "@/components/AudioRecorder";

const NewOutputPage: React.FC = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const data = await response.json();
      setTranscription(data.text);
    } catch (error) {
      console.error("Error during transcription:", error);
      // エラーハンドリングをここに追加（例：ユーザーへの通知）
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div>
      <h1>新規アウトプット</h1>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      {isTranscribing && <p>文字起こし中...</p>}
      {transcription && (
        <div>
          <h2>文字起こし結果:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default NewOutputPage;
