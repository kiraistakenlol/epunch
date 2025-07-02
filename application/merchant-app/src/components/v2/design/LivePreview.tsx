import React from 'react'
import { PunchCardStyleDto } from 'e-punch-common-core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Save, RotateCcw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PunchCardPreview } from './PunchCardPreview'
import { PreviewOptions } from './types'

interface LivePreviewProps {
  currentStyle: PunchCardStyleDto
  updatedStyle: PunchCardStyleDto | null
  previewOptions: PreviewOptions
  onPreviewOptionsChange: React.Dispatch<React.SetStateAction<PreviewOptions>>
  hasUnsavedChanges: boolean
  loading?: boolean
  onReset?: () => void
  onApplyStyle?: () => void
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  currentStyle,
  updatedStyle,
  previewOptions,
  hasUnsavedChanges,
  loading = false,
  onReset,
  onApplyStyle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          📱 {hasUnsavedChanges ? 'Current vs New Style' : 'Live Preview'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Preview Grid - Closer spacing and better alignment */}
        <div className={cn(
          "flex items-center justify-center gap-4",
          hasUnsavedChanges
            ? "flex-col lg:flex-row"
            : ""
        )}>

          {/* Current Style */}
          <PunchCardPreview
            primaryColor={currentStyle.primaryColor}
            secondaryColor={currentStyle.secondaryColor}
            logoUrl={currentStyle.logoUrl}
            punchIcons={currentStyle.punchIcons}
            size="large"
            renderOnBackgroundColor="hsl(var(--card))"
            showAnimations={true}
            currentPunches={previewOptions.currentPunches}
            totalPunches={previewOptions.totalPunches}
            status={previewOptions.status}
          />

          {/* Arrow - Better centered between previews */}
          {hasUnsavedChanges && (
            <div className="flex items-center justify-center px-4">
              <ArrowRight className="h-6 w-6 text-muted-foreground lg:rotate-0 rotate-90" />
            </div>
          )}

          {/* Updated Style (only when there are changes) */}
          {hasUnsavedChanges && updatedStyle && (
            <PunchCardPreview
              primaryColor={updatedStyle.primaryColor}
              secondaryColor={updatedStyle.secondaryColor}
              logoUrl={updatedStyle.logoUrl}
              punchIcons={updatedStyle.punchIcons}
              size="large"
              renderOnBackgroundColor="hsl(var(--card))"
              showAnimations={true}
              currentPunches={previewOptions.currentPunches}
              totalPunches={previewOptions.totalPunches}
              status={previewOptions.status}
            />
          )}
        </div>

        {/* Action Buttons - Only show when there are unsaved changes */}
        {hasUnsavedChanges && (onReset || onApplyStyle) && (
          <div className="pt-4 border-t">
            <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
              {onReset && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onReset}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
              {onApplyStyle && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={onApplyStyle}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 