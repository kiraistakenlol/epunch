import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Image, X, RotateCcw, CheckCircle } from 'lucide-react'
import { useFileUpload } from './hooks/useFileUpload'
import { cn } from '@/lib/utils'

interface LogoUploadProps {
  merchantId?: string
  currentLogoUrl?: string | null
  onLogoChange: (logoUrl: string | null) => void
  onRemove?: () => void
  className?: string
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  merchantId,
  currentLogoUrl,
  onLogoChange,
  onRemove,
  className
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  
  const fileUpload = useFileUpload({
    merchantId,
    onSuccess: (url) => {
      onLogoChange(url)
      setPreview(null)
    },
    onError: () => {
      setPreview(null)
    }
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Start upload
    fileUpload.uploadFile(file)
  }, [fileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: fileUpload.isUploading
  })

  const handleRemove = () => {
    onLogoChange(null)
    setPreview(null)
    onRemove?.()
  }

  const hasLogo = currentLogoUrl || preview

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Image className="h-5 w-5" />
          <span>Logo</span>
        </CardTitle>
        <CardDescription>
          Upload your business logo for punch cards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Logo Display */}
        {hasLogo && (
          <div className="relative">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Current Logo</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-auto p-1 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="relative w-32 h-32 bg-background rounded-lg border-2 border-border overflow-hidden">
                  <img
                    src={preview || currentLogoUrl || ''}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>
              {currentLogoUrl && !preview && (
                <div className="flex items-center justify-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">Logo uploaded</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50",
            fileUpload.isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="text-center space-y-3">
            {fileUpload.isUploading ? (
              <>
                <Upload className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading...</p>
                  <Progress value={fileUpload.uploadProgress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {fileUpload.uploadProgress}% complete
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className={cn(
                  "h-12 w-12 mx-auto transition-colors",
                  isDragActive ? "text-primary" : "text-muted-foreground"
                )} />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {isDragActive ? 'Drop logo here' : hasLogo ? 'Replace Logo' : 'Upload Logo'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF, WebP (max 2MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {fileUpload.error && (
          <Alert variant="destructive">
            <AlertDescription>{fileUpload.error}</AlertDescription>
          </Alert>
        )}

        {/* Reset Button */}
        {hasLogo && (
          <Button 
            variant="outline" 
            onClick={handleRemove}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Remove Logo
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 