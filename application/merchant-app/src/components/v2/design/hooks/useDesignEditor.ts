import { useState, useEffect, useCallback } from 'react'
import { PunchCardStyleDto, PunchIconsDto } from 'e-punch-common-core'
import { apiClient } from 'e-punch-common-ui'
import { toast } from 'sonner'

export interface DesignState {
  currentStyle: PunchCardStyleDto
  updatedStyle: PunchCardStyleDto | null
  loading: {
    fetch: boolean
    save: boolean
  }
  modalVisibility: {
    colors: boolean
    logo: boolean
    icons: boolean
  }
  previewOptions: {
    currentPunches: number
    totalPunches: number
    status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED'
    showAnimations: boolean
  }
}

export interface UseDesignEditorOptions {
  merchantId?: string
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export const useDesignEditor = (options: UseDesignEditorOptions = {}) => {
  const [state, setState] = useState<DesignState>({
    currentStyle: {
      primaryColor: null,
      secondaryColor: null,
      logoUrl: null,
      backgroundImageUrl: null,
      punchIcons: null
    },
    updatedStyle: null,
    loading: {
      fetch: false,
      save: false
    },
    modalVisibility: {
      colors: false,
      logo: false,
      icons: false
    },
    previewOptions: {
      currentPunches: 3,
      totalPunches: 10,
      status: 'ACTIVE',
      showAnimations: false
    }
  })

  // Load merchant style on mount or when merchantId changes
  useEffect(() => {
    const fetchStyle = async () => {
      if (!options.merchantId) return

      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, fetch: true }
      }))

      try {
        const fetchedStyle = await apiClient.getMerchantDefaultPunchCardStyle(options.merchantId)
        setState(prev => ({
          ...prev,
          currentStyle: fetchedStyle,
          updatedStyle: null,
          loading: { ...prev.loading, fetch: false }
        }))
      } catch (error) {
        console.error('Failed to fetch style:', error)
        toast.error('Failed to load style settings. Using defaults.')
        options.onError?.('Failed to load style settings')
        
        setState(prev => ({
          ...prev,
          loading: { ...prev.loading, fetch: false }
        }))
      }
    }

    fetchStyle()
  }, [options.merchantId])

  const openModal = useCallback((modal: 'colors' | 'logo' | 'icons') => {
    setState(prev => ({
      ...prev,
      modalVisibility: { ...prev.modalVisibility, [modal]: true }
    }))
  }, [])

  const closeModal = useCallback((modal: 'colors' | 'logo' | 'icons') => {
    setState(prev => ({
      ...prev,
      modalVisibility: { ...prev.modalVisibility, [modal]: false }
    }))
  }, [])

  const updateColors = useCallback((primaryColor: string | null, secondaryColor: string | null) => {
    setState(prev => ({
      ...prev,
      updatedStyle: {
        ...(prev.updatedStyle || prev.currentStyle),
        primaryColor,
        secondaryColor
      }
    }))
  }, [])

  const updateLogo = useCallback((logoUrl: string | null) => {
    setState(prev => ({
      ...prev,
      updatedStyle: {
        ...(prev.updatedStyle || prev.currentStyle),
        logoUrl
      }
    }))
  }, [])

  const updateIcons = useCallback((icons: PunchIconsDto | null) => {
    setState(prev => ({
      ...prev,
      updatedStyle: {
        ...(prev.updatedStyle || prev.currentStyle),
        punchIcons: icons
      }
    }))
  }, [])

  const removeCustomIcons = useCallback(() => {
    setState(prev => ({
      ...prev,
      updatedStyle: {
        ...(prev.updatedStyle || prev.currentStyle),
        punchIcons: null
      }
    }))
  }, [])

  const updatePreviewOptions = useCallback((newOptions: Partial<DesignState['previewOptions']>) => {
    setState(prev => ({
      ...prev,
      previewOptions: { ...prev.previewOptions, ...newOptions }
    }))
  }, [])

  const applyStyle = useCallback(async () => {
    if (!options.merchantId || !state.updatedStyle) return

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, save: true }
    }))

    try {
      const styleForApi: PunchCardStyleDto = {
        primaryColor: state.updatedStyle.primaryColor || null,
        secondaryColor: state.updatedStyle.secondaryColor || null,
        logoUrl: state.updatedStyle.logoUrl || null,
        backgroundImageUrl: state.updatedStyle.backgroundImageUrl || null,
        punchIcons: state.updatedStyle.punchIcons || null
      }

      await apiClient.createOrUpdateMerchantDefaultStyle(options.merchantId, styleForApi)

      setState(prev => ({
        ...prev,
        currentStyle: prev.updatedStyle!,
        updatedStyle: null,
        loading: { ...prev.loading, save: false }
      }))

      toast.success('Style applied successfully!')
      options.onSuccess?.('Style applied successfully!')
    } catch (error: any) {
      console.error('Failed to apply style:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to apply style'
      
      toast.error(errorMessage)
      options.onError?.(errorMessage)
      
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, save: false }
      }))
    }
  }, [options.merchantId, state.updatedStyle, options])

  const resetChanges = useCallback(() => {
    setState(prev => ({
      ...prev,
      updatedStyle: null
    }))
  }, [])

  const displayStyle = state.updatedStyle || state.currentStyle
  const hasUnsavedChanges = Boolean(state.updatedStyle)

  return {
    ...state,
    displayStyle,
    hasUnsavedChanges,
    actions: {
      openModal,
      closeModal,
      updateColors,
      updateLogo,
      updateIcons,
      removeCustomIcons,
      updatePreviewOptions,
      applyStyle,
      resetChanges
    }
  }
} 