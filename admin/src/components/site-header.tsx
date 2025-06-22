import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const getPageTitle = () => {
    if (typeof window === "undefined") return "Dashboard"

    const path = window.location.pathname
    if (path.includes("users")) return "User Management"
    if (path.includes("tracking")) return "Live Tracking"
    if (path.includes("notifications")) return "Notifications"
    if (path.includes("settings")) return "Settings"
    return "Dashboard"
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  )
}
