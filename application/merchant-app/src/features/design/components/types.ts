import { PunchCardStyleDto, PunchIconsDto, IconDto } from 'e-punch-common-core'

export interface PreviewOptions {
  currentPunches: number
  totalPunches: number
  status: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED'
  showAnimations: boolean
}

export interface ModalVisibility {
  colors: boolean
  logo: boolean
  icons: boolean
}

export interface LoadingState {
  fetch: boolean
  save: boolean
}

export interface DesignEditorState {
  currentStyle: PunchCardStyleDto
  updatedStyle: PunchCardStyleDto | null
  modalVisibility: ModalVisibility
  loading: LoadingState
  previewOptions: PreviewOptions
}

export interface DesignEditorHandlers {
  openModal: (modal: 'colors' | 'logo' | 'icons') => void
  closeModal: (modal: 'colors' | 'logo' | 'icons') => void
  handleUpdateColors: (primaryColor: string | null, secondaryColor: string | null) => void
  handleUpdateLogo: (logoUrl: string | null) => void
  handleUpdateIcons: (icons: PunchIconsDto | null) => void
  handleRemoveCustomIcons: () => void
  handleApplyStyle: () => void
  handleReset: () => void
  setPreviewOptions: React.Dispatch<React.SetStateAction<PreviewOptions>>
}

export type ActiveSlot = 'filled' | 'unfilled' | null

export interface IconSelectionState {
  selectedFilled: IconDto | null
  selectedUnfilled: IconDto | null
  activeSlot: ActiveSlot
}

export interface IconSelectionHandlers {
  onSlotSelect: (slot: 'filled' | 'unfilled') => void
  onRemoveIcon: (type: 'filled' | 'unfilled') => Promise<void>
  onIconSelect: (icon: IconDto) => Promise<void>
}

export interface IconSearchState {
  searchQuery: string
  availableIcons: IconDto[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
}

export interface IconSearchHandlers {
  onSearch: (query: string) => void
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
} 