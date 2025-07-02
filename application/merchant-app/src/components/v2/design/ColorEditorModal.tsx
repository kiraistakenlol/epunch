import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { X } from 'lucide-react'

interface ColorEditorModalProps {
  isOpen: boolean
  onClose: () => void
  primaryColor: string | null
  secondaryColor: string | null
  onSave: (primaryColor: string | null, secondaryColor: string | null) => Promise<void>
}

export const ColorEditorModal: React.FC<ColorEditorModalProps> = ({
  isOpen,
  onClose,
  primaryColor,
  secondaryColor,
  onSave
}) => {
  const [editingColor, setEditingColor] = useState<'primary' | 'secondary' | null>(null)
  const [tempPrimary, setTempPrimary] = useState(primaryColor)
  const [tempSecondary, setTempSecondary] = useState(secondaryColor)

  useEffect(() => {
    if (!isOpen) {
      setEditingColor(null)
    }
  }, [isOpen])

  useEffect(() => {
    setTempPrimary(primaryColor || '#000000')
    setTempSecondary(secondaryColor || '#000000')
  }, [primaryColor, secondaryColor, isOpen])

  const handleColorChange = (color: string) => {
    if (editingColor === 'primary') {
      setTempPrimary(color)
      onSave(color, secondaryColor)
    } else if (editingColor === 'secondary') {
      setTempSecondary(color)
      onSave(primaryColor, color)
    }
  }

  const handleRemoveColor = (colorType: 'primary' | 'secondary') => {
    if (colorType === 'primary') {
      onSave(null, secondaryColor)
    } else {
      onSave(primaryColor, null)
    }
  }

  const ColorArea = ({ 
    label, 
    color, 
    colorType 
  }: { 
    label: string
    color: string | null
    colorType: 'primary' | 'secondary'
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {color ? (
        <div className="relative">
          <div 
            className="w-full h-16 border-2 border-muted rounded-lg cursor-pointer flex items-center justify-center"
            style={{ backgroundColor: color }}
            onClick={() => setEditingColor(colorType)}
          >
            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
              {color}
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveColor(colorType)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div 
          className="w-full h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer flex items-center justify-center hover:border-muted-foreground/50 transition-colors"
          onClick={() => setEditingColor(colorType)}
        >
          <span className="text-muted-foreground text-sm">Click to set color</span>
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Colors</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {editingColor ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Editing {editingColor} color
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingColor(null)}
                >
                  ← Back
                </Button>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="color-input">Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="color-input"
                    type="color"
                    value={editingColor === 'primary' ? tempPrimary : tempSecondary}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={editingColor === 'primary' ? tempPrimary : tempSecondary}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ColorArea 
                  label="Primary Color" 
                  color={primaryColor} 
                  colorType="primary" 
                />
                <ColorArea 
                  label="Secondary Color" 
                  color={secondaryColor} 
                  colorType="secondary" 
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 