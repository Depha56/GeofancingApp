"use client"
import { DatabaseIcon, MapPinIcon, SaveIcon, ServerIcon, SettingsIcon, UserIcon, WifiIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsPanel() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-muted-foreground">
              Configure system settings, sensors, and preferences for your livestock monitoring system.
            </p>
          </div>
          <Button>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="system" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="sensors">Sensors</TabsTrigger>
            <TabsTrigger value="geofences">Geofences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ServerIcon className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>Configure core system settings and API connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="system-name">System Name</Label>
                    <Input id="system-name" defaultValue="Livestock Monitoring System" />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-5">UTC-5 (Eastern)</SelectItem>
                        <SelectItem value="utc-6">UTC-6 (Central)</SelectItem>
                        <SelectItem value="utc-7">UTC-7 (Mountain)</SelectItem>
                        <SelectItem value="utc-8">UTC-8 (Pacific)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">ThingSpeak API Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="thingspeak-url">ThingSpeak URL</Label>
                      <Input id="thingspeak-url" defaultValue="https://api.thingspeak.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="channel-id">Channel ID</Label>
                        <Input id="channel-id" defaultValue="123456" />
                      </div>
                      <div>
                        <Label htmlFor="api-key">API Key</Label>
                        <Input id="api-key" type="password" defaultValue="XXXXXXXXXXXXXXXX" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="update-interval">Data Update Interval (seconds)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger id="update-interval">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">System Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-refresh Dashboard</Label>
                        <p className="text-sm text-muted-foreground">Automatically refresh data on dashboard</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Use dark theme for the interface</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sound Alerts</Label>
                        <p className="text-sm text-muted-foreground">Play sound for critical alerts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WifiIcon className="h-5 w-5" />
                  Sensor Management
                </CardTitle>
                <CardDescription>Configure and manage livestock tracking sensors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Sensor Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gps-accuracy">GPS Accuracy (meters)</Label>
                      <Select defaultValue="5">
                        <SelectTrigger id="gps-accuracy">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 meter (High)</SelectItem>
                          <SelectItem value="5">5 meters (Medium)</SelectItem>
                          <SelectItem value="10">10 meters (Low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="transmission-interval">Transmission Interval</Label>
                      <Select defaultValue="60">
                        <SelectTrigger id="transmission-interval">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                          <SelectItem value="600">10 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Battery Management</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="low-battery">Low Battery Threshold (%)</Label>
                        <Input id="low-battery" type="number" defaultValue="20" />
                      </div>
                      <div>
                        <Label htmlFor="critical-battery">Critical Battery Threshold (%)</Label>
                        <Input id="critical-battery" type="number" defaultValue="10" />
                      </div>
                      <div>
                        <Label htmlFor="power-save">Power Save Mode Trigger (%)</Label>
                        <Input id="power-save" type="number" defaultValue="30" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic Power Saving</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce transmission frequency when battery is low
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Accelerometer Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sensitivity">Movement Sensitivity</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="sensitivity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="activity-threshold">Activity Detection Threshold</Label>
                      <Input id="activity-threshold" type="number" defaultValue="0.5" step="0.1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geofences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Geofence Configuration
                </CardTitle>
                <CardDescription>Manage virtual boundaries and alert settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Default Geofence Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="breach-tolerance">Breach Tolerance (meters)</Label>
                      <Input id="breach-tolerance" type="number" defaultValue="10" />
                    </div>
                    <div>
                      <Label htmlFor="alert-delay">Alert Delay (seconds)</Label>
                      <Input id="alert-delay" type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Fence Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Safe Zone Alerts</Label>
                        <p className="text-sm text-muted-foreground">Alert when animals leave safe zones</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Restricted Area Alerts</Label>
                        <p className="text-sm text-muted-foreground">Alert when animals enter restricted areas</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Water Station Monitoring</Label>
                        <p className="text-sm text-muted-foreground">Track time spent at water stations</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Auto-Fence Creation</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable Auto-Fence</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically create fences based on animal patterns
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pattern-days">Pattern Analysis Days</Label>
                        <Input id="pattern-days" type="number" defaultValue="7" />
                      </div>
                      <div>
                        <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
                        <Input id="confidence-threshold" type="number" defaultValue="80" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure how and when you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Email Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email-address">Primary Email Address</Label>
                      <Input id="email-address" type="email" defaultValue="admin@farm.com" />
                    </div>
                    <div>
                      <Label htmlFor="backup-email">Backup Email Address</Label>
                      <Input id="backup-email" type="email" placeholder="backup@farm.com" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">SMS Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input id="phone-number" type="tel" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                      </div>
                      <Switch />
                    </div>
                    <div>
                      <Label htmlFor="sms-priority">SMS Priority Level</Label>
                      <Select defaultValue="critical">
                        <SelectTrigger id="sms-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Alerts</SelectItem>
                          <SelectItem value="warning">Warning & Critical</SelectItem>
                          <SelectItem value="critical">Critical Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Alert Scheduling</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                        <Input id="quiet-start" type="time" defaultValue="22:00" />
                      </div>
                      <div>
                        <Label htmlFor="quiet-end">Quiet Hours End</Label>
                        <Input id="quiet-end" type="time" defaultValue="06:00" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Weekend Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts on weekends</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DatabaseIcon className="h-5 w-5" />
                  Data Management
                </CardTitle>
                <CardDescription>Configure data retention, backup, and export settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Data Retention</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location-retention">Location Data Retention (days)</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="location-retention">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="alert-retention">Alert History Retention (days)</Label>
                      <Select defaultValue="365">
                        <SelectTrigger id="alert-retention">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Backup Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic Backups</Label>
                        <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="backup-frequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="backup-location">Backup Location</Label>
                      <Input id="backup-location" defaultValue="/backups/livestock-data" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Export Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="export-format">Default Export Format</Label>
                      <Select defaultValue="csv">
                        <SelectTrigger id="export-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="xlsx">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Export All Data</Button>
                      <Button variant="outline">Export Reports</Button>
                      <Button variant="outline">Export Settings</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account information and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Profile Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="John" />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="Smith" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="account-email">Email Address</Label>
                    <Input id="account-email" type="email" defaultValue="john.smith@farm.com" />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Security</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">API Access</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="api-key-display">API Key</Label>
                      <div className="flex gap-2">
                        <Input id="api-key-display" type="password" defaultValue="sk_live_xxxxxxxxxxxxxxxx" readOnly />
                        <Button variant="outline">Regenerate</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>API Access Enabled</Label>
                        <p className="text-sm text-muted-foreground">Allow external API access</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
