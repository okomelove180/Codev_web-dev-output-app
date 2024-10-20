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
      <div className="grid gap-6 md:grid-cols-4">
        {/* User Profile Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatar-placeholder.png" alt={user.name || ''} />
                <AvatarFallback>{user.name ? user.name[0].toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <p className="text-sm text-muted-foreground">Joined {user.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Today&apos;s Outputs</h3>
                <p className="text-3xl font-bold">{user.todayOutputs}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Total Outputs</h3>
                <p className="text-3xl font-bold">{user.totalOutputs}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Current Streak</h3>
                <p className="text-3xl font-bold">{user.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button>Create New Output</Button>
            <Button variant="outline">View All Outputs</Button>
          </CardContent>
        </Card>

        {/* Output Calendar Card */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Output Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap data={calendarData} />
          </CardContent>
        </Card>

        {/* Recent Outputs Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Outputs</CardTitle>
          </CardHeader>
          <CardContent>
            <OutputList outputs={user.recentOutputs} />
          </CardContent>
          <CardFooter>
            <Button variant="link">View All Outputs</Button>
          </CardFooter>
        </Card>

        {/* Skills Card */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillTags skills={skills} />
          </CardContent>
        </Card>

        {/* Learning Goals Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningGoals goals={user.learningGoals} />
          </CardContent>
        </Card>

        {/* Output Analytics Card */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Output Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <OutputAnalytics data={calendarData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}