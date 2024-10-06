import React from "react";
import { getOutputById } from "@/lib/db";
// import { getRelatedQiitaArticles } from "@/lib/qiita";
import { notFound } from "next/navigation";

interface OutputPageProps {
  params: { id: string };
}

export default async function OutputPage({ params }: OutputPageProps) {
  const output = await getOutputById(params.id);

  if (!output) {
    notFound();
  }

  // const qiitaArticles = await getRelatedQiitaArticles(output.correctedContent.substring(0, 100));

  return (
    <div>
      <h1>アウトプット詳細</h1>

      <h2>元のテキスト</h2>
      <p>{output.originalContent}</p>

      <h2>修正されたテキスト</h2>
      <p>{output.correctedContent}</p>

      <h2>分析</h2>
      <p>{output.analysis}</p>

      <h2>関連する公式ドキュメント</h2>
      <ul>
        {output.officialDocs.map((doc, index) => (
          <li key={index}>
            <a href={doc} target="_blank" rel="noopener noreferrer">
              {doc}
            </a>
          </li>
        ))}
      </ul>

      {/* <h2>関連するQiita記事</h2>
      <ul>
        {qiitaArticles.map((article) => (
          <li key={article.url}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
            <span> by {article.user.name} ({new Date(article.created_at).toLocaleDateString()})</span>
          </li>
        ))}
      </ul> */}

      <p>作成日時: {new Date(output.createdAt).toLocaleString()}</p>
    </div>
  );
}
