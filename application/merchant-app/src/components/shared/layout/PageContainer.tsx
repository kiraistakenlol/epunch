import React from 'react'
import { cn } from '@/lib/cn'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('container mx-auto p-4', className)}>
      {children}
    </div>
  )
} 