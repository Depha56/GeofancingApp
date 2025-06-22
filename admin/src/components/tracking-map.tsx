"use client"

import * as React from "react"
import {
  ActivityIcon,
  BatteryIcon,
  LayersIcon,
  MapPinIcon,
  RefreshCwIcon,
  SearchIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"

// Mock data for animals
const animals = [
  {
    id: "COW-001",
    name: "Bessie",
    x: 45,
    y: 30,
    status: "grazing",
    battery: 85,
    lastUpdate: "2 min ago",
    inFence: true,
  },
  {
    id: "COW-002",
    name: "Daisy",
    x: 60,
    y: 45,
    status: "moving",
    battery: 92,
    lastUpdate: "1 min ago",
    inFence: true,
  },
  {
    id: "COW-003",
    name: "Molly",
    x: 85,
    y: 25,
    status: "resting",
    battery: 78,
    lastUpdate: "30 sec ago",
    inFence: false,
  },
  {
    id: "COW-004",
    name: "Luna",
    x: 25,
    y: 60,
    status: "drinking",
    battery: 67,
    lastUpdate: "3 min ago",
    inFence: true,
  },
  {
    id: "COW-005",
    name: "Bella",
    x: 70,
    y: 70,
    status: "grazing",
    battery: 45,
    lastUpdate: "1 min ago",
    inFence: true,
  },
]

// Mock geofences
const geofences = [
  { id: 1, name: "Pasture A", x: 20, y: 20, width: 40, height: 30, type: "safe" },
  { id: 2, name: "Pasture B", x: 15, y: 55, width: 35, height: 25, type: "safe" },
  { id: 3, name: "Water Station", x: 55, y: 40, width: 15, height: 15, type: "water" },
  { id: 4, name: "Restricted Area", x: 75, y: 15, width: 20, height: 20, type: "restricted" },
]

export function TrackingMap() {
  const [selectedAnimal, setSelectedAnimal] = React.useState<string | null>(null)
  const [showTrails, setShowTrails] = React.useState(false)
  const [showHeatmap, setShowHeatmap] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState("all")

  const filteredAnimals = animals.filter((animal) => filterStatus === "all" || animal.status === filterStatus)

  return (
    <div className="flex h-full">
      {/* Filters Sidebar */}
      <div className="w-80 border-r bg-muted/30 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tracking Controls</h3>
            <div className="space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search animals..." className="pl-8" />
              </div>
              <div>
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="grazing">Grazing</SelectItem>
                    <SelectItem value="moving">Moving</SelectItem>
                    <SelectItem value="resting">Resting</SelectItem>
                    <SelectItem value="drinking">Drinking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Map Layers</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="trails">Movement Trails</Label>
                <Switch id="trails" checked={showTrails} onCheckedChange={setShowTrails} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="heatmap">Activity Heatmap</Label>
                <Switch id="heatmap" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Live Animals ({filteredAnimals.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAnimals.map((animal) => (
                <Card
                  key={animal.id}
                  className={`cursor-pointer transition-colors ${
                    selectedAnimal === animal.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedAnimal(animal.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{animal.name}</div>
                        <div className="text-sm text-muted-foreground">{animal.id}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={animal.inFence ? "default" : "destructive"} className="text-xs">
                          {animal.inFence ? "Safe" : "Alert"}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BatteryIcon className="h-3 w-3" />
                          {animal.battery}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Button size="icon" variant="outline" className="bg-background">
            <ZoomInIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="bg-background">
            <ZoomOutIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="bg-background">
            <LayersIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="bg-background">
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Mock Map */}
        <div className="w-full h-full bg-green-50 relative overflow-hidden">
          {/* Grid lines for reference */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Geofences */}
          {geofences.map((fence) => (
            <div
              key={fence.id}
              className={`absolute border-2 border-dashed rounded-lg ${
                fence.type === "safe"
                  ? "border-green-500 bg-green-100/30"
                  : fence.type === "water"
                    ? "border-blue-500 bg-blue-100/30"
                    : "border-red-500 bg-red-100/30"
              }`}
              style={{
                left: `${fence.x}%`,
                top: `${fence.y}%`,
                width: `${fence.width}%`,
                height: `${fence.height}%`,
              }}
            >
              <div className="absolute -top-6 left-2 text-xs font-medium bg-background px-2 py-1 rounded border">
                {fence.name}
              </div>
            </div>
          ))}

          {/* Movement trails (if enabled) */}
          {showTrails && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {filteredAnimals.map((animal, index) => (
                <path
                  key={animal.id}
                  d={`M ${animal.x - 10}% ${animal.y + 5}% Q ${animal.x + 5}% ${animal.y - 10}% ${animal.x}% ${animal.y}%`}
                  stroke={animal.inFence ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              ))}
            </svg>
          )}

          {/* Animals */}
          {filteredAnimals.map((animal) => (
            <Sheet key={animal.id}>
              <SheetTrigger asChild>
                <div
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                    selectedAnimal === animal.id ? "scale-125 z-20" : "z-10"
                  }`}
                  style={{ left: `${animal.x}%`, top: `${animal.y}%` }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      animal.inFence ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background px-2 py-1 rounded border text-xs font-medium whitespace-nowrap">
                    {animal.name}
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    {animal.name} ({animal.id})
                  </SheetTitle>
                  <SheetDescription>Real-time animal tracking information</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Badge className="mt-1 capitalize">{animal.status}</Badge>
                    </div>
                    <div>
                      <Label>Location Status</Label>
                      <Badge variant={animal.inFence ? "default" : "destructive"} className="mt-1">
                        {animal.inFence ? "Inside Fence" : "Outside Fence"}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Battery Level</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <BatteryIcon className="h-4 w-4" />
                        <span>{animal.battery}%</span>
                      </div>
                    </div>
                    <div>
                      <Label>Last Update</Label>
                      <div className="text-sm text-muted-foreground mt-1">{animal.lastUpdate}</div>
                    </div>
                  </div>
                  <div>
                    <Label>Coordinates</Label>
                    <div className="text-sm text-muted-foreground mt-1">
                      Lat: 40.{animal.x}°, Lng: -74.{animal.y}°
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button className="w-full">
                      <MapPinIcon className="mr-2 h-4 w-4" />
                      Center on Map
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ActivityIcon className="mr-2 h-4 w-4" />
                      View Activity History
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ))}

          {/* Heatmap overlay (if enabled) */}
          {showHeatmap && (
            <div className="absolute inset-0 pointer-events-none">
              {filteredAnimals.map((animal) => (
                <div
                  key={`heatmap-${animal.id}`}
                  className="absolute w-20 h-20 bg-red-500/20 rounded-full blur-sm"
                  style={{
                    left: `${animal.x - 5}%`,
                    top: `${animal.y - 5}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-background border rounded-lg p-3 space-y-2">
          <h4 className="font-medium text-sm">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white" />
              <span>Animal (Safe)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white" />
              <span>Animal (Alert)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 border-2 border-dashed border-green-500 bg-green-100/30" />
              <span>Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 border-2 border-dashed border-red-500 bg-red-100/30" />
              <span>Restricted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
