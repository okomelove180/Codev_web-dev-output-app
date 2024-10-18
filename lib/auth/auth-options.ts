import { authProviders } from "./providers";
import { callbacks } from "./callbacks";

import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";




const prisma = new PrismaClient();

//ユーザーのサインアップ
export async function signUp({ email, password, name }: { email: string; password: string; name: string }) {
  
  // メールアドレス重複確認
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("このメールアドレスは既に使用されています。");
  }

  // パスワードハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザー作成
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // ユーザー情報を返す
  return { id: user.id, email: user.email, name: user.name };
}

//NextAuth.jsの設定オブジェクト。認証システムの動作を定義している。
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [authProviders],
  callbacks,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
