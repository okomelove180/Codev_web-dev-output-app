"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  isDisabled: boolean,
}

const MAX_RECORDING_TIME = 60; // 60秒の最大録音時間

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  isDisabled,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showTimer, setShowTimer] = useState(false);  // 追加: タイマー表示の制御
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

      // 適切なMIMEタイプとファイル拡張子の組み合わせを設定
      let mimeType = 'audio/mp4';
      let fileExtension = '.mp4';

      // iOSの場合の特別な処理
      if (isIOS) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
          fileExtension = '.mp4';
        } else if (MediaRecorder.isTypeSupported('audio/mpeg')) {
          mimeType = 'audio/mpeg';
          fileExtension = '.mp3';
        }
      }

      // MediaRecorderのオプション設定
      const options = {
        mimeType: mimeType,
        audioBitsPerSecond: 16000
      };

      console.log(`Using format: ${mimeType} with extension ${fileExtension}`);

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const finalMimeType = mediaRecorderRef.current?.mimeType || mimeType;
        const blob = new Blob(chunksRef.current, { type: finalMimeType });

        const file = new File([blob], `recording${fileExtension}`, {
          type: finalMimeType,
          lastModified: Date.now()
        });

        console.log('Recording completed:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        onRecordingComplete(file);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start(1000);
      setRecordingTime(0);
      setShowTimer(true);  // 追加: 録音開始時にタイマーを表示

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
      timerRef.current = null;
    }
    setRecordingTime(0);
    setShowTimer(false);  // 追加: 録音停止時にタイマーを非表示
    setIsRecording(false);  // 修正: 録音状態も明示的にfalseに設定
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    // クリーンアップ関数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
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
      {showTimer && (  // 修正: isRecording を showTimer に変更
        <div className="mt-2 text-center">
          録音時間: {recordingTime}秒 / {MAX_RECORDING_TIME}秒
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;