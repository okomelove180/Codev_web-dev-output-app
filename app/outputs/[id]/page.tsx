import React from "react";
import { getOutputById } from "@/lib/db";
import OutputDetailPreview from "@/components/OutputDetailPreview";


interface OutputPageProps {
  params: { id: string };
}

export default async function OutputPage({ params }: OutputPageProps) {
  const output = await getOutputById(params.id);

  if (!output) {
    return <div>出力が見つかりません</div>
  }

  return (
    <OutputDetailPreview output={output} />
  );
}
