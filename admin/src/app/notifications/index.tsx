import { NotificationsPanel } from "@/components/notifications-panel";
import { NotificationsProvider } from "@/hooks/use-notifications";

export default function NotificationsPage() {
  return (
    <NotificationsProvider>
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
            <NotificationsPanel />
            </div>
        </div>
    </NotificationsProvider>
  )
}
