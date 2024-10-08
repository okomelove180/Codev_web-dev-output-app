import OpenAI from "openai";
import { z } from "zod";
import axios from "axios";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OfficialDocLink = z.object({
  siteName: z.string(),
  url: z.string(),
  summary: z.string(),
  isOfficial: z.literal(true),
});

const QiitaArticleLink = z.object({
  siteName: z.string(),
  url: z.string(),
  summary: z.string(),
  likes_count: z.number(),
  isOfficial: z.literal(false),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RelatedLink = z.union([OfficialDocLink, QiitaArticleLink]);

const AnalysisResult = z.object({
  correctedText: z.string(),
  analysis: z.string(),
  keywords: z.array(z.string()),
  officialDocs: z.array(OfficialDocLink),
});

type QiitaArticleLinkType = z.infer<typeof QiitaArticleLink>;
type RelatedLinkType = z.infer<typeof RelatedLink>;

interface QiitaArticle {
  title: string;
  url: string;
  body: string;
  likes_count: number;
}

async function getQiitaArticles(
  keywords: string[],
  limit: number = 2
): Promise<QiitaArticleLinkType[]> {
  try {
    const query = `contents=${keywords.join(" ")}`;
    console.log("query: ", query);

    const response = await axios.get<QiitaArticle[]>(
      `https://qiita.com/api/v2/items`,
      {
        params: {
          query: query,
          per_page: 50, // より多くの記事を取得
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${process.env.QIITA_ACCESS_TOKEN}`,
        },
      }
    );

    console.log(response.title, response.likes_count);

    // タイトルまたは本文にキーワードを含む記事をフィルタリング
    const filteredArticles = response.data.filter((article) =>
      keywords.some(
        (keyword) =>
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          article.body.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    return filteredArticles
      .sort((a, b) => b.likes_count - a.likes_count)
      .slice(0, limit)
      .map((article: QiitaArticle) => ({
        siteName: article.title,
        url: article.url,
        summary:
          article.body.length > 100
            ? article.title.substring(0, 97) + "..."
            : article.title,
        likes_count: article.likes_count,
        isOfficial: false,
      }));
  } catch (error) {
    console.error("Error fetching Qiita articles:", error);
    return [];
  }
}

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
          - keywords: 分析結果に関連する文書をQiitaAPIで検索するためのキーワードを 2or3件格納\n
          - RelatedLink: 関連するリンク（公式ドキュメント2件）。httpsのみ許可します。各リンクにはsiteName: サイト名、url: URL、summary: 内容の要約（100文字以内）、isOfficial: 公式ドキュメントかどうかの情報を含めてください。\n
          `,
        },
      ],
      response_format: zodResponseFormat(AnalysisResult, "analysis_result"),
      max_tokens: 1500,
    });

    const result = completion.choices[0].message.parsed;

    if (!result) {
      throw new Error("GPTの分析結果が空です");
    }

    console.log("GPT Response:", JSON.stringify(result, null, 2));

    // Qiita記事の取得
    const qiitaArticles = await getQiitaArticles(result.keywords);
    console.log("Qiita Articles: ", qiitaArticles);

    const relatedLinks: RelatedLinkType[] = [
      ...result.officialDocs,
      ...qiitaArticles,
    ];

    return {
      ...result,
      relatedLinks,
    };
  } catch (error) {
    console.error("GPTでの分析中にエラーが発生しました:", error);
    throw new Error("出力の分析と修正に失敗しました");
  }
}
