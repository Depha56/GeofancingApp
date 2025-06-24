import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"
import { useUsers } from "@/hooks/use-users"

type CreateUserSheetProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  userToEdit?: any | null
}

export default function CreateUserSheet({ open: controlledOpen, onOpenChange, userToEdit }: CreateUserSheetProps) {
  const isEdit = !!userToEdit
  const [open, setOpen] = useState(false)
  const { addUser, updateUser, fetchUsers, loading } = useUsers()

  // Form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("admin")
  const [status, setStatus] = useState("Active")
  const [password, setPassword] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")

  // Sync form state when editing
  useEffect(() => {
    if (isEdit && userToEdit) {
      setFullName(userToEdit.fullName || "")
      setEmail(userToEdit.email || "")
      setRole(userToEdit.role || "admin")
      setStatus(userToEdit.status || "Active")
      setAddress(userToEdit.address || "")
      setNotes(userToEdit.notes || "")
      setPassword("") // Do not prefill password
      setOpen(true)
    }
  }, [isEdit, userToEdit])

  // Reset form when closed or switching to add mode
  useEffect(() => {
    if (!open && !controlledOpen) {
      setFullName("")
      setEmail("")
      setRole("admin")
      setStatus("Active")
      setPassword("")
      setAddress("")
      setNotes("")
    }
  }, [open, controlledOpen])

  // Handle controlled/uncontrolled open state
  const actualOpen = controlledOpen !== undefined ? controlledOpen : open
  const setActualOpen = onOpenChange || setOpen

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && userToEdit) {
        await updateUser(userToEdit.uid, {
          fullName,
          email,
          role,
          status,
          address,
          notes,
        })
        toast.success("User updated successfully!")
      } else {
        await addUser({
          fullName,
          email,
          role,
          status,
          password,
          address,
          createdAt: new Date().toISOString(),
          phoneNumber: "",
        })
        toast.success("User created successfully!")
      }
      setActualOpen(false)
      await fetchUsers()
    } catch (err: any) {
      toast.error(err.message || (isEdit ? "Failed to update user" : "Failed to create user"))
    }
  }

  return (
    <Sheet open={actualOpen} onOpenChange={setActualOpen}>
      {!isEdit && (
        <SheetTrigger asChild>
          <Button size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Add User</span>
          </Button>
        </SheetTrigger>
      )}
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{isEdit ? "Edit User" : "Create New User"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update user information for the livestock monitoring system"
              : "Add a new user to the livestock monitoring system"}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="flex flex-col gap-3">
            <Label htmlFor="create-name">Full Name *</Label>
            <Input
              id="create-name"
              required
              placeholder="Enter full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="create-email">Email Address *</Label>
            <Input
              id="create-email"
              type="email"
              required
              placeholder="user@farm.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isEdit}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="create-role">Role *</Label>
              <Select
                required
                value={role}
                onValueChange={setRole}
              >
                <SelectTrigger id="create-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="farmer">Farmer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="create-status">Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                defaultValue="Active"
              >
                <SelectTrigger id="create-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {!isEdit && (
            <div className="flex flex-col gap-3">
              <Label htmlFor="create-password">Temporary Password *</Label>
              <Input
                id="create-password"
                type="password"
                required
                placeholder="Enter temporary password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Label htmlFor="create-address">Address</Label>
            <Input
              id="create-address"
              placeholder="Enter address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="create-notes">Notes (Optional)</Label>
            <Input
              id="create-notes"
              placeholder="Additional notes about the user"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className="mt-auto flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update User" : "Create User"}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}