"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AudioRecorder from "@/components/AudioRecorder";
import LanguageSelect from "@/components/LanguageSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const NewOutputClient: React.FC = () => {
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!session?.user?.id) {
      toast({
        title: "認証エラー",
        description: "ログインが必要です。セッションまたはユーザーIDが見つかりません。",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!selectedLanguage) {
      toast({
        title: "言語選択エラー",
        description: "言語を選択してください。",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      // 音声認識
      setProcessingStage("音声認識中");
      const transcribeResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeResponse.ok) {
        const errorData = await transcribeResponse.json();
        throw new Error(`Transcription failed: ${errorData.error}`);
      }

      const { text: transcription } = await transcribeResponse.json();

      // GPTによる分析_修正_提案
      setProcessingStage("分析中");
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: transcription,
          language: selectedLanguage,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Analysis failed");
      }

      const analysisResult = await analyzeResponse.json();

      // 結果をデータベースに保存
      setProcessingStage("保存中");
      const saveResponse = await fetch("/api/outputs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: analysisResult.title,
          originalContent: transcription,
          correctedContent: analysisResult.correctedText,
          analysis: analysisResult.analysis,
          relatedLinks: analysisResult.relatedLinks,
          language: selectedLanguage,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save output");
      }

      const { id } = await saveResponse.json();

      toast({
        title: "処理完了",
        description: "アウトプットが正常に保存されました。",
      });
      router.push(`/outputs/${id}`);
    } catch (error) {
      console.error("Error during processing:", error);
      toast({
        title: "エラー",
        description: `処理中にエラーが発生しました: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setProcessingStage(null);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>新規アウトプット</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LanguageSelect onLanguageChange={handleLanguageChange} />
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            isDisabled={!selectedLanguage || !!processingStage}
          />
          {processingStage && <p>{processingStage}...</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOutputClient;