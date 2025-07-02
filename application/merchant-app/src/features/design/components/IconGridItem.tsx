import React from 'react'
import SVG from 'react-inlinesvg'
import { IconDto } from 'e-punch-common-core'
import { Circle, CircleDot } from 'lucide-react'
import { cn } from '@/lib/cn'
import { ActiveSlot } from './types'

interface IconGridItemProps {
  icon: IconDto
  isFilledSelected: boolean
  isUnfilledSelected: boolean
  activeSlot: ActiveSlot
  onIconSelect: (icon: IconDto) => Promise<void>
}

export const IconGridItem: React.FC<IconGridItemProps> = ({
  icon,
  isFilledSelected,
  isUnfilledSelected,
  activeSlot,
  onIconSelect
}) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "w-full aspect-square p-2 relative transition-all duration-200 hover:scale-105 flex items-center justify-center",
          "border border-input rounded-md cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground",
          isFilledSelected && "border-green-400/60 bg-green-50/70",
          isUnfilledSelected && "border-orange-400/60 bg-orange-50/70",
          activeSlot && !isFilledSelected && !isUnfilledSelected && "hover:border-primary opacity-100",
          !activeSlot && "opacity-30 cursor-not-allowed"
        )}
        onClick={() => activeSlot && onIconSelect(icon)}
      >
        <SVG 
          src={`data:image/svg+xml;utf8,${encodeURIComponent(icon.svg_content)}`}
          className="w-full h-full max-w-8 max-h-8"
        />
        
        {(isFilledSelected || isUnfilledSelected) && (
          <div className={cn(
            "absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white shadow-sm",
            isFilledSelected ? "bg-green-400" : "bg-orange-400"
          )}>
            {isFilledSelected ? 
              <CircleDot className="w-2 h-2 sm:w-3 sm:h-3" /> : 
              <Circle className="w-2 h-2 sm:w-3 sm:h-3" />
            }
          </div>
        )}
      </div>
    </div>
  )
} 