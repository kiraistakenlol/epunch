import React from 'react'
import SVG from 'react-inlinesvg'
import { PunchIconsDto, IconDto } from 'e-punch-common-core'
import { appColors } from 'e-punch-common-ui'
import { Button } from '@/components/ui/button'
import { X, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconSelectionState, IconSelectionHandlers } from './types'

interface IconSelectionSlotsProps {
  currentIcons?: PunchIconsDto | null
  selectionState: IconSelectionState
  handlers: IconSelectionHandlers
}

export const IconSelectionSlots: React.FC<IconSelectionSlotsProps> = ({
  currentIcons,
  selectionState,
  handlers
}) => {
  const { selectedFilled, selectedUnfilled, activeSlot } = selectionState
  const { onSlotSelect, onRemoveIcon } = handlers

  const renderIcon = (icon: IconDto, size = 32) => (
    <SVG 
      src={`data:image/svg+xml;utf8,${encodeURIComponent(icon.svg_content)}`}
      width={size}
      height={size}
    />
  )

  const renderCurrentIcon = (svg_content: string, size = 32) => (
    <SVG 
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg_content)}`}
      width={size}
      height={size}
    />
  )

  const renderSlotButton = (type: 'filled' | 'unfilled') => {
    const isActive = activeSlot === type
    const selectedIcon = type === 'filled' ? selectedFilled : selectedUnfilled
    const currentIcon = type === 'filled' ? currentIcons?.filled : currentIcons?.unfilled

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <button
            className={cn(
              "w-20 h-20 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
              "hover:border-primary/60 hover:bg-primary/5",
              isActive ? "border-primary bg-primary/10" : "border-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            onClick={() => onSlotSelect(type)}
          >
            {selectedIcon ? renderIcon(selectedIcon, 32) : 
             currentIcon ? renderCurrentIcon(currentIcon.data.svg_raw_content, 32) :
             <HelpCircle className="w-8 h-8 text-muted-foreground" />}
          </button>
          
          {(selectedIcon || currentIcon) && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full z-10"
              onClick={() => onRemoveIcon(type)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-8">
      {renderSlotButton('filled')}
      {renderSlotButton('unfilled')}
    </div>
  )
} 