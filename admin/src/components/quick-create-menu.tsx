"use client"

import * as React from "react"
import { MapPinIcon, PlusCircleIcon, UserPlusIcon, BellIcon, TagIcon, SettingsIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Quick Add Animal Dialog
function QuickAddAnimalDialog() {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Animal added successfully!")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <TagIcon className="mr-2 h-4 w-4" />
          Add Animal
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
          <DialogDescription>Quickly add a new animal to the monitoring system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animal-id" className="text-right">
                Animal ID
              </Label>
              <Input id="animal-id" placeholder="COW-001" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="animal-name" className="text-right">
                Name
              </Label>
              <Input id="animal-name" placeholder="Bessie" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag-number" className="text-right">
                Tag Number
              </Label>
              <Input id="tag-number" placeholder="A001" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sensor-id" className="text-right">
                Sensor ID
              </Label>
              <Input id="sensor-id" placeholder="SEN-001" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="breed" className="text-right">
                Breed
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holstein">Holstein</SelectItem>
                  <SelectItem value="angus">Angus</SelectItem>
                  <SelectItem value="hereford">Hereford</SelectItem>
                  <SelectItem value="jersey">Jersey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Animal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Quick Add Geofence Dialog
function QuickAddGeofenceDialog() {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Geofence created successfully!")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <MapPinIcon className="mr-2 h-4 w-4" />
          Add Geofence
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Geofence</DialogTitle>
          <DialogDescription>Quickly create a new virtual boundary for livestock monitoring.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fence-name" className="text-right">
                Name
              </Label>
              <Input id="fence-name" placeholder="Pasture A" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fence-type" className="text-right">
                Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safe">Safe Zone</SelectItem>
                  <SelectItem value="restricted">Restricted Area</SelectItem>
                  <SelectItem value="water">Water Station</SelectItem>
                  <SelectItem value="feeding">Feeding Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fence-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="fence-description"
                placeholder="Brief description of the geofence area"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Geofence</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Quick Add Alert Rule Dialog
function QuickAddAlertDialog() {
  const [open, setOpen] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Alert rule created successfully!")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <BellIcon className="mr-2 h-4 w-4" />
          Add Alert Rule
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
          <DialogDescription>Set up a new automated alert rule for monitoring conditions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rule-name" className="text-right">
                Rule Name
              </Label>
              <Input id="rule-name" placeholder="Low Battery Alert" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alert-type" className="text-right">
                Alert Type
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="battery">Battery Level</SelectItem>
                  <SelectItem value="geofence">Geofence Breach</SelectItem>
                  <SelectItem value="offline">Sensor Offline</SelectItem>
                  <SelectItem value="activity">Unusual Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Threshold
              </Label>
              <Input id="threshold" placeholder="20%" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Alert Rule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function QuickCreateMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="min-w-8 mb-2 w-full bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground">
          <PlusCircleIcon />
          <span>Quick Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <QuickAddAnimalDialog />
        <DropdownMenuItem>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Add User
        </DropdownMenuItem>
        <QuickAddGeofenceDialog />
        <QuickAddAlertDialog />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SettingsIcon className="mr-2 h-4 w-4" />
          System Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
