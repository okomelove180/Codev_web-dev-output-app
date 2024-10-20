import { prisma } from "./prisma";

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    return user;
  } catch (error) {
    console.error("ユーザープロファイルの取得中にエラーが発生しました:", error);
    throw new Error("ユーザープロファイルの取得に失敗しました");
  }
}

