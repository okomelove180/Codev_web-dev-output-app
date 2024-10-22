import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent,  CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, PenTool, List } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <div className="flex justify-center items-center mb-4">
          <img src="/branding/logo.png" alt="codev" className="h-16 mb-12"/>
        </div>
        <h1 className="text-4xl font-bold mb-4">駆け出しWeb開発者のためのアウトプットアプリ</h1>
        <p className="text-xl text-muted-foreground">記録し、分析し、成長する。あなたの学習をサポートします。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="mr-2" />
              新しいアウトプットを作成
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>あなたの学びを1分間でアウトプットしましょう。
            AIによる分析、修正、提案を受けることができます。</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/outputs/new">
                始める <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="mr-2" />
              アウトプット一覧
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>これまでに作成したアウトプットを確認し、振り返ることができます。学習の進捗を可視化しましょう。</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/outputs">
                一覧を見る <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; 2024 codev. All rights reserved.</p>
      </footer>
    </div>
  )
}