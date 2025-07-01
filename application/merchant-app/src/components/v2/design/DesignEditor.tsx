import React from 'react'
import { useAppSelector } from '../../../store/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Palette, Image, Shapes, Eye } from 'lucide-react'
import { ColorPicker } from './ColorPicker'
import { LogoUpload } from './LogoUpload'
import { IconSelector } from './IconSelector'
import { StylePreview } from './StylePreview'
import { useDesignEditor } from './hooks/useDesignEditor'
import { cn } from '@/lib/utils'

interface DesignEditorProps {
  className?: string
}

export const DesignEditor: React.FC<DesignEditorProps> = ({ className }) => {
  const merchant = useAppSelector(state => state.merchant.merchant)
  
  const designEditor = useDesignEditor({
    merchantId: merchant?.id,
    onSuccess: (message) => {
      console.log('Design success:', message)
    },
    onError: (error) => {
      console.error('Design error:', error)
    }
  })

  if (designEditor.loading.fetch) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Loading Design Settings</h3>
              <p className="text-sm text-muted-foreground">
                Fetching your current punch card style...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Design Editor</CardTitle>
              <CardDescription>
                Customize the look and feel of your punch cards
              </CardDescription>
            </div>
            {designEditor.hasUnsavedChanges && (
              <Badge variant="secondary" className="animate-pulse">
                Unsaved Changes
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Design Controls */}
        <div className="xl:col-span-2">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Colors</span>
              </TabsTrigger>
              <TabsTrigger value="logo" className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Logo</span>
              </TabsTrigger>
              <TabsTrigger value="icons" className="flex items-center space-x-2">
                <Shapes className="h-4 w-4" />
                <span>Icons</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="colors" className="mt-6">
              <ColorPicker
                primaryColor={designEditor.displayStyle.primaryColor}
                secondaryColor={designEditor.displayStyle.secondaryColor}
                onColorChange={designEditor.actions.updateColors}
                onReset={() => designEditor.actions.updateColors(null, null)}
              />
            </TabsContent>
            
            <TabsContent value="logo" className="mt-6">
              <LogoUpload
                merchantId={merchant?.id}
                currentLogoUrl={designEditor.displayStyle.logoUrl}
                onLogoChange={designEditor.actions.updateLogo}
                onRemove={() => designEditor.actions.updateLogo(null)}
              />
            </TabsContent>
            
            <TabsContent value="icons" className="mt-6">
              <IconSelector
                currentIcons={designEditor.displayStyle.punchIcons}
                onIconsChange={designEditor.actions.updateIcons}
                onReset={designEditor.actions.removeCustomIcons}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <StylePreview
              currentStyle={designEditor.currentStyle}
              updatedStyle={designEditor.updatedStyle}
              previewOptions={designEditor.previewOptions}
              onPreviewOptionsChange={designEditor.actions.updatePreviewOptions}
              onApply={designEditor.actions.applyStyle}
              onReset={designEditor.actions.resetChanges}
              hasUnsavedChanges={designEditor.hasUnsavedChanges}
              isApplying={designEditor.loading.save}
            />
          </div>
        </div>
      </div>

      {/* Style Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Current Style Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colors Summary */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Colors</h4>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: designEditor.displayStyle.primaryColor || '#5d4037' }}
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: designEditor.displayStyle.secondaryColor || '#795548' }}
                />
                <span className="text-sm text-muted-foreground">
                  {designEditor.displayStyle.primaryColor ? 'Custom' : 'Default'}
                </span>
              </div>
            </div>

            {/* Logo Summary */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Logo</h4>
              <div className="flex items-center space-x-2">
                {designEditor.displayStyle.logoUrl ? (
                  <>
                    <img 
                      src={designEditor.displayStyle.logoUrl} 
                      alt="Logo" 
                      className="w-6 h-6 object-contain border rounded"
                    />
                    <span className="text-sm text-muted-foreground">Uploaded</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 border-2 border-dashed border-muted-foreground/50 rounded flex items-center justify-center">
                      <Image className="h-3 w-3 text-muted-foreground/50" />
                    </div>
                    <span className="text-sm text-muted-foreground">No logo</span>
                  </>
                )}
              </div>
            </div>

            {/* Icons Summary */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Icons</h4>
              <div className="flex items-center space-x-2">
                {designEditor.displayStyle.punchIcons ? (
                  <>
                    <div className="flex space-x-1">
                      <span className="text-sm">●</span>
                      <span className="text-sm opacity-50">○</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Custom</span>
                  </>
                ) : (
                  <>
                    <div className="flex space-x-1">
                      <span className="text-sm">●</span>
                      <span className="text-sm opacity-50">○</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Default</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 