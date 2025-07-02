import React from 'react'
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { AppSidebar } from './AppSidebar'
import { UserMenu } from './UserMenu'

interface AppShellProps {
  children: React.ReactNode
  breadcrumbs?: Array<{
    href?: string
    label: string
    isCurrentPage?: boolean
  }>
}

export function AppShell({ children, breadcrumbs }: AppShellProps) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumbs && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
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
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
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