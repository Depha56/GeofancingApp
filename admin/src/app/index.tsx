import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import * as turf from "@turf/turf"
import { useTracking, VirtualBoundary } from "@/hooks/use-tracking";


// Helper to check if a point is inside any boundary
function getFenceStatus(
  longitude: number,
  latitude: number,
  boundaries: VirtualBoundary[]
): "Inside Fence" | "Outside Fence" {
  for (const boundary of boundaries) {
    const center = [boundary.farmCenterCoordinates.longitude, boundary.farmCenterCoordinates.latitude]
    const circle = turf.circle(center, boundary.farmRadius / 1000, { steps: 64, units: "kilometers" })
    if (turf.booleanPointInPolygon([longitude, latitude], circle)) {
      return "Inside Fence"
    }
  }
  return "Outside Fence"
}

export default function Home() {
  const { feeds, boundaries } = useTracking()

  const capitalizeStr = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const datas = feeds.map((feed, i) => ({
    id: i + 1,
    animalId: feed.collarId,
    tagNumber: feed.collarId,
    location: `${feed.latitude?.toFixed(2)}, ${feed.longitude?.toFixed(2)}`,
    status: getFenceStatus(feed.longitude, feed.latitude, boundaries),
    batteryLevel: feed.batteryLevel ?? "N/A",
    lastUpdate: feed.createdAt ? new Date(feed.createdAt).toLocaleString() : "Unknown",
    activity: capitalizeStr(feed?.animalBehaviour || "") ?? "Unknown",
    alerts: feed.collarStatus === "OFF_ANIMAL" ? 1 : 0,
  }))

  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
            </div>
            <DataTable data={datas} />
        </div>
        </div>
    </div>
  )
}
