import * as React from "react"
import { 
  QrCode,
  CreditCard,
  Palette,
  BarChart3,
  Users,
  Settings,
  Home,
  HelpCircle
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
import { ROUTES } from "@/lib/cn"
import { logoUrl } from 'e-punch-common-ui'
import { useAppSelector } from '@/store/hooks'
import { ROLES } from 'e-punch-common-core'

const navigationItems = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: "Scanner",
    url: ROUTES.SCANNER,
    icon: QrCode,
  },
  {
    title: "Loyalty Programs",
    url: ROUTES.LOYALTY_PROGRAMS,
    icon: CreditCard,
  },
  {
    title: "Design",
    url: ROUTES.DESIGN,
    icon: Palette,
  },
  {
    title: "Welcome QR",
    url: ROUTES.WELCOME_QR,
    icon: QrCode,
  },
  {
    title: "Analytics", 
    url: ROUTES.ANALYTICS,
    icon: BarChart3,
  },
]

const adminItems = [
  {
    title: "Customers",
    url: ROUTES.CUSTOMERS,
    icon: Users,
  },
  {
    title: "Settings",
    url: ROUTES.ADMIN_SETTINGS, 
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { merchant } = useAppSelector((state) => state.merchant)
  const { user } = useAppSelector((state) => state.auth)
  
  const visibleNavigationItems = user?.role === ROLES.STAFF 
    ? navigationItems.filter(item => item.title === "Scanner")
    : navigationItems;
  
  const onboardingItem = merchant?.slug ? {
    title: "How it works",
    url: `/onboarding/${merchant.slug}`,
    icon: HelpCircle,
  } : null;
  
  return (
    <Sidebar variant="inset" {...props} >
      <SidebarHeader className="border-b border-border pb-2 pt-4">
        <div className="flex items-center">
          <img 
            src={logoUrl} 
            alt="ePunch Logo" 
            className="h-12 w-auto object-contain brightness-0"
          />
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-foreground">ePunch</span>
            <span className="text-xs text-muted-foreground">
              {merchant?.name}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {onboardingItem && (
                <SidebarMenuItem key={onboardingItem.title}>
                  <SidebarMenuButton asChild>
                    <a href={onboardingItem.url}>
                      <onboardingItem.icon className="h-4 w-4" />
                      <span>{onboardingItem.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user?.role === ROLES.ADMIN && (
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
        )}
      </SidebarContent>
      <SidebarFooter>
        {/* User menu will go here */}
      </SidebarFooter>
    </Sidebar>
  )
} 