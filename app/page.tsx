import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth";
import LandingPage from "@/components/LandingPage"
import HomePage from "@/components/HomePage"

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <LandingPage />
  }

  return <HomePage />
}
