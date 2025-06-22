import type * as React from "react"
import {
  ArrowUpCircleIcon,
  BellIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/users/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useAuth } from "@/hooks/use-auth"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Users",
      url: "/users",
      icon: UsersIcon,
    },
    {
      title: "Tracking",
      url: "/tracking",
      icon: MapPinIcon,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: BellIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { user } = useAuth();

    return (
    <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent">
                        <p>
                            <ArrowUpCircleIcon className="h-5 w-5" />
                            <span className="text-base font-semibold">Livestock Monitor</span>
                        </p>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <NavMain items={data.navMain} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
            <NavUser user={{
                email: user?.email || "",
                name : user?.fullName || "",
                avatar: user?.photoURL || ""
            }} />
        </SidebarFooter>
    </Sidebar>
    )
}
