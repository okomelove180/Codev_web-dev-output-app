import '@/app/globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { Providers } from "@/components/providers"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth-options";
import { Toaster } from "@/components/ui/toaster"
import { WebVitalsReporter } from "@/components/web-vitals-reporter"

export const metadata = {
  title: "Web Developer's Output App",
  description: "Record and analyze your web development learnings",
  icons: {
    icon: [
      { url: '/branding/favicon.svg', type: 'image/svg+xml' }
    ]
  }
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
            <WebVitalsReporter />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

