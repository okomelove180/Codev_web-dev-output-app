import React from "react";
import { getOutputById } from "@/lib/db";
import OutputDetailPreview from "@/components/OutputDetailPreview";
import { notFound } from "next/navigation";
import Link from "next/link";

interface OutputPageProps {
  params: { id: string };
}

export default async function OutputPage({ params }: OutputPageProps) {
  const output = await getOutputById(params.id);

  if (!output) {
    return <div>出力が見つかりません</div>
  }

  // const qiitaArticles = await getRelatedQiitaArticles(output.correctedContent.substring(0, 100));

  return (
    <OutputDetailPreview output={output} />
  );
}
