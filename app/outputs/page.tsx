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
  return <OutputListReview outputs={outputs} />;
}
