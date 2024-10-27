"use client"

import { useState } from 'react'
import { format, parseISO, subDays, getDay } from 'date-fns'
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

  // 週ごとにデータをグループ化
  const weeks: string[][] = []
  let currentWeek: string[] = []
  
  // 最初の週の開始日まで空のセルを追加
  const firstDay = parseISO(dateRange[0])
  const firstDayOfWeek = getDay(firstDay)
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push('')
  }

  // 日付を週ごとにグループ化
  dateRange.forEach((date) => {
    currentWeek.push(date)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  // 最後の週が7日未満の場合、空のセルを追加
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push('')
    }
    weeks.push(currentWeek)
  }

  // 曜日ラベル
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="flex gap-1">
      {/* 曜日ラベル */}
      <div className="flex flex-col justify-between pr-2 text-sm text-muted-foreground">
        {weekDays.map((day) => (
          <div key={day} className="h-3 flex items-center">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((date, dayIndex) => {
              if (!date) {
                return <div key={`empty-${dayIndex}`} className="w-3 h-3" />
              }

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
        ))}
      </div>
    </div>
  )
}