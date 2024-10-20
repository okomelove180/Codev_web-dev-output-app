import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarHeatmap } from '@/components/calendar-heatmap'
// import { OutputList } from '@/components/output-list'
// import { SkillTags } from '@/components/skill-tags'
// import { AchievementBadges } from '@/components/achievement-badges'
// import { LearningGoals } from '@/components/learning-goals'
// import { OutputAnalytics } from '@/components/output-analytics'
import { getUserProfile } from '@/lib/api'

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUserProfile(params.userId)

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <p className="text-sm text-muted-foreground">Joined {user.joinDate}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard title="Today's Outputs" value={user.todayOutputs} />
              <StatCard title="Total Outputs" value={user.totalOutputs} />
              <StatCard title="Current Streak" value={`${user.currentStreak} days`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button>Create New Output</Button>
            <Button variant="outline">View All Outputs</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Output Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading calendar...</div>}>
              <CalendarHeatmap data={user.outputCalendar} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Outputs</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading recent outputs...</div>}>
              {/* <OutputList outputs={user.recentOutputs} /> */}
            </Suspense>
          </CardContent>
          <CardFooter>
            <Button variant="link">View All Outputs</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <SkillTags skills={user.skills} /> */}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <AchievementBadges achievements={user.achievements} /> */}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <LearningGoals goals={user.learningGoals} /> */}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Output Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="frequency">
              <TabsList>
                <TabsTrigger value="frequency">Output Frequency</TabsTrigger>
                <TabsTrigger value="technologies">Technologies</TabsTrigger>
              </TabsList>
              <TabsContent value="frequency">
                <Suspense fallback={<div>Loading frequency chart...</div>}>
                  {/* <OutputAnalytics data={user.outputFrequency} type="line" /> */}
                </Suspense>
              </TabsContent>
              <TabsContent value="technologies">
                <Suspense fallback={<div>Loading technology chart...</div>}>
                  {/* <OutputAnalytics data={user.outputTechnologies} type="pie" /> */}
                </Suspense>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}