import React from 'react'
import { Loader2, Circle } from 'lucide-react'
import { IconGridItem } from './IconGridItem'
import { IconSearchState, IconSelectionState, IconSelectionHandlers } from './types'

interface IconsGridProps {
  searchState: IconSearchState
  selectionState: IconSelectionState
  handlers: IconSelectionHandlers
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export const IconsGrid: React.FC<IconsGridProps> = ({
  searchState,
  selectionState,
  handlers,
  onScroll
}) => {
  const { availableIcons, loading, loadingMore } = searchState
  const { selectedFilled, selectedUnfilled, activeSlot } = selectionState
  const { onIconSelect } = handlers

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Searching...</span>
    </div>
  )

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-3">
      <Circle className="w-8 h-8 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No icons found</span>
    </div>
  )

  const renderLoadingMore = () => (
    <div className="flex items-center justify-center py-6">
      <Loader2 className="w-5 h-5 animate-spin text-primary" />
      <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
    </div>
  )

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-[60vh] overflow-y-auto border rounded-md" onScroll={onScroll}>
        <div className="p-4">
          {loading ? renderLoadingState() : availableIcons.length === 0 ? renderEmptyState() : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4">
              {availableIcons.map((icon) => {
                const isFilledSelected = selectedFilled?.id === icon.id
                const isUnfilledSelected = selectedUnfilled?.id === icon.id
                
                return (
                  <IconGridItem
                    key={icon.id}
                    icon={icon}
                    isFilledSelected={isFilledSelected}
                    isUnfilledSelected={isUnfilledSelected}
                    activeSlot={activeSlot}
                    onIconSelect={onIconSelect}
                  />
                )
              })}
            </div>
          )}
          
          {loadingMore && renderLoadingMore()}
        </div>
      </div>
    </div>
  )
} 