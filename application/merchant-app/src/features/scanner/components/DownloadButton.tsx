import React from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface DownloadButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function DownloadButton({ 
  onClick, 
  disabled = false, 
  children, 
  className = '' 
}: DownloadButtonProps) {
  return (
    <div className={`flex justify-center mt-6 ${className}`}>
      <div className="w-full max-w-md">
        <Button
          onClick={onClick}
          disabled={disabled}
          className="w-full"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          {children}
        </Button>
      </div>
    </div>
  )
} 