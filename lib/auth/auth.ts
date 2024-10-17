import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //ユーザーの認証ロジック
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("ユーザーが見つかりません");
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("パスワードが正しくありません");
        }
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  //カスタムコールバック関数
  callbacks: {
    //jwtトークンの作成
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    //セッションの作成
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    //ログイン後のリダイレクト先を指定
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/home`;
      } else if (url.startsWith("/")) {
        return `${baseUrl}/home`;
      }
      return `${baseUrl}/home`;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
