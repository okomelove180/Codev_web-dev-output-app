import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth-options";
import LandingPage from "@/components/LandingPage"
import { redirect } from "next/navigation";


export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <LandingPage />
  }

  // ログインしている場合はリダイレクト
  redirect("/home");
}
