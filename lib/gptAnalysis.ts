import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisResult {
  correctedText: string;
  analysis: string;
  officialDocs: string[];
}

export async function analyzeAndCorrectWithGPT(
  content: string
): Promise<AnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in web development and you will listen student's output about web developments. Analyze the given text, correct technical errors, analyze the content, and provide links to relevant official documentation. Output should be in Japanese.",
        },
        {
          role: "user",
          content: `Analyze the following outputs related to web development. \n\n${content}\n\n1. Correct any technical errors or misconceptions and provide corrected text. \n2. Analyze the output and briefly describe key concepts and techniques.\n3.Provide up to three (3) links to official documentation related to the technology or concept being mentioned. `,
        },
      ],
      max_tokens: 700, //messages: 150tokens
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error("No result from GPT");

    // 結果をパースして構造化データに変換
    const [correctedText, analysis, docsSection] = result.split("\n\n");
    const officialDocs = docsSection
      .split("\n")
      .filter((line) => line.startsWith("http"));

    return {
      correctedText: correctedText.replace("1. ", ""),
      analysis: analysis.replace("2. ", ""),
      officialDocs,
    };
  } catch (error) {
    console.error("Error analyzing with GPT:", error);
    throw new Error("Failed to analyze and correct output");
  }
}
