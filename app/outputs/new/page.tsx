import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import NewOutputClient from "./NewOutputClient";

export default async function NewOutputPage() { 
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <NewOutputClient />;
}
