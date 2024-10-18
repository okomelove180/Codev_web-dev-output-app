"use client";

import React from "react";
import {signIn} from "next-auth/react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";

import { getSession } from "next-auth/react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast";

import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})


export default function LoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast({
          title: "ログインエラー",
          description: "メールアドレスまたはパスワードが正しくありません。",
          variant: "destructive",
        });
      } else {
        const session = await getSession();
        if (session) {
          router.push("/home");
        } else {
          console.error("セッションの取得に失敗しました");
          toast({
            title: "エラー",
            description: "ログインに成功しましたが、セッションの取得に失敗しました。",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("ログインエラー:", error);
      toast({
        title: "エラー",
        description: "ログイン中に問題が発生しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Web Developer&apos;s Output App</CardTitle>
          <CardDescription className="text-center">アカウントにログイン</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="メールアドレスを入力"
                        required
                      />
                    </FormControl>
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
                      <Input
                        type="password"
                        {...field}
                        placeholder="パスワードを入力"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="w-full mt-4" type="submit">ログイン</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/signup">アカウントをお持ちでない方はこちら</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}