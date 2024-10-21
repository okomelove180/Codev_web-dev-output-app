'use client'

import { useState } from 'react'
import { LearningGoal } from '@prisma/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface LearningGoalsProps {
  initialGoals: LearningGoal[]
  userId: string
}

export function LearningGoals({ initialGoals, userId }: LearningGoalsProps) {
  const [goals, setGoals] = useState(initialGoals)
  const [newGoalTitle, setNewGoalTitle] = useState('')

  const toggleGoalCompletion = async (goalId: string, completed: boolean) => {
    // 楽観的に UI を更新
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed } : goal
    ))

    try {
      const response = await fetch(`/api/learning-goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) {
        throw new Error('Failed to update goal')
      }

      const updatedGoal = await response.json()
      
      toast({
        title: "目標を更新しました",
        description: `${updatedGoal.title} を ${completed ? '完了' : '未完了'} に設定しました。`,
      })
    } catch (error) {
      console.error('Error updating goal:', error)
      // エラーが発生した場合、状態を元に戻す
      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, completed: !completed } : goal
      ))
      toast({
        title: "エラー",
        description: "目標の更新に失敗しました。",
        variant: "destructive",
      })
    }
  }

  const addNewGoal = async () => {
    if (newGoalTitle.trim() === '') return

    // 楽観的に新しい目標を追加
    const optimisticGoal: LearningGoal = {
      id: Date.now().toString(), // 一時的なIDを生成
      title: newGoalTitle,
      description: '',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId,
    }
    setGoals([...goals, optimisticGoal])
    setNewGoalTitle('')

    try {
      const response = await fetch('/api/learning-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newGoalTitle, userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to add new goal')
      }

      const newGoal = await response.json()
      // 楽観的に追加した目標を実際のデータで置き換え
      setGoals(goals => goals.map(goal => 
        goal.id === optimisticGoal.id ? newGoal : goal
      ))
      
      toast({
        title: "新しい目標を追加しました",
        description: newGoal.title,
      })
    } catch (error) {
      console.error('Error adding new goal:', error)
      // エラーが発生した場合、楽観的に追加した目標を削除
      setGoals(goals => goals.filter(goal => goal.id !== optimisticGoal.id))
      toast({
        title: "エラー",
        description: "新しい目標の追加に失敗しました。",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="flex items-center space-x-2">
          <Checkbox 
            id={goal.id} 
            checked={goal.completed}
            onCheckedChange={(checked) => toggleGoalCompletion(goal.id, checked as boolean)}
          />
          <label htmlFor={goal.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {goal.title}
          </label>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="新しい目標"
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
        />
        <Button onClick={addNewGoal} aria-label="新しい目標を追加">追加</Button>
      </div>
    </div>
  )
}