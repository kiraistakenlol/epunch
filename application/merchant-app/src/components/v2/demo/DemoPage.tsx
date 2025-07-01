import { AppShell } from '../layout/AppShell'
import { PageContainer } from '../layout/PageContainer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DemoPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Demo', isCurrentPage: true }
  ]

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <PageContainer>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Demo Page</h1>
            <p className="text-muted-foreground">
              Testing the new shadcn/ui layout system with AppShell component
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>🎉 Migration Success!</CardTitle>
                <CardDescription>
                  The new layout system is working
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  We've successfully migrated to shadcn/ui with:
                </p>
                <ul className="text-sm space-y-1">
                  <li>✅ SidebarProvider system</li>
                  <li>✅ Built-in breadcrumbs</li>
                  <li>✅ Professional Slate theme</li>
                  <li>✅ Responsive design</li>
                  <li>✅ 90% less custom code</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 What's Next</CardTitle>
                <CardDescription>
                  Continue the migration process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Next steps in the migration:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Build form components</li>
                  <li>• Create scanner interface</li>
                  <li>• Design editor components</li>
                  <li>• Data display components</li>
                  <li>• Migration cleanup</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Benefits</CardTitle>
                <CardDescription>
                  Why this migration matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Technical improvements:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Better accessibility</li>
                  <li>• Smaller bundle size</li>
                  <li>• Type safety</li>
                  <li>• Modern patterns</li>
                  <li>• Easy customization</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button>Primary Action</Button>
            <Button variant="outline">Secondary Action</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  )
} 