import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OfficialDoc = z.object({
  siteName: z.string(),
  url: z.string(),
  summary: z.string(),
});

const AnalysisResult = z.object({
  correctedText: z.string(),
  analysis: z.string(),
  officialDocs: z.array(OfficialDoc),
});

export async function analyzeAndCorrectWithGPT(content: string) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content:
            "あなたはWeb開発の専門家です。これから与えるテキストは、web開発初心者がweb開発について学んだ内容を、音声認識機能を通じてアウトプットしたものです。与えられたテキストを分析し、音声認識機能の誤認識を修正し、内容を分析し、関連する公式ドキュメントへのリンクを提供してください。分析出力の際は、初心者に教える時のように、まず学習できていることを褒めて、そこから優しい口調で出力してください。",
        },
        {
          role: "user",
          content: `以下のWeb開発に関連するテキストを分析してください。: \n\n${content}\n\n
          
          変数の中に格納するものは下記のとおりです\n
          - correctedText: 音声認識の誤認識を修正し、正しい文章にしたもの\n
          - analysis: correctedTextの内容を認識して、アウトプットのキーポイントや技術用語の説明をしたもの\n
          - officialDocs: アウトプットに関連する技術やコンセプトに関する公式ドキュメントへのリンクを最大3つまで提供してください。siteName: サイト名, url:サイトのURL, summary:サイトを見れば何がわかるかを50文字以内で記述。\n
          `,
        },
      ],
      response_format: zodResponseFormat(AnalysisResult, "analysis_result"),
    });

    return completion.choices[0].message.parsed;
  } catch (error) {
    console.error("GPTでの分析中にエラーが発生しました:", error);
    throw new Error("出力の分析と修正に失敗しました");
  }
}
