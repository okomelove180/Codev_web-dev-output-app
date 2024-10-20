import '@/app/globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { Providers } from "@/components/providers"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth-options";
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Web Developer&apos;s Output App",
  description: "Record and analyze your web development learnings",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navigation serverSession={session ?? undefined} />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
