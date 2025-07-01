import { useState, useCallback } from 'react'
import { apiClient } from 'e-punch-common-ui'
import { toast } from 'sonner'

export interface FileUploadState {
  isUploading: boolean
  uploadProgress: number
  error: string | null
}

export interface UseFileUploadOptions {
  merchantId?: string
  maxFileSize?: number // in bytes
  allowedTypes?: string[]
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    merchantId,
    maxFileSize = 2 * 1024 * 1024, // 2MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    uploadProgress: 0,
    error: null
  })

  const validateFile = useCallback((file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPG, PNG, GIF, WebP)'
    }

    if (file.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024)
      return `Image must be smaller than ${maxSizeMB}MB`
    }

    return null
  }, [allowedTypes, maxFileSize])

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!merchantId) {
      const error = 'Merchant ID is required for upload'
      toast.error(error)
      onError?.(error)
      return null
    }

    const validationError = validateFile(file)
    if (validationError) {
      toast.error(validationError)
      onError?.(validationError)
      return null
    }

    setState(prev => ({
      ...prev,
      isUploading: true,
      uploadProgress: 0,
      error: null
    }))

    try {
      // Generate unique filename
      const fileName = `logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      
      // Get upload URL from API
      const { uploadUrl, publicUrl } = await apiClient.generateFileUploadUrl(merchantId, fileName)
      
      setState(prev => ({ ...prev, uploadProgress: 25 }))

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 75) + 25 // 25-100%
            setState(prev => ({ ...prev, uploadProgress: progress }))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            setState(prev => ({
              ...prev,
              isUploading: false,
              uploadProgress: 100,
              error: null
            }))
            
            toast.success('Logo uploaded successfully!')
            onSuccess?.(publicUrl)
            resolve(publicUrl)
          } else {
            const error = 'Failed to upload image to S3'
            setState(prev => ({
              ...prev,
              isUploading: false,
              uploadProgress: 0,
              error
            }))
            
            toast.error(error)
            onError?.(error)
            reject(new Error(error))
          }
        })

        xhr.addEventListener('error', () => {
          const error = 'Upload failed due to network error'
          setState(prev => ({
            ...prev,
            isUploading: false,
            uploadProgress: 0,
            error
          }))
          
          toast.error(error)
          onError?.(error)
          reject(new Error(error))
        })

        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
    } catch (error: any) {
      console.error('Failed to upload logo:', error)
      const errorMessage = error.message || 'Failed to upload logo'
      
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: errorMessage
      }))
      
      toast.error(`Failed to upload logo: ${errorMessage}`)
      onError?.(errorMessage)
      return null
    }
  }, [merchantId, validateFile, onSuccess, onError])

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      error: null
    })
  }, [])

  return {
    ...state,
    uploadFile,
    reset,
    validateFile
  }
} 