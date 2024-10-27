"use client" // Next.jsのクライアントサイドコンポーネントであることを示す

import { useState, useRef, useEffect } from 'react'
import { format, parseISO, subDays, getDay } from 'date-fns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// TypeScriptの型定義：カレンダーデータの形式を指定
type CalendarData = {
  date: string    // 日付（YYYY-MM-DD形式）
  count: number   // その日のアクティビティ数
}

export function CalendarHeatmap({ data = [] }: { data: CalendarData[] }) {
  // Reactの状態管理とrefの設定
  const [, setHoveredDate] = useState<string | null>(null)  // ホバー中の日付を追跡
  const scrollContainerRef = useRef<HTMLDivElement>(null)   // スクロールコンテナへの参照を保持

  // 日付範囲の生成（今日から365日前まで）
  const today = new Date()
  const dateRange = Array.from({ length: 365 }, (_, i) => {
    const date = subDays(today, 364 - i)  // 364日前から今日までの日付を生成
    return format(date, 'yyyy-MM-dd')     // 日付を文字列形式に変換
  })

  // コンポーネントがマウントされた時に実行される副作用
  useEffect(() => {
    // スクロールコンテナが存在する場合、最新のデータ（右端）が表示されるようにスクロール
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, []) // 空の依存配列は、この効果がマウント時にのみ実行されることを示す

  // アクティビティ数に基づいて背景色を決定する関数
  const getColor = (count: number) => {
    // カウントに応じて異なる濃さの緑色を返す
    // dark:は、ダークモード時の色を指定
    if (count === 0) return 'bg-muted'
    if (count < 3) return 'bg-emerald-200 dark:bg-emerald-900'
    if (count < 5) return 'bg-emerald-300 dark:bg-emerald-800'
    if (count < 7) return 'bg-emerald-400 dark:bg-emerald-700'
    return 'bg-emerald-500 dark:bg-emerald-600'
  }

  // 日付データを週単位でグループ化する処理
  const weeks: string[][] = []        // 週ごとのデータを格納する2次元配列
  let currentWeek: string[] = []      // 現在処理中の週のデータ
  
  // 最初の週の開始日までの空セルを追加
  const firstDay = parseISO(dateRange[0])         // 最初の日付をDate型に変換
  const firstDayOfWeek = getDay(firstDay)         // その日の曜日を取得（0=日曜日）
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push('')  // 空のセルで埋める
  }

  // すべての日付を週単位でグループ化
  dateRange.forEach((date) => {
    currentWeek.push(date)
    if (currentWeek.length === 7) {   // 1週間分のデータが集まったら
      weeks.push(currentWeek)         // weeksに追加し、
      currentWeek = []                // 新しい週を開始
    }
  })

  // 最後の週の残りを空セルで埋める
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push('')
    }
    weeks.push(currentWeek)
  }

  // 曜日ラベルの配列
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    // 最外部のコンテナ：幅いっぱいに広げて中央揃えにする
    <div className="w-full flex justify-center">
      {/* スクロール可能なコンテナ：スマートフォン表示時の横スクロールを管理 */}
      <div 
        ref={scrollContainerRef}
        className="max-w-full overflow-x-auto overflow-y-hidden pb-2"
      >
        {/* 最小幅を保証するコンテナ：スクロール時にコンテンツが縮まないようにする */}
        <div className="flex gap-1 min-w-min">
          {/* 曜日ラベルの列 */}
          <div className="flex flex-col justify-between pr-2 text-sm text-muted-foreground">
            {weekDays.map((day) => (
              <div key={day} className="h-3 flex items-center">
                {day}
              </div>
            ))}
          </div>

          {/* カレンダーグリッド：週ごとの列を表示 */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  // 空のセルの場合
                  if (!date) {
                    return <div key={`empty-${dayIndex}`} className="w-3 h-3" />
                  }

                  // その日のデータを検索（存在しない場合は count: 0 で作成）
                  const dayData = data.find((d) => d.date === date) || { date, count: 0 }
                  
                  // ツールチップ付きのセルを表示
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
      </div>
    </div>
  )
}