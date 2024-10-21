"use client"

import { useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type CalendarData = {
  date: string
  count: number
}

export function CalendarHeatmap({ data = [] }: { data: CalendarData[] }) {
  const [, setHoveredDate] = useState<string | null>(null)

  const today = new Date()

  const dateRange = Array.from({ length: 365 }, (_, i) => {
    const date = subDays(today, 364 - i)
    return format(date, 'yyyy-MM-dd')
  })

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted'
    if (count < 3) return 'bg-emerald-200 dark:bg-emerald-900'
    if (count < 5) return 'bg-emerald-300 dark:bg-emerald-800'
    if (count < 7) return 'bg-emerald-400 dark:bg-emerald-700'
    return 'bg-emerald-500 dark:bg-emerald-600'
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid grid-cols-[repeat(53,1fr)] gap-1">
        {dateRange.map((date) => {
          const dayData = data.find((d) => d.date === date) || { date, count: 0 }
          return (
            <TooltipProvider key={date}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`w-3 h-3 rounded-sm ${getColor(dayData.count)}`}
                    onMouseEnter={() => setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{format(parseISO(date), 'MMM d, yyyy')}</p>
                  <p>{dayData.count} outputs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}