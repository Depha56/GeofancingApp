import { Outlet } from "react-router-dom";
import ProtectedRoute from './protected-route';
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { SiteHeader } from "../site-header";

const DashboardLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="h-[calc(100vh-67px)] overflow-y-auto">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    </ProtectedRoute>
  )
}

export default DashboardLayout