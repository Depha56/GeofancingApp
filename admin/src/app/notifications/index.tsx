import { NotificationsPanel } from "@/components/notifications-panel";

export default function NotificationsPage() {
  return (
    <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
        <NotificationsPanel />
        </div>
    </div>
  )
}
