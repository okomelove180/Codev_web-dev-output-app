"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from 'react';

interface OutputAnalyticsProps {
  data: { date: string; count: number }[];
}

type PeriodOption = {
  value: string;
  label: string;
  days: number;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: "30", label: "30日", days: 30 },
  { value: "90", label: "90日", days: 90 },
  { value: "180", label: "180日", days: 180 },
];

export function OutputAnalytics({ data }: OutputAnalyticsProps) {
  // データを日付でソート
  const sortedData = useMemo(() => 
    [...data].sort((a, b) => 
      parseISO(a.date).getTime() - parseISO(b.date).getTime()
    ), [data]
  );

  // 期間ごとのデータを生成する関数
  const getFilteredData = (days: number) => {
    const cutoffDate = subDays(new Date(), days);
    return sortedData
      .filter(item => parseISO(item.date) >= cutoffDate)
      .map(item => ({
        ...item,
        formattedDate: format(parseISO(item.date), 'M/d', { locale: ja })
      }));
  };

  // 各期間のデータをメモ化
  const periodData = useMemo(() => 
    PERIOD_OPTIONS.reduce((acc, period) => ({
      ...acc,
      [period.value]: getFilteredData(period.days)
    }), {}), [sortedData]
  );

  const LineChartComponent = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
        />
        <XAxis
          dataKey="formattedDate"
          interval="preserveStartEnd"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          domain={[0, 'auto']}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => [`${value}件`, 'アウトプット数']}
          labelFormatter={(label) => `${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          name="アウトプット数"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="30" className="w-full">
          <TabsList className="mb-4">
            {PERIOD_OPTIONS.map((period) => (
              <TabsTrigger key={period.value} value={period.value}>
                {period.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {PERIOD_OPTIONS.map((period) => (
            <TabsContent key={period.value} value={period.value}>
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">
                  過去{period.label}のアウトプット推移
                </h3>
                <LineChartComponent data={periodData[period.value]} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}