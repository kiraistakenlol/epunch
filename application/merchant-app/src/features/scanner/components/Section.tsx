import React from 'react'

interface SectionProps {
  title: string
  description: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Section({ 
  title, 
  description, 
  icon, 
  children, 
  className = '' 
}: SectionProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-4 py-4">
        {icon && (
          <div className="flex-shrink-0 mt-1">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      <div className="pl-0 md:pl-9">
        {children}
      </div>
    </div>
  )
} 