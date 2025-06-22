"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
// Update the chart data to represent hourly movement activity
const chartData = [
  { time: "00:00", activity: 12, grazing: 8 },
  { time: "02:00", activity: 8, grazing: 5 },
  { time: "04:00", activity: 15, grazing: 12 },
  { time: "06:00", activity: 45, grazing: 38 },
  { time: "08:00", activity: 78, grazing: 65 },
  { time: "10:00", activity: 92, grazing: 85 },
  { time: "12:00", activity: 67, grazing: 45 },
  { time: "14:00", activity: 58, grazing: 42 },
  { time: "16:00", activity: 73, grazing: 68 },
  { time: "18:00", activity: 89, grazing: 82 },
  { time: "20:00", activity: 45, grazing: 35 },
  { time: "22:00", activity: 23, grazing: 18 },
]

const chartConfig = {
  activity: {
    label: "Movement Activity",
    color: "hsl(var(--chart-1))",
  },
  grazing: {
    label: "Grazing Activity",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date()
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        {/* Update the component title and description */}
        <CardTitle>Livestock Activity</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">Movement and grazing patterns over 24 hours</span>
          <span className="@[540px]/card:hidden">24h Activity</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-40" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            {/* Update the gradient definitions */}
            <defs>
              <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-activity)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-activity)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillGrazing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-grazing)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-grazing)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            {/* Update the XAxis dataKey and tickFormatter */}
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value}
            />
            {/* Update the tooltip labelFormatter */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={(value) => `Time: ${value}`} indicator="dot" />}
            />
            {/* Update the Area components */}
            <Area dataKey="grazing" type="natural" fill="url(#fillGrazing)" stroke="var(--color-grazing)" stackId="a" />
            <Area
              dataKey="activity"
              type="natural"
              fill="url(#fillActivity)"
              stroke="var(--color-activity)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
