"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  "HTML",
  "CSS",
  "Ruby",
  "Ruby on Rails",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Java",
  "Python",
  "AWS"
];

interface LanguageSelectProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  onLanguageChange,
}) => {
  return (
    <Select onValueChange={onLanguageChange}>
      <SelectTrigger>
        <SelectValue placeholder="勉強中の言語orフレームワークを選択" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
