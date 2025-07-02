import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
  className?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  className
}) => {
  return (
    <div className={className}>
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      <div className="space-y-3">
        <div 
          className="w-full h-12 border-2 border-muted rounded-lg cursor-pointer flex items-center justify-center relative"
          style={{ backgroundColor: value }}
          onClick={() => {
            const colorInput = document.getElementById(`color-${label.replace(/\s+/g, '-').toLowerCase()}`) as HTMLInputElement
            colorInput?.click()
          }}
        >
          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
            {value}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Input
            id={`color-${label.replace(/\s+/g, '-').toLowerCase()}`}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-10 p-1 border rounded cursor-pointer"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
} 