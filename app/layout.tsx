import '@/app/globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"


export const metadata = {
  title: "Web Developer's Output App",
  description: "Record and analyze your web development learnings",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}