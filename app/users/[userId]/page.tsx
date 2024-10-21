import React from 'react';
import { notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarHeatmap } from '@/components/calendar-heatmap';
import { OutputList } from '@/components/output-list';
import { SkillTags } from '@/components/skill-tags';
import { LearningGoals } from '@/components/learning-goals';
import { OutputAnalytics } from '@/components/output-analytics';

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUserProfile(params.userId);
  
  if (!user) {
    notFound();
  }

  const calendarData = Object.entries(user.outputCalendar).map(([date, count]) => ({ date, count }));
  const skills = user.outputs.reduce((acc, output) => {
    if (!acc.includes(output.language)) {
      acc.push(output.language);
    }
    return acc;
  }, [] as string[]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ユーザープロフィール</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* User Profile Card */}
        <Card className="col-span-full sm:col-span-2 md:col-span-3">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatar-placeholder.png" alt="" />
                <AvatarFallback>{user.name ? user.name[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle><h2>{user.name}</h2></CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <p className="text-sm text-muted-foreground">登録日: {user.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <h3 className="text-lg font-semibold">今日のアウトプット</h3>
                <p className="text-3xl font-bold">{user.todayOutputs}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">総アウトプット数</h3>
                <p className="text-3xl font-bold">{user.totalOutputs}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">現在のストリーク</h3>
                <p className="text-3xl font-bold">{user.currentStreak} 日</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="col-span-full sm:col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle><h2>クイックアクション</h2></CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button>
              <span aria-hidden="true">新規アウトプットを作成</span>
            </Button>
            <Button variant="outline">
              <span aria-hidden="true">全てのアウトプットを表示</span>
            </Button>
          </CardContent>
        </Card>

        {/* Output Calendar Card */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle><h2>アウトプットカレンダー</h2></CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap data={calendarData} />
          </CardContent>
        </Card>

        {/* Recent Outputs Card */}
        <Card className="col-span-full md:col-span-3">
          <CardHeader>
            <CardTitle><h2>最近のアウトプット</h2></CardTitle>
          </CardHeader>
          <CardContent>
            <OutputList outputs={user.recentOutputs} />
          </CardContent>
          <CardFooter>
            <Button variant="link">
              <span aria-hidden="true">全てのアウトプットを表示</span>
            </Button>
          </CardFooter>
        </Card>

        {/* Skills Card */}
        <Card className="col-span-full sm:col-span-1">
          <CardHeader>
            <CardTitle><h2>スキル</h2></CardTitle>
          </CardHeader>
          <CardContent>
            <SkillTags skills={skills} />
          </CardContent>
        </Card>

        {/* Learning Goals Card */}
        <Card className="col-span-full sm:col-span-2">
          <CardHeader>
            <CardTitle><h2>学習目標</h2></CardTitle>
          </CardHeader>
          <CardContent>
            <LearningGoals initialGoals={user.learningGoals} userId={user.id} />
          </CardContent>
        </Card>

        {/* Output Analytics Card */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle><h2>アウトプット分析</h2></CardTitle>
          </CardHeader>
          <CardContent>
            <OutputAnalytics data={calendarData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
