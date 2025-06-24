import { ActivityIcon, MapPinIcon, TrendingUpIcon, UsersIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTracking } from "@/hooks/use-tracking"

export function SectionCards() {
  const { feeds, boundaries } = useTracking();

  // Active animals
  const totalAnimals = feeds.length;
  // For demo, assume 250 is the expected total (or use boundaries/collarIds if you want dynamic)
  const expectedTotal = boundaries.reduce((sum, b) => sum + (b.collarIds?.length || 0), 0) || 250;

  // Geofence status
  // For demo: animals with collarStatus ON_ANIMAL and inside geofence
  // You can add more logic if you have geofence check
  const safeAnimals = feeds.filter(f => f.collarStatus === "ON_ANIMAL").length;
  const outsideAnimals = totalAnimals - safeAnimals;
  const complianceRate = expectedTotal ? ((safeAnimals / expectedTotal) * 100).toFixed(1) : "0";

  // Movement activity (example: count animals with "GRAZING" or "MOVING")
  const activeAnimals = feeds.filter(f => f.animalBehaviour === "GRAZING" || f.animalBehaviour === "MOVING").length;
  const movementLevel = activeAnimals > totalAnimals * 0.7 ? "High" : activeAnimals > totalAnimals * 0.3 ? "Medium" : "Low";
  const movementText = movementLevel === "High" ? "Peak grazing hours" : movementLevel === "Medium" ? "Normal activity" : "Low activity";

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:grid-cols-3 lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Active Animals</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{totalAnimals}</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <UsersIcon className="size-3" />
              Online
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All sensors active <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">{totalAnimals} of {expectedTotal} animals monitored</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Geofence Status</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{safeAnimals}</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs text-green-600">
              <MapPinIcon className="size-3" />
              Safe
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {outsideAnimals} animals outside boundaries <MapPinIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">{complianceRate}% compliance rate today</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Movement Activity</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">{movementLevel}</CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <ActivityIcon className="size-3" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {movementText} <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Average {activeAnimals} animals active now</div>
        </CardFooter>
      </Card>
    </div>
  )
}
