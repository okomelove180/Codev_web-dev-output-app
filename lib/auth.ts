import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function signUp({ email, password, username }: {
  email: string;
  password: string;
  username: string;
}) {
  // メールアドレスが既に使用されているかチェック
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("このメールアドレスは既に使用されています。");
  }

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザーの作成
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: username,
    },
  });

  return user;
}