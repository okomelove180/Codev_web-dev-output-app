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

    return response.data;
  } catch (error) {
    console.error("Error fetching Qiita articles:", error);
    throw new Error("Failed to fetch Qiita articles");
  }
}
