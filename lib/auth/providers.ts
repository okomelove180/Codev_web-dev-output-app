import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authProviders = CredentialsProvider({
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
});