import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, PenTool, List } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <header className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Web Developer&apos;s Output App
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            記録し、分析し、成長する。あなたの学習をサポートします。
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl lg:text-2xl">
                <PenTool className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                新しいアウトプットを作成
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm sm:text-base lg:text-lg">
                あなたの学びを1分間でアウトプットしましょう。
                AIによる分析、修正、提案を受けることができます。
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/outputs/new">
                  始める <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl lg:text-2xl">
                <List className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                アウトプット一覧
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm sm:text-base lg:text-lg">
                これまでに作成したアウトプットを確認し、振り返ることができます。
                学習の進捗を可視化しましょう。
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild size="lg" className="w-full">
                <Link href="/outputs">
                  一覧を見る <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <footer className="mt-12 sm:mt-16 lg:mt-20 text-center text-xs sm:text-sm lg:text-base text-muted-foreground">
          <p>&copy; 2024 codev -Web Developer&apos;s Output App-. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}