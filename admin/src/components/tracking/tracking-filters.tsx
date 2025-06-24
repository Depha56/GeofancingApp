import { useState } from "react";
import {
  BatteryIcon,
  SearchIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import type { SensorFeed } from "@/hooks/use-tracking";

interface TrackingFiltersProps {
  feeds: SensorFeed[];
  allFeeds: SensorFeed[];
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onAnimalClick: (feed: SensorFeed) => void;
  onSearch: (collarId: string) => void;
  selectedAnimal?: string | null;
}

const TrackingFilters = ({
  feeds,
  allFeeds,
  statusFilter,
  setStatusFilter,
  onAnimalClick,
  onSearch,
  selectedAnimal,
}: TrackingFiltersProps) => {
    const [searchValue, setSearchValue] = useState("");

    // Unique animalBehaviour values for filter dropdown
    const behaviours = Array.from(new Set(allFeeds.map(f => f.animalBehaviour).filter(Boolean)));
    const topFive = feeds.slice(0, 5);

    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchValue.trim()) {
        onSearch(searchValue);
      }
    };

    return (
        <div className="w-80 border-r h-[calc(100vh-76px)] overflow-y-auto bg-muted/30 p-4 [&::-webkit-scrollbar]:hidden scrollbar-hide">
            <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Tracking Controls</h3>
                <div className="space-y-4">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by Collar ID..."
                        className="pl-8"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                      />
                  </div>
                </form>
                <div>
                    <Label htmlFor="status-filter">Filter by Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status-filter">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          {behaviours.map(b => (
                            <SelectItem key={b} value={b || ""}>{b}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                </div>
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-medium mb-3">Live Animals ({topFive.length})</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                {topFive.map(feed => (
                    <Card
                    key={feed.collarId}
                    className={`cursor-pointer transition-colors ${
                        selectedAnimal === feed.collarId ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    }`}
                    onClick={() => onAnimalClick(feed)}
                    >
                    <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium">{feed.collarId}</div>
                            <div className="text-sm text-muted-foreground">{feed.animalBehaviour || "Unknown"}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant={feed.collarStatus === "ON_ANIMAL" ? "default" : "destructive"} className="text-xs">
                            {feed.collarStatus === "ON_ANIMAL" ? "Safe" : "Alert"}
                            </Badge>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
            </div>
        </div>
    )
}

export default TrackingFilters;