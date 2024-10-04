import React from "react";
import { getOutputById } from "@/lib/db";
import { notFound } from "next/navigation";

interface OutputPageProps {
  params: { id: string };
}

export default async function OutputPage({ params }: OutputPageProps) {
  const output = await getOutputById(params.id);

  if (!output) {
    notFound();
  }

  return (
    <div>
      <h1>Output</h1>
      <p>{output.content}</p>
      <p>Created at: {new Date(output.createdAt).toLocaleString()}</p>
    </div>
  );
}
