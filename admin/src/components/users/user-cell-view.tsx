import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { userSchema } from "./users-table"

export default function UserCellViewer({ user }: { user: z.infer<typeof userSchema> }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="w-fit px-0 text-left text-foreground">
          {user.name}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{user.name}</SheetTitle>
          <SheetDescription>User account details and permissions</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user.email} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue={user.role}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={user.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="view_livestock" defaultChecked={user.permissions.includes("view_livestock")} />
                  <Label htmlFor="view_livestock" className="text-sm">
                    View Livestock
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manage_alerts" defaultChecked={user.permissions.includes("manage_alerts")} />
                  <Label htmlFor="manage_alerts" className="text-sm">
                    Manage Alerts
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manage_geofences" defaultChecked={user.permissions.includes("manage_geofences")} />
                  <Label htmlFor="manage_geofences" className="text-sm">
                    Manage Geofences
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="full_access" defaultChecked={user.permissions.includes("full_access")} />
                  <Label htmlFor="full_access" className="text-sm">
                    Full Access
                  </Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label>Last Login</Label>
                <div className="text-sm text-muted-foreground">{user.lastLogin}</div>
              </div>
              <div className="flex flex-col gap-3">
                <Label>Created</Label>
                <div className="text-sm text-muted-foreground">{user.createdAt}</div>
              </div>
            </div>
          </form>
        </div>
        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
          <Button className="w-full">Save Changes</Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}