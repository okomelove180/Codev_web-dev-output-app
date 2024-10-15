import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";
import LandingPage from "@/components/LandingPage"
import HomePage from "@/components/HomePage"
import { redirect } from "next/navigation";


export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <LandingPage />
  }

  // ログインしている場合はリダイレクト
  redirect("/home");
}
