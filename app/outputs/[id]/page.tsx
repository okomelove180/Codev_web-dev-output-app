import React from "react";
import { getOutputById } from "@/lib/db";
// import { getRelatedQiitaArticles } from "@/lib/qiita";
import { notFound } from "next/navigation";
import Link from "next/link";

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

      <h2>関連リンク</h2>
      <h3>公式ドキュメント</h3>
      <ul>
        {output.relatedLinks
          .filter((link) => link.isOfficial)
          .map((link) => (
            <li key={link.id}>
              <h4>{link.siteName}</h4>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.url}
              </a>
              <p>{link.summary}</p>
            </li>
          ))}
      </ul>

      <h3>Qiita記事/その他</h3>
      <ul>
        {output.relatedLinks
          .filter((link) => !link.isOfficial)
          .map((link) => (
            <li key={link.id}>
              <h4>{link.siteName}</h4>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.url}
              </a>
              <p>{link.summary}</p>
              <p>いいね数: {link.likes_count}</p>
            </li>
          ))}
      </ul>

      <p>作成日時: {new Date(output.createdAt).toLocaleString()}</p>
      <Link href="/outputs">アウトプット一覧</Link>
    </div>
  );
}
