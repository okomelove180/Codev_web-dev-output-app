import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getOutputs } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import OutputListReview from "@/components/OutputListReview";

export default async function OutputsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/login");
  }

  const outputs = await getOutputs(session.user.id);

  return (
    <OutputListReview outputs={outputs} />
    // <div>
    //   <h1>Your Outputs</h1>
    //   <ul>
    //     {outputs.map((output) => (
    //       <li key={output.id}>
    //         <Link href={`/outputs/${output.id}`}>
    //           <div>{output.title}</div>
    //           <div>{output.correctedContent.substring(0, 50)}...</div>
    //         </Link>
    //         <span> - {new Date(output.createdAt).toLocaleDateString()}</span>
    //       </li>
    //     ))}
    //   </ul>
    //   <Link href="/outputs/new">Create New Output</Link>
    // </div>
  );
}
