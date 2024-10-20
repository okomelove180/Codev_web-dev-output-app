import { prisma } from "./prisma";
import { differenceInDays } from "date-fns";

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        outputs: {
          orderBy: { createdAt: 'desc' },
          take: 5, // 最新の5つのアウトプットを取得
        },
        learningGoals: true,
      },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOutputs = user.outputs.filter(output => 
      output.createdAt >= today
    ).length;

    const totalOutputs = user.outputs.length;

    // 現在のストリークを計算
    let currentStreak = 0;
    let lastOutputDate = new Date(0);
    for (const output of user.outputs) {
      if (differenceInDays(output.createdAt, lastOutputDate) <= 1) {
        currentStreak++;
        lastOutputDate = output.createdAt;
      } else {
        break;
      }
    }

    // アウトプットカレンダーデータの作成
    const outputCalendar = user.outputs.reduce((acc, output) => {
      const date = output.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      todayOutputs,
      totalOutputs,
      currentStreak,
      recentOutputs: user.outputs,
      learningGoals: user.learningGoals,
      outputCalendar,
    };
  } catch (error) {
    console.error("ユーザープロファイルの取得中にエラーが発生しました:", error);
    throw new Error("ユーザープロファイルの取得に失敗しました");
  }
}