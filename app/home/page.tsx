import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth-options";
import HomePage from "@/components/HomePage"
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/");
  }

  return <HomePage />
}