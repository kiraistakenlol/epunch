import React, { useState, useEffect } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { PunchIconsDto, IconSearchResultDto, IconDto } from 'e-punch-common-core'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IconSelectionSlots } from './IconSelectionSlots'
import { IconSearchInput } from './IconSearchInput'
import { IconsGrid } from './IconsGrid'
import { ActiveSlot, IconSelectionState, IconSearchState, IconSelectionHandlers } from './types'

interface IconsEditorModalProps {
  isOpen: boolean
  onClose: () => void
  currentIcons?: PunchIconsDto | null
  onSave: (icons: PunchIconsDto | null) => Promise<void>
}

export const IconsEditorModal: React.FC<IconsEditorModalProps> = ({
  isOpen,
  onClose,
  currentIcons,
  onSave
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [availableIcons, setAvailableIcons] = useState<IconDto[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedFilled, setSelectedFilled] = useState<IconDto | null>(null)
  const [selectedUnfilled, setSelectedUnfilled] = useState<IconDto | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeSlot, setActiveSlot] = useState<ActiveSlot>(null)

  useEffect(() => {
    if (currentIcons && isOpen) {
      const searchForCurrentIcons = async () => {
        try {
          const result: IconSearchResultDto = await apiClient.searchIcons(undefined, 1, 100)

          const filledSvg = currentIcons.filled?.data?.svg_raw_content
          const unfilledSvg = currentIcons.unfilled?.data?.svg_raw_content

          if (filledSvg) {
            const matchingFilled = result.icons.find(icon =>
              icon.svg_content.replace(/\s+/g, '') === filledSvg.replace(/\s+/g, '')
            )
            if (matchingFilled) {
              setSelectedFilled(matchingFilled)
            }
          }

          if (unfilledSvg) {
            const matchingUnfilled = result.icons.find(icon =>
              icon.svg_content.replace(/\s+/g, '') === unfilledSvg.replace(/\s+/g, '')
            )
            if (matchingUnfilled) {
              setSelectedUnfilled(matchingUnfilled)
            }
          }
        } catch (error) {
          console.error('Failed to load current icons:', error)
        }
      }

      searchForCurrentIcons()
    } else if (!currentIcons) {
      setSelectedFilled(null)
      setSelectedUnfilled(null)
    }
  }, [currentIcons, isOpen])

  useEffect(() => {
    const searchIcons = async () => {
      const isNewSearch = currentPage === 1

      if (isNewSearch) {
        setLoading(true)
        setAvailableIcons([])
      } else {
        setLoadingMore(true)
      }

      try {
        const result: IconSearchResultDto = await apiClient.searchIcons(
          searchQuery || undefined,
          currentPage,
          200
        )

        if (isNewSearch) {
          setAvailableIcons(result.icons)
        } else {
          setAvailableIcons(prev => [...prev, ...result.icons])
        }

        setHasMore(result.hasMore)
      } catch (error) {
        console.error('Failed to search icons:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    if (currentPage === 1) {
      const debounceTimer = setTimeout(searchIcons, 300)
      return () => clearTimeout(debounceTimer)
    } else {
      searchIcons()
    }
  }, [searchQuery, currentPage])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    setHasMore(true)
  }

  const updateIcons = async (newFilled: IconDto | null, newUnfilled: IconDto | null) => {
    if (!newFilled && !newUnfilled) {
      await onSave(null)
      return
    }

    const icons: PunchIconsDto = {
      filled: newFilled ? {
        type: 'svg',
        data: {
          svg_raw_content: newFilled.svg_content
        }
      } : null,
      unfilled: newUnfilled ? {
        type: 'svg',
        data: {
          svg_raw_content: newUnfilled.svg_content
        }
      } : null
    }

    await onSave(icons)
  }

  const handleIconSelect = async (icon: IconDto) => {
    if (!activeSlot) return

    const newFilled = activeSlot === 'filled' ? icon : selectedFilled
    const newUnfilled = activeSlot === 'unfilled' ? icon : selectedUnfilled

    if (activeSlot === 'filled') {
      setSelectedFilled(icon)
    } else {
      setSelectedUnfilled(icon)
    }

    await updateIcons(newFilled, newUnfilled)
  }

  const handleRemoveIcon = async (type: 'filled' | 'unfilled') => {
    const newFilled = type === 'filled' ? null : selectedFilled
    const newUnfilled = type === 'unfilled' ? null : selectedUnfilled

    if (type === 'filled') {
      setSelectedFilled(null)
    } else {
      setSelectedUnfilled(null)
    }

    await updateIcons(newFilled, newUnfilled)
  }

  const handleSlotSelect = (slot: 'filled' | 'unfilled') => {
    setActiveSlot(activeSlot === slot ? null : slot)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10

    if (isAtBottom && hasMore && !loading && !loadingMore) {
      console.log('Loading more icons...', { currentPage, hasMore })
      setCurrentPage(prev => prev + 1)
    }
  }

  const selectionState: IconSelectionState = {
    selectedFilled,
    selectedUnfilled,
    activeSlot
  }

  const searchState: IconSearchState = {
    searchQuery,
    availableIcons,
    loading,
    loadingMore,
    hasMore
  }

  const selectionHandlers: IconSelectionHandlers = {
    onSlotSelect: handleSlotSelect,
    onRemoveIcon: handleRemoveIcon,
    onIconSelect: handleIconSelect
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] sm:h-[80vh] flex flex-col">

        <DialogHeader >
          <DialogTitle>Choose Icons</DialogTitle>
        </DialogHeader>

        <IconSelectionSlots
          currentIcons={currentIcons}
          selectionState={selectionState}
          handlers={selectionHandlers}
        />

        <IconSearchInput
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />

        <IconsGrid
          searchState={searchState}
          selectionState={selectionState}
          handlers={selectionHandlers}
          onScroll={handleScroll}
        />
      </DialogContent>
    </Dialog>
  )
} 