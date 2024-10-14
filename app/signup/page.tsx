"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "ユーザー名は3文字以上である必要があります。",
  }),
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  password: z.string().min(8, {
    message: "パスワードは8文字以上である必要があります。",
  }),
})

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "サインアップに失敗しました");
      }
      toast({
        title: "アカウント作成成功",
        description: "ログインページへリダイレクトします。",
      });
      router.push("/login");
    } catch (error) {
      console.error("サインアップエラー:", error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "アカウントの作成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">アカウント作成</h1>
          <p className="text-sm text-muted-foreground">
            以下の情報を入力してアカウントを作成してください
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>
                    あなたの公開プロフィールに表示されます
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>パスワード</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              アカウント作成
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          アカウントをお持ちの方は{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            ログイン
          </Link>
          してください。
        </p>
      </div>
    </div>
  )
}
