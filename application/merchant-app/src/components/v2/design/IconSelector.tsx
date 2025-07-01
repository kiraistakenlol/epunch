import React, { useState, useEffect } from 'react'
import { PunchIconsDto, IconDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Loader2, Shapes, RotateCcw, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconSelectorProps {
  currentIcons?: PunchIconsDto | null
  onIconsChange: (icons: PunchIconsDto | null) => void
  onReset?: () => void
  className?: string
}

interface IconOption {
  id: string
  name: string
  preview: string
  iconDto: IconDto
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  currentIcons,
  onIconsChange,
  onReset,
  className
}) => {
  const [availableIcons, setAvailableIcons] = useState<IconOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIcons = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await apiClient.searchIcons('', 1, 50)
        
        // Transform icons to our format - create pairs for filled/unfilled
        const iconOptions: IconOption[] = result.icons.map((icon: IconDto) => ({
          id: icon.id,
          name: icon.name,
          preview: icon.svg_content,
          iconDto: icon
        }))
        
        // Add default option at the beginning
        const defaultOption: IconOption = {
          id: 'default',
          name: 'Default Circles',
          preview: '●',
          iconDto: {
            id: 'default',
            name: 'Default Circles',
            svg_content: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>'
          }
        }
        
        setAvailableIcons([defaultOption, ...iconOptions])
      } catch (error) {
        console.error('Failed to fetch icons:', error)
        setError('Failed to load icon options')
        
        // Fallback to just default icons
        setAvailableIcons([
          {
            id: 'default',
            name: 'Default Circles',
            preview: '●',
            iconDto: {
              id: 'default',
              name: 'Default Circles',
              svg_content: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>'
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchIcons()
  }, [])

  const handleIconSelect = (iconOption: IconOption) => {
    if (iconOption.id === 'default') {
      onIconsChange(null)
    } else {
      // Create PunchIconsDto from IconDto
      const icons: PunchIconsDto = {
        filled: {
          type: 'svg',
          data: {
            svg_raw_content: iconOption.iconDto.svg_content
          }
        },
        unfilled: {
          type: 'svg',
          data: {
            svg_raw_content: iconOption.iconDto.svg_content
          }
        }
      }
      onIconsChange(icons)
    }
  }

  const handleReset = () => {
    onIconsChange(null)
    onReset?.()
  }

  const isCurrentIcon = (iconOption: IconOption) => {
    if (iconOption.id === 'default') {
      return !currentIcons
    }
    return currentIcons?.filled?.data?.svg_raw_content === iconOption.iconDto.svg_content
  }

  const renderIconPreview = (iconOption: IconOption) => {
    if (iconOption.id !== 'default' && iconOption.iconDto.svg_content) {
      try {
        return (
          <div className="flex space-x-2 items-center justify-center">
            <div 
              className="w-6 h-6"
              dangerouslySetInnerHTML={{ 
                __html: iconOption.iconDto.svg_content 
              }} 
            />
            <div 
              className="w-6 h-6 opacity-50"
              dangerouslySetInnerHTML={{ 
                __html: iconOption.iconDto.svg_content
              }} 
            />
          </div>
        )
      } catch (error) {
        console.error('Error rendering SVG:', error)
      }
    }
    
    return (
      <div className="flex space-x-2 items-center justify-center text-lg">
        <span>●</span>
        <span className="opacity-50">○</span>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading icon options...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shapes className="h-5 w-5" />
          <span>Punch Icons</span>
        </CardTitle>
        <CardDescription>
          Choose icons for filled and unfilled punches
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Tabs defaultValue="icons" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="icons">Available Icons</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="icons" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableIcons.map((iconOption) => (
                <button
                  key={iconOption.id}
                  onClick={() => handleIconSelect(iconOption)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all hover:scale-105",
                    isCurrentIcon(iconOption) 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="space-y-2">
                    {renderIconPreview(iconOption)}
                    <p className="text-xs font-medium text-center">{iconOption.name}</p>
                  </div>
                  {isCurrentIcon(iconOption) && (
                    <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="p-6 bg-muted rounded-lg text-center">
              <h4 className="font-medium mb-4">Current Icon Set</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="mb-2">
                                           {currentIcons ? renderIconPreview(
                       availableIcons.find(icon => 
                         icon.iconDto.svg_content === currentIcons.filled?.data?.svg_raw_content
                       ) || availableIcons[0]
                     ) : renderIconPreview(availableIcons[0] || { 
                       id: 'default', 
                       name: 'Default', 
                       preview: '●', 
                       iconDto: { id: 'default', name: 'Default', svg_content: '' }
                     })}
                    </div>
                    <p className="text-xs text-muted-foreground">Filled / Unfilled</p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {currentIcons ? (
                    <div className="space-y-1">
                      <p className="font-medium">Custom icons selected</p>
                      <p>These icons will appear on all punch cards</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-medium">Default icons</p>
                      <p>Using standard circle icons</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Current Icons Display */}
        {currentIcons && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Applied Icons</span>
              <Badge variant="secondary">Custom</Badge>
            </div>
                         <div className="flex items-center justify-center">
               {renderIconPreview(
                 availableIcons.find(icon => 
                   icon.iconDto.svg_content === currentIcons.filled?.data?.svg_raw_content
                 ) || availableIcons[0]
               )}
             </div>
          </div>
        )}

        {/* Reset Button */}
        {currentIcons && (
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default Icons
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 