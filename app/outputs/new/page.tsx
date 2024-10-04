"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AudioRecorder from "@/components/AudioRecorder";
import { saveOutput } from "@/lib/db";

const NewOutputPage: React.FC = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
    }
  }, [session, router]);

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!session?.user) {
      console.error("User not authenticated");
      router.push("/login");
      return;
    }

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

      // Save the transcription using the new API route
      const saveResponse = await fetch("/api/outputs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: data.text }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save output");
      }

      router.push("/outputs");
    } catch (error) {
      console.error("Error during transcription or saving:", error);
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
