import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QrCode, Camera, Smartphone } from 'lucide-react'
import { ScannerInterface } from '../ScannerInterface'

export const ScannerDemo: React.FC = () => {
  const [demoMode, setDemoMode] = useState<'camera' | 'mockup'>('mockup')

  const generateMockQR = (type: 'user' | 'punchcard') => {
    const mockData = type === 'user' 
      ? { type: 'user_id', user_id: 'demo-user-12345' }
      : { type: 'redemption_punch_card_id', punch_card_id: 'demo-card-67890' }
    
    return JSON.stringify(mockData)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scanner System Demo</h1>
        <p className="text-muted-foreground">
          Professional QR code scanning system with camera integration, state management, and error handling
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scanner">Live Scanner</TabsTrigger>
          <TabsTrigger value="states">State Demo</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scanner System Overview</CardTitle>
              <CardDescription>
                Complete QR code scanning solution with state management and professional UI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Camera Features
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time QR code detection</li>
                    <li>• Environment camera (rear-facing)</li>
                    <li>• Permission handling & error states</li>
                    <li>• Professional scanning overlay</li>
                    <li>• Automatic stream cleanup</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <QrCode className="h-4 w-4 mr-2" />
                    QR Code Types
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Customer QR</Badge>
                      <span className="text-sm">User identification for punches</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Punch Card QR</Badge>
                      <span className="text-sm">Redemption cards</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live QR Scanner</CardTitle>
              <CardDescription>
                Real camera integration - requires camera permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScannerInterface 
                title="Live Demo Scanner"
                description="Scan any QR code to see the system in action"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer QR Flow</CardTitle>
                <CardDescription>Simulated customer scan result</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                    {generateMockQR('user')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This QR code contains a user ID for punch recording
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Punch Card QR Flow</CardTitle>
                <CardDescription>Simulated punch card scan result</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                    {generateMockQR('punchcard')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This QR code contains a punch card ID for redemption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scanner System Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">✅ Completed Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Professional camera interface with scanning overlay</li>
                    <li>• Real-time QR code detection with jsQR</li>
                    <li>• State management with useScanner hook</li>
                    <li>• Customer QR scan results with loyalty program selection</li>
                    <li>• Punch card QR scan results with progress display</li>
                    <li>• Error handling and permission management</li>
                    <li>• Toast notifications for feedback</li>
                    <li>• Professional UI with shadcn/ui components</li>
                    <li>• TypeScript support throughout</li>
                    <li>• Mobile responsive design</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🎯 Scanner Components</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• ScannerInterface - Main orchestrator</li>
                    <li>• QRScanner - Camera integration wrapper</li>
                    <li>• ScannerCamera - Core camera component</li>
                    <li>• CustomerScanResult - User QR results</li>
                    <li>• PunchCardScanResult - Card QR results</li>
                    <li>• useScanner - State management hook</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 