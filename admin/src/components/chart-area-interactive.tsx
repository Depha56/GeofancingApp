import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useTracking } from "@/hooks/use-tracking"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
// Update the chart data to represent hourly movement activity

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
  const [timeRange, setTimeRange] = React.useState("24h")
  const [chartData, setChartData] = React.useState<any[]>([])
  const { fetchAllFeeds } = useTracking()

  React.useEffect(() => {
    if (isMobile) setTimeRange("24h")
  }, [isMobile])

  React.useEffect(() => {
    fetchAllFeeds().then((allFeeds) => {
      // Get today's date in YYYY-MM-DD
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);

      // Group by hour for only today's feeds
      const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
      const data = hours.map(hour => ({
        time: hour,
        activity: 0,
        grazing: 0,
      }));

      allFeeds.forEach(feed => {
        if (!feed.createdAt) return;
        const date = new Date(feed.createdAt);
        const feedDayStr = date.toISOString().slice(0, 10);
        if (feedDayStr !== todayStr) return; // Only today's feeds

        const hourStr = date.getHours().toString().padStart(2, "0") + ":00";
        const idx = data.findIndex(d => d.time === hourStr);
        if (idx !== -1) {
          if (feed.animalBehaviour === "MOVING") data[idx].activity += 1;
          if (feed.animalBehaviour === "GRAZING") data[idx].grazing += 1;
        }
      });

      setChartData(data);
    });
  }, [fetchAllFeeds])

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
