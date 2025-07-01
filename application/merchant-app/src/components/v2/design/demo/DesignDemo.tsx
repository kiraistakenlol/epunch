import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, Image, Shapes, Eye, Sparkles } from 'lucide-react'
import { DesignEditor } from '../DesignEditor'

export const DesignDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle className="text-3xl">Design System Demo</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Complete punch card customization with color picker, logo upload, and icon selection
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Phase 7 ✅
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Complete Editor</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Color Picker</span>
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Logo Upload</span>
            </TabsTrigger>
            <TabsTrigger value="icons" className="flex items-center space-x-2">
              <Shapes className="h-4 w-4" />
              <span>Icon Selector</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Complete Design Editor */}
          <TabsContent value="editor" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Design Editor</CardTitle>
                <CardDescription>
                  Full-featured design editor with color picker, logo upload, icon selection, and live preview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DesignEditor />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Individual Component Demos */}
          <TabsContent value="colors" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Picker Component</CardTitle>
                <CardDescription>
                  Advanced color picker with presets and custom color selection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 12 professional color presets (Coffee, Ocean, Forest, etc.)</li>
                    <li>• Custom color picker with hex input</li>
                    <li>• Visual color swatches with live preview</li>
                    <li>• Current color display with applied badge</li>
                    <li>• Reset to default functionality</li>
                    <li>• Responsive grid layout</li>
                  </ul>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Try it:</strong> Switch to the "Complete Editor" tab and click on the "Colors" section
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logo" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo Upload Component</CardTitle>
                <CardDescription>
                  Professional file upload with drag & drop, preview, and progress tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Drag & drop file upload interface</li>
                    <li>• Real-time upload progress with progress bar</li>
                    <li>• Image preview with 128x128 container</li>
                    <li>• File validation (type, size limits)</li>
                    <li>• S3 upload integration with unique filenames</li>
                    <li>• Error handling and user feedback</li>
                    <li>• Remove/replace logo functionality</li>
                    <li>• Support for JPG, PNG, GIF, WebP formats</li>
                  </ul>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Try it:</strong> Switch to the "Complete Editor" tab and click on the "Logo" section
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="icons" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Icon Selector Component</CardTitle>
                <CardDescription>
                  Icon grid selector with API integration and live preview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• API integration with searchIcons endpoint</li>
                    <li>• Grid layout of available icons</li>
                    <li>• Default circle icons fallback</li>
                    <li>• SVG icon rendering with error handling</li>
                    <li>• Current selection highlighting</li>
                    <li>• Preview tab showing filled/unfilled icons</li>
                    <li>• Reset to default functionality</li>
                    <li>• Loading states and error handling</li>
                  </ul>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Try it:</strong> Switch to the "Complete Editor" tab and click on the "Icons" section
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Summary */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🎉 Phase 7 Achievements</CardTitle>
            <CardDescription>
              Complete design editor system with professional UI components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Professional Color System</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 12 curated color presets</li>
                  <li>• Custom color picker</li>
                  <li>• Hex color input validation</li>
                  <li>• Live preview with punch cards</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Advanced File Upload</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Drag & drop interface</li>
                  <li>• Progress tracking</li>
                  <li>• S3 integration</li>
                  <li>• Image preview & validation</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Icon Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• API-driven icon library</li>
                  <li>• SVG rendering</li>
                  <li>• Default fallbacks</li>
                  <li>• Filled/unfilled variants</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Live Preview System</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time punch card preview</li>
                  <li>• Before/after comparison</li>
                  <li>• Configurable preview options</li>
                  <li>• Animation controls</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">State Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• useDesignEditor hook</li>
                  <li>• useFileUpload hook</li>
                  <li>• Optimistic updates</li>
                  <li>• Error recovery</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">User Experience</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Toast notifications</li>
                  <li>• Loading states</li>
                  <li>• Form validation</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Implementation */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🚀 Technical Implementation</CardTitle>
            <CardDescription>
              Built with shadcn/ui components and modern React patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Components Created:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code>ColorPicker</code> - Advanced color selection</li>
                  <li>• <code>LogoUpload</code> - File upload with S3</li>
                  <li>• <code>IconSelector</code> - Icon grid with API</li>
                  <li>• <code>StylePreview</code> - Live punch card preview</li>
                  <li>• <code>DesignEditor</code> - Main orchestrator</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Custom Hooks:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code>useDesignEditor</code> - Design state management</li>
                  <li>• <code>useFileUpload</code> - File upload with progress</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 