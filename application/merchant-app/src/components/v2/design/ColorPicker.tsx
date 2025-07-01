import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, RotateCcw, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  primaryColor: string | null
  secondaryColor: string | null
  onColorChange: (primary: string | null, secondary: string | null) => void
  onReset?: () => void
  className?: string
}

const colorPresets = [
  { name: 'Coffee', primary: '#5d4037', secondary: '#795548' },
  { name: 'Ocean', primary: '#0277bd', secondary: '#0288d1' },
  { name: 'Forest', primary: '#388e3c', secondary: '#4caf50' },
  { name: 'Sunset', primary: '#ff5722', secondary: '#ff7043' },
  { name: 'Purple', primary: '#7b1fa2', secondary: '#8e24aa' },
  { name: 'Teal', primary: '#00695c', secondary: '#00796b' },
  { name: 'Orange', primary: '#ef6c00', secondary: '#f57c00' },
  { name: 'Indigo', primary: '#303f9f', secondary: '#3f51b5' },
  { name: 'Pink', primary: '#c2185b', secondary: '#d81b60' },
  { name: 'Brown', primary: '#5d4037', secondary: '#6d4c41' },
  { name: 'Grey', primary: '#424242', secondary: '#616161' },
  { name: 'Red', primary: '#d32f2f', secondary: '#f44336' }
]

export const ColorPicker: React.FC<ColorPickerProps> = ({
  primaryColor,
  secondaryColor,
  onColorChange,
  onReset,
  className
}) => {
  const [customPrimary, setCustomPrimary] = useState(primaryColor || '#5d4037')
  const [customSecondary, setCustomSecondary] = useState(secondaryColor || '#795548')

  const handlePresetSelect = (preset: typeof colorPresets[0]) => {
    onColorChange(preset.primary, preset.secondary)
    setCustomPrimary(preset.primary)
    setCustomSecondary(preset.secondary)
  }

  const handleCustomApply = () => {
    onColorChange(customPrimary, customSecondary)
  }

  const handleReset = () => {
    onColorChange(null, null)
    setCustomPrimary('#5d4037')
    setCustomSecondary('#795548')
    onReset?.()
  }

  const isCurrentPreset = (preset: typeof colorPresets[0]) => {
    return primaryColor === preset.primary && secondaryColor === preset.secondary
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Color Theme</span>
        </CardTitle>
        <CardDescription>
          Choose colors for your punch cards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    "relative p-3 rounded-lg border-2 transition-all hover:scale-105",
                    isCurrentPreset(preset) 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex space-x-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <p className="text-xs font-medium text-center">{preset.name}</p>
                  {isCurrentPreset(preset) && (
                    <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex space-x-2">
                  <div 
                    className="w-10 h-10 rounded border-2 border-border"
                    style={{ backgroundColor: customPrimary }}
                  />
                  <Input
                    id="primary-color"
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    placeholder="#5d4037"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex space-x-2">
                  <div 
                    className="w-10 h-10 rounded border-2 border-border"
                    style={{ backgroundColor: customSecondary }}
                  />
                  <Input
                    id="secondary-color"
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    placeholder="#795548"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
            
            <Button onClick={handleCustomApply} className="w-full">
              Apply Custom Colors
            </Button>
          </TabsContent>
        </Tabs>

        {/* Current Colors Display */}
        {(primaryColor || secondaryColor) && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Current Colors</span>
              <Badge variant="secondary">Applied</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: primaryColor || '#5d4037' }}
                />
                <span className="text-sm font-mono">{primaryColor || 'Default'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: secondaryColor || '#795548' }}
                />
                <span className="text-sm font-mono">{secondaryColor || 'Default'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        {(primaryColor || secondaryColor) && (
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 