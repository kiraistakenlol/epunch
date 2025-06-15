export type IconLibrary = 'bootstrap' | 'react' | 'lucide';

export interface IconItem {
  id: string;
  name: string;
  library: IconLibrary;
  element?: React.ReactElement;
  searchTerms: string[];
  IconComponent?: React.ComponentType<any>;
}

export interface SVGProperties {
  size: number;
  color: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap: 'butt' | 'round' | 'square';
  strokeLinejoin: 'miter' | 'round' | 'bevel';
  strokeDasharray: string;
  opacity: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface IconSearchResult {
  icons: IconItem[];
  hasMore: boolean;
  total: number;
}

export interface IconLibraryConfig {
  name: string;
  value: IconLibrary;
  description: string;
}

export type IconType = 'filled' | 'unfilled';

export interface IconState {
  icon: any; // IconDto | null - using any to avoid circular dependency
  properties: SVGProperties;
} 