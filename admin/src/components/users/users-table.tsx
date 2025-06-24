import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ClockIcon,
  ColumnsIcon,
  MoreVerticalIcon,
  SearchIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UserCellViewer from "./user-cell-view"
import CreateUserSheet from "./create-user-sheet"
import { AdminUserType } from "@/hooks/use-auth"
import { useUsers } from "@/hooks/use-users"

export function UsersTable({ data: initialData }: { data: AdminUserType[] }) {
  const { deleteUser, updateUser, resetPassword } = useUsers()
  const [data, setData] = React.useState(() => initialData)
  const [dialogAction, setDialogAction] = React.useState<{
    type: "delete" | "toggle-status" | "change-role" | "reset-password"
    user: AdminUserType
  } | null>(null)
  const [newRole, setNewRole] = React.useState<"admin" | "farmer" | string>("")

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const handleToggleStatus = async () => {
    if (!dialogAction || dialogAction.type !== "toggle-status") return
    const newStatus = dialogAction.user?.status === "Active" ? "Inactive" : "Active"
    try {
      await updateUser(dialogAction.user?.uid || "", { status: newStatus })
      toast.success(`User status changed to ${newStatus}`)
    } catch (error) {
      toast.error("Failed to update user status.")
    } finally {
      setDialogAction(null)
    }
  }

  const handleDeleteUser = async () => {
    if (!dialogAction || dialogAction.type !== "delete") return
    try {
      await deleteUser(dialogAction.user?.uid || "")
      toast.success("User deleted successfully.")
    } catch (error) {
      toast.error("Failed to delete user.")
    } finally {
      setDialogAction(null)
    }
  }

  const handleChangeRole = async () => {
    if (!dialogAction || dialogAction.type !== "change-role" || !newRole) return
    try {
      await updateUser(dialogAction.user?.uid || "", { role: newRole })
      toast.success("User role updated successfully.")
    } catch (error) {
      toast.error("Failed to update user role.")
    } finally {
      setDialogAction(null)
      setNewRole("")
    }
  }

  const handleResetPassword = async () => {
    if (!dialogAction || dialogAction.type !== "reset-password") return
    try {
      await resetPassword(dialogAction.user?.email || "")
      toast.success("Password reset email sent.")
    } catch (error) {
      toast.error("Failed to send password reset email.")
    } finally {
      setDialogAction(null)
    }
  }

  const [editUser, setEditUser] = React.useState<any | null>(null)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns: ColumnDef<AdminUserType>[] = [
    {
        id: "select",
        header: ({ table }) => (
        <div className="flex items-center justify-center">
            <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            />
        </div>
        ),
        cell: ({ row }) => (
        <div className="flex items-center justify-center">
            <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            />
        </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
        return <UserCellViewer user={row.original} />
        },
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="text-muted-foreground">{row.original?.email}</div>,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
        <Badge
            variant="outline"
            className={`px-2 py-1 ${
            row.original?.role === "admin"
                ? "bg-red-50 text-red-700 border-red-200"
                : row.original?.role === "farmer"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
        >
            {row.original?.role}
        </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
        <Badge
            variant="outline"
            className={`flex gap-1 px-2 py-1 [&_svg]:size-3 ${
            row.original?.status === "Active"
                ? "bg-green-50 text-green-700 border-green-200"
                : row.original?.status === "Inactive"
                ? "bg-gray-50 text-gray-700 border-gray-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
            }`}
        >
            {row.original?.status === "Active" ? (
            <CheckCircle2Icon />
            ) : row.original?.status === "Inactive" ? (
            <UserXIcon />
            ) : (
            <ClockIcon />
            )}
            {row.original?.status}
        </Badge>
        ),
    },
    {
        accessorKey: "lastLogin",
        header: "Last Login",
        cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
            {row.original?.lastLogin === "Never" ? (
            <span className="text-orange-600">Never</span>
            ) : (
            new Date(row.original?.lastLogin || "").toLocaleDateString()
            )}
        </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{new Date(row.original?.createdAt || "").toLocaleDateString()}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
                <MoreVerticalIcon />
                <span className="sr-only">Open menu</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setEditUser(row.original)}>Edit User</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDialogAction({ type: "change-role", user: row.original })}>
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDialogAction({ type: "reset-password", user: row.original })}>
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={row.original?.status === "Active" ? "text-orange-600" : "text-green-600"}
              onClick={() => setDialogAction({ type: "toggle-status", user: row.original })}
            >
              {row.original?.status === "Active" ? (
                <>
                  <UserXIcon className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheckIcon className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setDialogAction({ type: "delete", user: row.original })}
            >
              Delete User
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        ),
    },
    ]

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row?.uid || "",
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex w-full flex-col justify-start gap-6">
      <AlertDialog open={!!dialogAction} onOpenChange={() => setDialogAction(null)}>
        {dialogAction?.type === "delete" && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account for{" "}
                <strong>{dialogAction.user?.fullName}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}

        {dialogAction?.type === "toggle-status" && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {dialogAction.user?.status === "Active" ? "deactivate" : "activate"} the user{" "}
                <strong>{dialogAction.user?.fullName}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleStatus}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}

        {dialogAction?.type === "reset-password" && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Password Reset</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send a password reset link to <strong>{dialogAction.user?.email}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetPassword}>Send Link</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}

        {dialogAction?.type === "change-role" && (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change Role for {dialogAction.user?.fullName}</AlertDialogTitle>
              <AlertDialogDescription>
                Select a new role for the user. This will change their permissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Select onValueChange={setNewRole} defaultValue={dialogAction.user?.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="farmer">Farmer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setNewRole("")}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleChangeRole}>Save changes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select
            value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="farmer">Farmer</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {editUser ? (
            <CreateUserSheet
            open={!!editUser}
            onOpenChange={(open) => {
                if (!open) setEditUser(null)
            }}
            userToEdit={editUser}
            />
        ) : (
            <CreateUserSheet />
        )}

        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
