import * as React from "react"
import {
  AlertTriangleIcon,
  BatteryLowIcon,
  BellIcon,
  CheckIcon,
  InfoIcon,
  MapPinIcon,
  MoreVerticalIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  WifiOffIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "geofence_breach",
    priority: "critical",
    title: "Geofence Breach Alert",
    message: "COW-003 (Molly) has left the designated safe zone",
    timestamp: "2024-01-15 14:30:25",
    animalId: "COW-003",
    read: false,
    acknowledged: false,
  },
  {
    id: 2,
    type: "low_battery",
    priority: "warning",
    title: "Low Battery Warning",
    message: "COW-005 (Bella) sensor battery is at 45%",
    timestamp: "2024-01-15 13:45:12",
    animalId: "COW-005",
    read: false,
    acknowledged: true,
  },
  {
    id: 3,
    type: "sensor_offline",
    priority: "critical",
    title: "Sensor Offline",
    message: "COW-007 sensor has been offline for 15 minutes",
    timestamp: "2024-01-15 13:15:08",
    animalId: "COW-007",
    read: true,
    acknowledged: false,
  },
  {
    id: 4,
    type: "unusual_activity",
    priority: "info",
    title: "Unusual Activity Detected",
    message: "COW-002 (Daisy) showing irregular movement patterns",
    timestamp: "2024-01-15 12:20:45",
    animalId: "COW-002",
    read: true,
    acknowledged: true,
  },
  {
    id: 5,
    type: "geofence_breach",
    priority: "warning",
    title: "Geofence Breach Alert",
    message: "COW-001 (Bessie) approached restricted area boundary",
    timestamp: "2024-01-15 11:55:33",
    animalId: "COW-001",
    read: true,
    acknowledged: true,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "geofence_breach":
      return <MapPinIcon className="h-4 w-4" />
    case "low_battery":
      return <BatteryLowIcon className="h-4 w-4" />
    case "sensor_offline":
      return <WifiOffIcon className="h-4 w-4" />
    case "unusual_activity":
      return <AlertTriangleIcon className="h-4 w-4" />
    default:
      return <InfoIcon className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-500 text-white"
    case "warning":
      return "bg-orange-500 text-white"
    case "info":
      return "bg-blue-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export function NotificationsPanel() {
  const [selectedNotifications, setSelectedNotifications] = React.useState<number[]>([])
  const [filterPriority, setFilterPriority] = React.useState("all")
  const [filterType, setFilterType] = React.useState("all")
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(false)

  const filteredNotifications = notifications.filter((notification) => {
    if (filterPriority !== "all" && notification.priority !== filterPriority) return false
    if (filterType !== "all" && notification.type !== filterType) return false
    if (showUnreadOnly && notification.read) return false
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length
  const criticalCount = notifications.filter((n) => n.priority === "critical" && !n.acknowledged).length

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-muted-foreground">
              Monitor alerts and system notifications for your livestock tracking system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unread Notifications</CardDescription>
            <CardTitle className="text-2xl font-semibold text-orange-600">{unreadCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Critical Alerts</CardDescription>
            <CardTitle className="text-2xl font-semibold text-red-600">{criticalCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Today</CardDescription>
            <CardTitle className="text-2xl font-semibold">{notifications.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="live" className="px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="live">Live Feed</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notifications..." className="pl-8" />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="geofence_breach">Geofence Breach</SelectItem>
                <SelectItem value="low_battery">Low Battery</SelectItem>
                <SelectItem value="sensor_offline">Sensor Offline</SelectItem>
                <SelectItem value="unusual_activity">Unusual Activity</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch id="unread-only" checked={showUnreadOnly} onCheckedChange={setShowUnreadOnly} />
              <Label htmlFor="unread-only" className="text-sm">
                Unread only
              </Label>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">{selectedNotifications.length} selected</span>
              <Button size="sm" variant="outline">
                Mark as Read
              </Button>
              <Button size="sm" variant="outline">
                Acknowledge
              </Button>
              <Button size="sm" variant="outline">
                Delete
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-colors ${
                  !notification.read ? "bg-blue-50/50 border-blue-200" : ""
                } ${selectedNotifications.includes(notification.id) ? "bg-primary/5 border-primary" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedNotifications([...selectedNotifications, notification.id])
                        } else {
                          setSelectedNotifications(selectedNotifications.filter((id) => id !== notification.id))
                        }
                      }}
                    />
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {notification.animalId}
                        </Badge>
                        {!notification.read && <Badge className="text-xs bg-blue-500">New</Badge>}
                        {notification.acknowledged && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            Ack
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <CheckIcon className="mr-2 h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BellIcon className="mr-2 h-4 w-4" />
                          Acknowledge
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MapPinIcon className="mr-2 h-4 w-4" />
                          View on Map
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View and search through historical notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Historical notifications will be displayed here with advanced filtering and export options.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure notification preferences and alert thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Geofence Breach Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when animals leave safe zones</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Battery Warnings</Label>
                      <p className="text-sm text-muted-foreground">Alert when sensor battery is low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sensor Offline Alerts</Label>
                      <p className="text-sm text-muted-foreground">Notify when sensors go offline</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Unusual Activity Detection</Label>
                      <p className="text-sm text-muted-foreground">Alert for abnormal movement patterns</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Alert Thresholds</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="battery-threshold">Battery Warning Level (%)</Label>
                    <Input id="battery-threshold" type="number" defaultValue="50" />
                  </div>
                  <div>
                    <Label htmlFor="offline-threshold">Offline Alert Delay (minutes)</Label>
                    <Input id="offline-threshold" type="number" defaultValue="10" />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email Notifications</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>SMS Alerts</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Push Notifications</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
