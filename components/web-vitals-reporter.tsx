'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    console.log(metric)
    // ここで必要に応じて分析サービスにデータを送信
  })

  return null
}