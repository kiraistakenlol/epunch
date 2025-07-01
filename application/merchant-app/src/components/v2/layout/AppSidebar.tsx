import * as React from "react"
import { 
  QrCode,
  CreditCard,
  Palette,
  BarChart3,
  Users,
  Settings,
  Home
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { V2_ROUTES } from "@/lib/routes";

const navigationItems = [
  {
    title: "Dashboard",
    url: V2_ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: "Scanner",
    url: V2_ROUTES.SCANNER,
    icon: QrCode,
  },
  {
    title: "Loyalty Programs",
    url: V2_ROUTES.LOYALTY_PROGRAMS,
    icon: CreditCard,
  },
  {
    title: "Design",
    url: V2_ROUTES.DESIGN,
    icon: Palette,
  },
  {
    title: "Analytics", 
    url: V2_ROUTES.ANALYTICS,
    icon: BarChart3,
  },
]

const adminItems = [
  {
    title: "User Management",
    url: V2_ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    title: "Settings",
    url: V2_ROUTES.ADMIN_SETTINGS, 
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <QrCode className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">ePunch</span>
            <span className="text-xs text-muted-foreground">Merchant Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* User menu will go here */}
      </SidebarFooter>
    </Sidebar>
  )
} 