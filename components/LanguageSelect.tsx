import React from "react";

const languages = [
  "HTML",
  "CSS",
  "Ruby",
  "Rails",
  "JavaScript",
  "TypeScript",
  "Next.js",
];

interface LanguageSelectProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  onLanguageChange,
}) => {
  return (
    <select onChange={(e) => onLanguageChange(e.target.value)}>
      <option value="">勉強中の言語orフレームワークを選択</option>
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;
