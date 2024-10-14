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
  title: z.string(),
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
  initialKeywords: string[],
  language: string,
  limit: number = 2
): Promise<QiitaArticleLinkType[]> {
  async function searchQiita(
    keywords: string[],
    useTag: boolean
  ): Promise<QiitaArticle[]> {
    const query = useTag
      ? `title:${keywords.join("+")} tag:${language}`
      : `title:${keywords.join("+")}`;
    console.log(`Searching with query: ${query}`);

    const response = await axios.get<QiitaArticle[]>(
      `https://qiita.com/api/v2/items`,
      {
        params: {
          query: query,
          per_page: 20,
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${process.env.QIITA_ACCESS_TOKEN}`,
        },
      }
    );

    console.log(`Found ${response.data.length} articles`);
    return response.data;
  }

  try {
    const keywords = [...initialKeywords];
    let articles: QiitaArticle[] = [];

    // タグ付きで検索
    articles = await searchQiita(keywords, true);

    // タグなしで検索
    if (articles.length === 0) {
      articles = await searchQiita(keywords, false);
    }

    // キーワードを減らしながら検索
    while (articles.length === 0 && keywords.length > 1) {
      keywords.pop();
      console.log(`Reducing keywords to: ${keywords.join(", ")}`);
      articles = await searchQiita(keywords, false);
    }

    if (articles.length === 0 && keywords.length === 0) {
      console.log("No articles found after all attempts");
      return [];
    }

    return articles
      .sort(
        (a: { likes_count: number }, b: { likes_count: number }) =>
          b.likes_count - a.likes_count
      )
      .slice(0, limit)
      .map((article: QiitaArticle) => ({
        siteName: article.title,
        url: article.url,
        summary:
          article.body.length > 100
            ? article.body.substring(0, 97) + "..."
            : article.body,
        likes_count: article.likes_count,
        isOfficial: false,
      }));
  } catch (error) {
    console.error("Error fetching Qiita articles:", error);
    return [];
  }
}

export async function analyzeAndCorrectWithGPT(
  content: string,
  language: string
) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `
            You are a web development expert. Analyze the text provided by a web development beginner in Japan, which has been transcribed through speech recognition.
            Your task is to correct any speech recognition errors, analyze the content, and provide relevant official documentation links shown below "Resources for Documentation Links". Check the link whether it has expired or not.
            When giving feedback, praise what the beginner has learned and explain the analysis gently.
            - **Resources for Documentation Links:**
              - HTML, CSS, JavaScript: MDN web docs (https://developer.mozilla.org/ja/)
              - Ruby: Ruby公式リファレンス (https://docs.ruby-lang.org/ja/3.3/doc/)
              - Rails: Ruby on Railsガイド (https://railsguides.jp/)
              - TypeScript: TypeScript Documentation (https://www.typescriptlang.org/docs/)
              - Next.js: 公式ドキュメント (https://nextjs.org/docs/)

            # Steps

            1. **Correct Speech Recognition Errors:** 
              - Review the provided web development beginner's outputs and correct any errors caused by speech recognition inaccuracies.
              - Put into ”correctedText”.
            
            2. **Analyze Content:**
              - Extract key points and provide explanations for technical terms within the corrected text.
              - Highlight the learner's achievements and provide gentle explanations and any Tips for the beginner.
              - Put into "analysis"

            3. **Provide Related Keywords and Links:**
              - Identify 3 keywords from your "analysis" results that can be used to search related documents using the QiitaAPI.
              - Provide one related official documentation links containing:
                - siteName: The name of the site.
                - url: The URL of the site. Suggest a link to the official ${language}'s reference. Actively suggest its child pages. Do not put on the expired link.
                - summary: A brief summary of the content (within 100 characters).
                - isOfficial: Indicate if it's an official document.

            # Output Format

              json
              {
                "title": "Make the title of this output based on your correctedText",
                "correctedText": "Corrected version of the text in Japanese",
                "analysis": "Explanation of key points and terms from the corrected text in Japanese",
                "keywords": ["keyword1", "keyword2"], // pick up from "analysis"
                "RelatedLink": [
                  {
                    "siteName": "Site Name 1",
                    "url": "https://...",
                    "summary": "Brief summary",
                    "isOfficial": true
                  }
                ]
              }
            `,
        },
        {
          role: "user",
          content: `\n\n${content}\n\n`,
        },
      ],
      response_format: zodResponseFormat(AnalysisResult, "analysis_result"),
      max_tokens: 1000,
    });

    const result = completion.choices[0].message.parsed;

    if (!result) {
      throw new Error("GPTの分析結果が空です");
    }

    console.log("GPT Response:", JSON.stringify(result, null, 2));

    // Qiita記事の取得
    const qiitaArticles = await getQiitaArticles(result.keywords, language);
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
