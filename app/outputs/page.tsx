import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOutputs } from "@/lib/db";
import Link from "next/link";

export default async function OutputsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Please log in to view your outputs.</div>;
  }

  const outputs = await getOutputs(session.user.id);

  return (
    <div>
      <h1>Your Outputs</h1>
      <ul>
        {outputs.map((output) => (
          <li key={output.id}>
            <Link href={`/outputs/${output.id}`}>
              {output.content.substring(0, 50)}...
            </Link>
            <span> - {new Date(output.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
      <Link href="/outputs/new">Create New Output</Link>
    </div>
  );
}
