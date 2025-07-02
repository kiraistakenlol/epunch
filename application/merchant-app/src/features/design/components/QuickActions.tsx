import React from 'react'
import { PunchCardStyleDto } from 'e-punch-common-core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Palette, Upload, Shapes, Edit2 } from 'lucide-react'
import { renderIconPreview } from './utils'

interface QuickActionsProps {
  displayStyle: PunchCardStyleDto
  onOpenModal: (modal: 'colors' | 'logo' | 'icons') => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  displayStyle,
  onOpenModal
}) => {
  const hasLogo = !!displayStyle.logoUrl

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Customize Your Punch Cards</h2>
        <p className="text-muted-foreground text-sm">
          Click on any section below to personalize your punch card design
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-primary/20" onClick={() => onOpenModal('colors')}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/20">
                <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-base">Colors</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            <div className="flex justify-center space-x-3">
              <div 
                className="w-16 h-16 rounded-xl border-2 border-white shadow-lg"
                style={{ 
                  backgroundColor: displayStyle.primaryColor || '#3b82f6',
                  border: '2px solid white',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                }}
              />
              <div 
                className="w-16 h-16 rounded-xl border-2 border-white shadow-lg"
                style={{ 
                  backgroundColor: displayStyle.secondaryColor || '#e5e7eb',
                  border: '2px solid white',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <Button variant="ghost" className="w-full group-hover:bg-primary/5 py-3">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Colors
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-primary/20" onClick={() => onOpenModal('logo')}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/20">
                <Upload className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-base">Logo</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
                {hasLogo ? (
                  <img 
                    src={displayStyle.logoUrl!} 
                    alt="Logo preview" 
                    className="w-20 h-20 object-contain rounded"
                  />
                ) : (
                  <Upload className="h-10 w-10 text-gray-400" />
                )}
              </div>
            </div>
            <Button variant="ghost" className="w-full group-hover:bg-primary/5 py-3">
              <Upload className="h-4 w-4 mr-2" />
              {hasLogo ? 'Change Logo' : 'Upload Logo'}
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-primary/20" onClick={() => onOpenModal('icons')}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/20">
                <Shapes className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-base">Icons</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            <div className="flex justify-center">
              <div className="w-32 h-16 flex items-center justify-center">
                <div className="scale-[4]">
                  {renderIconPreview(displayStyle)}
                </div>
              </div>
            </div>
            <Button variant="ghost" className="w-full group-hover:bg-primary/5 py-3">
              <Shapes className="h-4 w-4 mr-2" />
              Edit Icons
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 