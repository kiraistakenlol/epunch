export interface DesignVariant {
  id: string;
  name: string;
  description: string;
  screens: Screen[];
}

export interface Screen {
  id: string;
  name: string;
  component: React.ComponentType<ScreenProps>;
}

export interface ScreenProps {
  isActive?: boolean;
}

export interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  url?: string;
  time?: string;
}

export interface IOSStatusBarProps {
  time?: string;
  className?: string;
}

export interface SafariToolbarProps {
  url?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  className?: string;
}

export interface SafariBottomBarProps {
  className?: string;
}

export interface StatusBarProps {
  battery?: string;
  appName?: string;
  signal?: string;
}

export interface AppHeaderProps {
  title?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  stats?: string;
}

export interface BottomNavProps {
  items: NavItem[];
  activeItemId?: string;
}

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  isActive?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'reward' | 'active';
  className?: string;
  onClick?: () => void;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface FilterChipsProps {
  chips: ChipData[];
  activeChipId?: string;
  onChipClick?: (chipId: string) => void;
}

export interface ChipData {
  id: string;
  label: string;
  isActive?: boolean;
}

export interface ShopCardData {
  id: string;
  name: string;
  emoji: string;
  currentPunches: number;
  totalPunches: number;
  location?: string;
  status?: 'active' | 'complete' | 'reward_ready';
  motivationText?: string;
}

export interface RewardData {
  id: string;
  shopName: string;
  shopEmoji: string;
  rewardText: string;
  expiryText?: string;
}

export interface ActivityItemData {
  id: string;
  type: 'punch' | 'reward' | 'milestone';
  shopName: string;
  description: string;
  timeAgo: string;
  icon: string;
} 