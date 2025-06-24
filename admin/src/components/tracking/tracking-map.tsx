import { useState, useMemo } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import TrackingFilters from "./tracking-filters";
import GeofencingMap from './fencing-map';
import { useTracking } from "@/hooks/use-tracking";
import type { SensorFeed } from "@/hooks/use-tracking";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export function TrackingMap() {
  const { feeds, boundaries } = useTracking();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeed, setSelectedFeed] = useState<SensorFeed>();
  const [alert, setAlert] = useState<string | null>(null);

  // Filter feeds by animalBehaviour
  const filteredFeeds = useMemo(() => {
    if (statusFilter === "all") return feeds;
    return feeds.filter(feed => feed.animalBehaviour === statusFilter);
  }, [feeds, statusFilter]);

  // Search handler
  const handleSearch = (collarId: string) => {
    const found = feeds.find(f => f.collarId.toLowerCase() === collarId.trim().toLowerCase());
    if (found) {
      setSelectedFeed(found);
      setAlert(null);
    } else {
      setAlert(`Collar ID "${collarId}" not found.`);
    }
  };

  return (
    <div className="flex h-full">
      <TrackingFilters
        feeds={filteredFeeds}
        allFeeds={feeds}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAnimalClick={setSelectedFeed}
        onSearch={handleSearch}
        selectedAnimal={selectedFeed?.collarId}
      />
      <GeofencingMap
        feeds={filteredFeeds}
        boundaries={boundaries}
        selectedFeed={selectedFeed}
      />
      {alert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-[350px]">
          <Alert variant="destructive">
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>{alert}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
