import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { getOutputs } from "@/lib/db";
import { redirect } from "next/navigation";
import OutputListReview from "@/components/OutputListReview";

export default async function OutputsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return redirect("/login");
  }


  const outputs = await getOutputs(session.user.id);
  console.log(outputs)
  
  return <OutputListReview outputs={outputs} />;
}