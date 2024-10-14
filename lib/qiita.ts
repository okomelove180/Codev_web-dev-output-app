import axios from "axios";

interface QiitaArticle {
  title: string;
  url: string;
  created_at: string;
  user: {
    name: string;
  };
}

export async function getRelatedQiitaArticles(
  keyword: string
): Promise<QiitaArticle[]> {
  try {
    const response = await axios.get(
      `https://qiita.com/api/v2/items?query=${encodeURIComponent(
        keyword
      )}&per_page=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QIITA_ACCESS_TOKEN}`,
        },
      }
    );

    return response.data as QiitaArticle[];
  } catch (error) {
    console.error("Qiita記事の取得中にエラーが発生しました:", error);
    throw new Error("Qiita記事の取得に失敗しました");
  }
}
