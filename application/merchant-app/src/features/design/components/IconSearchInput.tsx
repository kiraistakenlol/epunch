import React from 'react'
import { Input } from '@/components/ui/input'

interface IconSearchInputProps {
  searchQuery: string
  onSearch: (query: string) => void
}

export const IconSearchInput: React.FC<IconSearchInputProps> = ({
  searchQuery,
  onSearch
}) => {
  return (
    <div className="relative">
      <Input
        placeholder="Search icons..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="h-10 sm:h-12 pl-10"
      />
    </div>
  )
} 