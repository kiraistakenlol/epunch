import React from 'react'
import { PunchCardStyleDto } from 'e-punch-common-core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Eye, ArrowRight, Save, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StylePreviewProps {
  currentStyle: PunchCardStyleDto
  updatedStyle?: PunchCardStyleDto | null
  previewOptions: {
    currentPunches: number
    totalPunches: number
    status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED'
    showAnimations: boolean
  }
  onPreviewOptionsChange: (options: any) => void
  onApply?: () => void
  onReset?: () => void
  hasUnsavedChanges: boolean
  isApplying?: boolean
  className?: string
}

// Simple punch card component for preview
const PunchCardPreview: React.FC<{
  style: PunchCardStyleDto
  currentPunches: number
  totalPunches: number
  status: string
  showAnimations: boolean
  title?: string
}> = ({ style, currentPunches, totalPunches, status, showAnimations, title }) => {
  const primaryColor = style.primaryColor || '#5d4037'
  const secondaryColor = style.secondaryColor || '#795548'
  
  const renderPunchIcon = (index: number, filled: boolean) => {
    if (style.punchIcons?.filled?.data?.svg_raw_content && filled) {
      return (
        <div 
          className="w-6 h-6"
          dangerouslySetInnerHTML={{ 
            __html: style.punchIcons.filled.data.svg_raw_content 
          }} 
        />
      )
    }
    if (style.punchIcons?.unfilled?.data?.svg_raw_content && !filled) {
      return (
        <div 
          className="w-6 h-6 opacity-60"
          dangerouslySetInnerHTML={{ 
            __html: style.punchIcons.unfilled.data.svg_raw_content 
          }} 
        />
      )
    }
    return (
      <div 
        className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold", 
          filled ? "text-white" : "border-gray-300"
        )}
        style={{ 
          backgroundColor: filled ? primaryColor : 'transparent',
          borderColor: filled ? primaryColor : '#d1d5db'
        }}
      >
        {filled ? '●' : '○'}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {title && (
        <h4 className="text-sm font-medium text-center text-muted-foreground">{title}</h4>
      )}
      <div 
        className={cn(
          "w-80 h-48 rounded-lg border-2 p-4 transition-all duration-500",
          showAnimations && "transform hover:scale-105"
        )}
        style={{ backgroundColor: secondaryColor, borderColor: primaryColor }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {style.logoUrl && (
              <img 
                src={style.logoUrl} 
                alt="Logo" 
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <span className="text-white text-sm font-medium">Coffee Shop</span>
          </div>
          <Badge 
            variant={status === 'REWARD_READY' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {status === 'ACTIVE' ? 'Active' : 
             status === 'REWARD_READY' ? 'Ready' : 'Redeemed'}
          </Badge>
        </div>

        {/* Punches Grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array.from({ length: totalPunches }, (_, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-center justify-center transition-all duration-300",
                showAnimations && index < currentPunches && "animate-pulse"
              )}
            >
              {renderPunchIcon(index, index < currentPunches)}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/80">
            <span>{currentPunches} of {totalPunches} punches</span>
            <span>{Math.round((currentPunches / totalPunches) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1">
            <div 
              className="h-1 rounded-full transition-all duration-500"
              style={{ 
                width: `${(currentPunches / totalPunches) * 100}%`,
                backgroundColor: primaryColor 
              }}
            />
          </div>
        </div>

        {/* Reward Text */}
        <div className="mt-3 text-center">
          <p className="text-xs text-white/90">
            {currentPunches >= totalPunches 
              ? '🎉 Free coffee earned!' 
              : `${totalPunches - currentPunches} more for free coffee`}
          </p>
        </div>
      </div>
    </div>
  )
}

export const StylePreview: React.FC<StylePreviewProps> = ({
  currentStyle,
  updatedStyle,
  previewOptions,
  onPreviewOptionsChange,
  onApply,
  onReset,
  hasUnsavedChanges,
  isApplying = false,
  className
}) => {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Style Preview</span>
        </CardTitle>
        <CardDescription>
          See how your punch cards will look with the selected style
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Preview Controls */}
        <div className="p-4 bg-muted rounded-lg space-y-4">
          <h4 className="font-medium">Preview Settings</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-punches">Current Punches</Label>
              <Input
                id="current-punches"
                type="number"
                min="0"
                max={previewOptions.totalPunches}
                value={previewOptions.currentPunches}
                onChange={(e) => 
                  onPreviewOptionsChange({
                    ...previewOptions,
                    currentPunches: Math.min(
                      Math.max(0, parseInt(e.target.value) || 0), 
                      previewOptions.totalPunches
                    )
                  })
                }
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total-punches">Total Punches</Label>
              <Input
                id="total-punches"
                type="number"
                min="1"
                max="20"
                value={previewOptions.totalPunches}
                onChange={(e) => 
                  onPreviewOptionsChange({
                    ...previewOptions,
                    totalPunches: Math.max(1, parseInt(e.target.value) || 1),
                    currentPunches: Math.min(
                      previewOptions.currentPunches, 
                      parseInt(e.target.value) || 1
                    )
                  })
                }
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Card Status</Label>
              <Select
                value={previewOptions.status}
                onValueChange={(value: any) => 
                  onPreviewOptionsChange({
                    ...previewOptions,
                    status: value
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="REWARD_READY">Reward Ready</SelectItem>
                  <SelectItem value="REWARD_REDEEMED">Redeemed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="animations">Show Animations</Label>
              <div className="flex items-center pt-2">
                <Switch
                  id="animations"
                  checked={previewOptions.showAnimations}
                  onCheckedChange={(checked) => 
                    onPreviewOptionsChange({
                      ...previewOptions,
                      showAnimations: checked
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Comparison */}
        <div className="space-y-4">
          {updatedStyle ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <PunchCardPreview
                style={currentStyle}
                {...previewOptions}
                title="Current Style"
              />
              
              <div className="flex justify-center">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
              
              <PunchCardPreview
                style={updatedStyle}
                {...previewOptions}
                title="New Style"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <PunchCardPreview
                style={currentStyle}
                {...previewOptions}
                title="Current Style"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {hasUnsavedChanges && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onReset}
              disabled={isApplying}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Changes
            </Button>
            
            <Button 
              onClick={onApply}
              disabled={isApplying}
              className="flex-1"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Applying...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Apply Style
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 