import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LanguageSelect from "@/components/LanguageSelect";
import AudioRecorder from "@/components/AudioRecorder";

interface NewOutputFormProps {
  selectedLanguage: string;
  processingStage: string | null;
  onLanguageChange: (language: string) => void;
  onRecordingComplete: (audioBlob: Blob) => Promise<void>;
}

const NewOutputForm: React.FC<NewOutputFormProps> = ({
  selectedLanguage,
  processingStage,
  onLanguageChange,
  onRecordingComplete,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>新規アウトプット</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LanguageSelect onLanguageChange={onLanguageChange} />
          <AudioRecorder
            onRecordingComplete={onRecordingComplete}
            isDisabled={!selectedLanguage || !!processingStage}
          />
          {processingStage && <p>{processingStage}...</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewOutputForm;

