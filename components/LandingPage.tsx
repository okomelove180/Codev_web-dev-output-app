import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code, BookOpen, Users, BrainCircuit, TrendingUp, Lightbulb, LucideIcon } from "lucide-react"

interface CardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: CardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center text-lg">
        <Icon className="mr-2 h-5 w-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm">{description}</p>
    </CardContent>
  </Card>
)

const OutputImportanceCard = ({ icon: Icon, title, description }: CardProps) => (
  <Card className="overflow-hidden">
    <CardHeader>
      <CardTitle className="flex items-center text-lg">
        <Icon className="mr-2 h-5 w-5" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm mb-4">{description}</p>
    </CardContent>
  </Card>
)

const TechStackItem = ({ name }: { name: string }) => (
  <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs sm:text-sm font-medium">
    {name}
  </div>
)

export default function LandingPage() {
  const techStack = [
    "Next.js",
    "React",
    "TypeScript",
    "NextAuth.js",
    "Tailwind CSS",
    "shadcn/ui",
    "Prisma",
    "Vercel",
    "GPT-4-mini API",
    "Whisper API",
    "Qiita API",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <header className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center items-center mb-4">
            <img src="/branding/logo.png" alt="codev" className="h-12 sm:h-16 mb-8 sm:mb-12"/>
          </div>
          <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold mb-4">Web Developer&apos;s Output App</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">あなたの学びをアウトプットしよう。</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/signup">新規登録</Link>
            </Button>
          </div>
        </header>

        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">このアプリでできること</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={Code}
              title="学習のアウトプット"
              description="コーディングの経験や学んだことを、AI音声認識により簡単にアウトプットできます。"
            />
            <FeatureCard
              icon={BookOpen}
              title="AIによる分析"
              description="AIがあなたの学習内容を分析し、改善点や次のステップを提案します。"
            />
            <FeatureCard
              icon={Users}
              title="学習の記録"
              description="学習の記録を振り返りや復習に役立てることができます。"
            />
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">なぜアウトプットが重要なのか？</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <OutputImportanceCard
              icon={BrainCircuit}
              title="知識の定着と理解の深化"
              description="学んだことを自分の言葉で表現することで、理解が深まり、長期記憶への転送が促進されます。"
            />
            <OutputImportanceCard
              icon={Lightbulb}
              title="思考の整理と知識の穴の発見"
              description="考えをまとめる過程で、概念間のつながりが明確になり、理解が不十分な部分が浮き彫りになります。"
            />
            <OutputImportanceCard
              icon={Users}
              title="フィードバックと新たな視点"
              description="アウトプットを共有することで、新たな視点や改善点を得られ、学習の質が向上します。"
            />
            <OutputImportanceCard
              icon={TrendingUp}
              title="モチベーション向上と継続的な成長"
              description="学習の進捗を可視化することで、継続的な学習意欲が高まり、長期的な成長につながります。"
            />
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">使用技術</h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {techStack.map((tech, index) => (
              <TechStackItem key={index} name={tech} />
            ))}
          </div>
        </section>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">今すぐ始めよう</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            アウトプットを通じて、あなたの学習効率を最大化し、Web開発スキルを飛躍的に向上させましょう。
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">
              無料で登録 <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <footer className="bg-background py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 codev -Web Developer&apos;s Output App-. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}