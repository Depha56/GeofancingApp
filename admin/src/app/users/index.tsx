import { UsersTable } from "@/components/users/users-table"
import { useUsers } from "@/hooks/use-users"

export default function UsersPage() {
  const { users, loading } = useUsers();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">User Management</h1>
              <p className="text-muted-foreground">
                Manage user accounts, roles, and permissions for the livestock monitoring system.
              </p>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">Loading users...</div>
          ) : (
            <UsersTable data={ users } />
          )}
        </div>
      </div>
    </div>
  )
}
