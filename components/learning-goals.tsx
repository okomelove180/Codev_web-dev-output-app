import { LearningGoal } from '@prisma/client'
import { Checkbox } from '@/components/ui/checkbox'

interface LearningGoalsProps {
  goals: LearningGoal[]
}

export function LearningGoals({ goals }: LearningGoalsProps) {
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="flex items-center space-x-2">
          <Checkbox id={goal.id} checked={goal.completed} />
          <label htmlFor={goal.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {goal.title}
          </label>
        </div>
      ))}
    </div>
  )
}