import React from 'react'
import { useLocation } from 'react-router-dom'
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { AppSidebar } from './AppSidebar'
import { UserMenu } from './UserMenu'
import { 
  QrCode,
  CreditCard,
  Palette,
  BarChart3,
  Users,
  Settings,
  Home
} from "lucide-react"
import { ROUTES } from '@/lib/cn'

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
    title: "User Management",
    url: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    title: "Settings",
    url: ROUTES.ADMIN_SETTINGS, 
    icon: Settings,
  },
]

const allNavigationItems = [...navigationItems, ...adminItems]

function useAutoBreadcrumbs() {
  const location = useLocation()
  
  const breadcrumbs = React.useMemo(() => {
    const path = location.pathname
    const crumbs = []
    
    // Find matching navigation item
    const matchingItem = allNavigationItems.find(item => {
      if (item.url === path) return true
      // Handle exact matches first
      return false
    }) || allNavigationItems.find(item => {
      // Handle dynamic routes and nested paths
      if (path.startsWith(item.url + '/')) return true
      return false
    })
    
    if (matchingItem) {
      // Handle nested routes
      if (path.includes('/create')) {
        const parentItem = allNavigationItems.find(item => path.startsWith(item.url) && item.url !== path)
        if (parentItem) {
          crumbs.push({ href: parentItem.url, label: parentItem.title })
          crumbs.push({ label: 'Create', isCurrentPage: true })
        } else {
          crumbs.push({ label: matchingItem.title, isCurrentPage: true })
        }
      } else if (path.includes('/edit')) {
        const parentItem = allNavigationItems.find(item => path.startsWith(item.url) && item.url !== path)
        if (parentItem) {
          crumbs.push({ href: parentItem.url, label: parentItem.title })
          crumbs.push({ label: 'Edit', isCurrentPage: true })
        } else {
          crumbs.push({ label: matchingItem.title, isCurrentPage: true })
        }
      } else {
        crumbs.push({ label: matchingItem.title, isCurrentPage: true })
      }
    }
    
    return crumbs
  }, [location.pathname])
  
  return breadcrumbs
}

interface AppShellProps {
  children: React.ReactNode
  breadcrumbs?: Array<{
    href?: string
    label: string
    isCurrentPage?: boolean
  }>
}

export function AppShell({ children, breadcrumbs }: AppShellProps) {
  const autoBreadcrumbs = useAutoBreadcrumbs()
  const finalBreadcrumbs = breadcrumbs || autoBreadcrumbs

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {finalBreadcrumbs && finalBreadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  {finalBreadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {crumb.isCurrentPage ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href || '#'}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < finalBreadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          
          <UserMenu />
        </header>
        <main className="flex-1 p-2">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
} 