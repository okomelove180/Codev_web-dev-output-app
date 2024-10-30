import { prisma } from "./prisma";
import { isSameDay, subDays, startOfDay } from "date-fns";
import { LearningGoal } from '@prisma/client'

interface Output {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  originalContent: string;
  correctedContent: string;
  analysis: string;
  language: string;
  userId: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  todayOutputs: number;
  totalOutputs: number;
  currentStreak: number;
  recentOutputs: Output[];
  learningGoals: LearningGoal[];
  outputCalendar: Record<string, number>;
  outputs: Output[];
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        outputs: {
          orderBy: { createdAt: 'desc' },
        },
        learningGoals: true,
      },
    });

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    // 今日の日付を取得（時間は00:00:00に設定）
    const today = startOfDay(new Date());

    // 今日のアウトプット数を計算
    const todayOutputs = user.outputs.filter(output => 
      isSameDay(output.createdAt, today)
    ).length;

    const totalOutputs = user.outputs.length;

    // 現在のストリークを計算
    let currentStreak = 0; //ストリークカウンター
    let checkDate = today; //今日の日付から計算

    //output配列の中に、条件を満たす要素が一つでもあればtrueを返す
    while (true) {
      const hasOutputOnDate = user.outputs.some(output => 
        isSameDay(output.createdAt, checkDate)
      );

      if (!hasOutputOnDate) {
        break;
      }

      currentStreak++; //カウンターを1増やす
      checkDate = subDays(checkDate, 1); //前日の日付に更新
    }

    // 過去365日分のカレンダーデータを作成
    const outputCalendar: Record<string, number> = {};
    const startDate = subDays(today, 365);

    // 初期値として0を設定
    for (let i = 0; i <= 365; i++) {
      const date = subDays(today, i);
      const dateStr = date.toISOString().split('T')[0];
      outputCalendar[dateStr] = 0;
    }

    // 実際のアウトプット数を集計
    user.outputs.forEach(output => {
      const outputDate = output.createdAt;
      if (outputDate >= startDate) {
        const dateStr = outputDate.toISOString().split('T')[0];
        outputCalendar[dateStr] = (outputCalendar[dateStr] || 0) + 1;
      }
    });

    // 最新5件のアウトプットを取得
    const recentOutputs = user.outputs.slice(0, 5);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      todayOutputs,
      totalOutputs,
      currentStreak,
      recentOutputs,
      learningGoals: user.learningGoals,
      outputCalendar,
      outputs: user.outputs,
    };
  } catch (error) {
    console.error("ユーザープロファイルの取得中にエラーが発生しました:", error);
    throw new Error("ユーザープロファイルの取得に失敗しました");
  }
}
