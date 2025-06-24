import { TrackingMap } from "@/components/tracking/tracking-map";

export default function TrackingPage() {
  return (
      <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
              <TrackingMap />
          </div>
      </div>
  )
}
