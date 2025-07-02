import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { apiClient } from 'e-punch-common-ui'
import { Upload, X, Loader2 } from 'lucide-react'

interface LogoEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (logoUrl: string | null) => Promise<void>
  merchantId?: string
}

export const LogoEditorModal: React.FC<LogoEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  merchantId
}) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleRemoveLogo = () => {
    onSave(null)
    onClose()
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB')
      return
    }

    if (!merchantId) {
      toast.error('Merchant ID is required for upload')
      return
    }

    setIsUploading(true)

    try {
      const fileName = `logo-${Date.now()}-${file.name}`
      
      const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(merchantId, fileName)
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to S3')
      }
      
      await onSave(publicUrl)
      onClose()
      toast.success('Logo uploaded successfully!')
      
    } catch (error: any) {
      console.error('Failed to upload logo:', error)
      toast.error(`Failed to upload logo: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }, [onSave, onClose, merchantId])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Logo Upload</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <div 
              {...getRootProps()} 
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              {isUploading ? (
                <div className="space-y-3">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                  <div className="text-sm font-medium">Uploading...</div>
                  <div className="text-xs text-muted-foreground">Please wait</div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className={`w-12 h-12 mx-auto ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-sm font-medium">
                    {isDragActive ? 'Drop image here' : 'Upload Logo'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Drag & drop or click to browse
                  </div>
                  <div className="text-xs text-muted-foreground">
                    JPG, PNG, GIF, WebP (max 2MB)
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveLogo}
              className="absolute top-2 right-2 h-8 w-8 p-0"
              title="Remove current logo"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 