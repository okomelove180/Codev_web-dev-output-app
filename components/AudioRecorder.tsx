"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  isDisabled: boolean,
}

const MAX_RECORDING_TIME = 60; // 60秒の最大録音時間

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  isDisabled,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleRecording = () => {
    if (isDisabled) return;
    setIsRecording(!isRecording);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // iOSかどうかを確認
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      // 対応フォーマットの確認とMediaRecorderの設定
      let mimeType = 'audio/webm';
      if (isIOS) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/m4a')) {
          mimeType = 'audio/m4a';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        }
      }

      // MediaRecorderのオプション設定
      const options = {
        mimeType: mimeType,
        audioBitsPerSecond: 128000
      };

      console.log('Using MIME type:', mimeType); // デバッグ用

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log('Recorded chunk type:', event.data.type); // デバッグ用
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log('Final blob type:', blob.type); // デバッグ用
        console.log('Final blob size:', blob.size); // デバッグ用
        onRecordingComplete(blob);
        chunksRef.current = [];
      };

      // 1秒ごとにデータを取得するように設定
      mediaRecorderRef.current.start(1000);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prevTime + 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "録音エラー",
        description: "録音の開始に失敗しました。デバイスの設定を確認してください。",
        variant: "destructive",
      });
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setRecordingTime(0);
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return (
    <div>
      <Button
        size="lg"
        className="w-full h-32 text-2xl"
        onClick={handleToggleRecording}
        disabled={isDisabled}
      >
        {isRecording ? "録音停止" : "録音開始"}
      </Button>
      {isRecording && (
        <div className="mt-2 text-center">
          録音時間: {recordingTime}秒 / {MAX_RECORDING_TIME}秒
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;