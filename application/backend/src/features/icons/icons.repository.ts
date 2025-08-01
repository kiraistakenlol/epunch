import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

export interface IconSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}

export interface Icon {
  name: string;
  display_name: string;
  library: string;
  library_name: string;
  tags: string[];
  svg_content?: string;
  default_props?: {
    viewBox?: string;
    width?: number;
    height?: number;
  };
}

@Injectable()
export class IconsRepository implements OnModuleInit {
  private readonly logger = new Logger(IconsRepository.name);
  private iconIndex: Icon[] = [];
  private svgCache: Map<string, string> = new Map();

  async onModuleInit() {
    await this.buildIconIndex();
  }

  private async buildIconIndex(): Promise<void> {
    this.logger.log('Building in-memory icon index...');
    
    const ICON_LIBRARIES = [
      { key: 'ai', name: 'Ant DesignPage Icons', prefix: 'Ai' },
      { key: 'bi', name: 'Boxicons', prefix: 'Bi' },
      { key: 'bs', name: 'Bootstrap Icons', prefix: 'Bs' },
      { key: 'ci', name: 'Circum Icons', prefix: 'Ci' },
      { key: 'di', name: 'Devicons', prefix: 'Di' },
      { key: 'fa', name: 'Font Awesome 5', prefix: 'Fa' },
      { key: 'fa6', name: 'Font Awesome 6', prefix: 'Fa6' },
      { key: 'fc', name: 'Flat Color Icons', prefix: 'Fc' },
      { key: 'fi', name: 'Feather Icons', prefix: 'Fi' },
      { key: 'gi', name: 'Game Icons', prefix: 'Gi' },
      { key: 'go', name: 'Github Octicons', prefix: 'Go' },
      { key: 'gr', name: 'Grommet Icons', prefix: 'Gr' },
      { key: 'hi', name: 'Heroicons', prefix: 'Hi' },
      { key: 'hi2', name: 'Heroicons 2', prefix: 'Hi2' },
      { key: 'im', name: 'IcoMoon Free', prefix: 'Im' },
      { key: 'io', name: 'Ionicons 4', prefix: 'Io' },
      { key: 'io5', name: 'Ionicons 5', prefix: 'Io5' },
      { key: 'lia', name: 'Line Awesome', prefix: 'Lia' },
      { key: 'lu', name: 'Lucide Icons', prefix: 'Lu' },
      { key: 'md', name: 'Material DesignPage', prefix: 'Md' },
      { key: 'pi', name: 'Phosphor Icons', prefix: 'Pi' },
      { key: 'ri', name: 'Remix Icons', prefix: 'Ri' },
      { key: 'rx', name: 'Radix Icons', prefix: 'Rx' },
      { key: 'si', name: 'Simple Icons', prefix: 'Si' },
      { key: 'sl', name: 'Simple Line Icons', prefix: 'Sl' },
      { key: 'tb', name: 'Tabler Icons', prefix: 'Tb' },
      { key: 'tfi', name: 'Themify Icons', prefix: 'Tfi' },
      { key: 'ti', name: 'Typicons', prefix: 'Ti' },
      { key: 'vsc', name: 'VS Code Icons', prefix: 'Vsc' },
      { key: 'wi', name: 'Weather Icons', prefix: 'Wi' },
    ];

    for (const lib of ICON_LIBRARIES) {
      await this.loadLibraryIcons(lib);
    }

    this.logger.log(`✅ Built icon index with ${this.iconIndex.length} icons`);
  }

  private async extractSvgContent(IconComponent: any, iconName: string): Promise<{ svg_content: string; default_props: any } | null> {
    try {
      if (!IconComponent || typeof IconComponent !== 'function') {
        this.logger.debug(`${iconName}: Invalid component`);
        return null;
      }

      // Create React element with standard props
      const iconElement = createElement(IconComponent, {
        size: 24,
        color: 'currentColor',
      });

      // Render to static HTML/SVG markup
      const svgMarkup = renderToStaticMarkup(iconElement);
      
      if (!svgMarkup || !svgMarkup.includes('<svg')) {
        this.logger.debug(`${iconName}: No SVG content in rendered markup`);
        return null;
      }

      // Extract viewBox and other properties from the rendered SVG
      const viewBoxMatch = svgMarkup.match(/viewBox="([^"]+)"/);
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
      
      const defaultProps = {
        viewBox,
        width: 24,
        height: 24,
        fill: 'currentColor',
      };

      return {
        svg_content: svgMarkup,
        default_props: defaultProps
      };

    } catch (error: any) {
      this.logger.debug(`${iconName}: Error extracting SVG: ${error.message}`);
      return null;
    }
  }

  private async loadLibraryIcons(lib: { key: string; name: string; prefix: string }): Promise<void> {
    try {
      const iconModule = await import(`react-icons/${lib.key}`);
      const iconNames = Object.keys(iconModule).filter(key => key !== 'default');
    
      for (const iconName of iconNames) {
        const IconComponent = iconModule[iconName];
        const displayName = this.formatDisplayName(iconName.replace(lib.prefix, ''));
        
        // Extract SVG content (simplified for now)
        const svgData = await this.extractSvgContent(IconComponent, iconName);
        
        const icon: Icon = {
          name: iconName,
          display_name: displayName,
          library: lib.key,
          library_name: lib.name,
          tags: this.generateSearchTagsFromName(iconName, displayName),
          svg_content: svgData?.svg_content,
          default_props: svgData?.default_props
        };
        
        this.iconIndex.push(icon);
        
        // Cache SVG content for quick retrieval
        if (svgData?.svg_content) {
          this.svgCache.set(iconName, svgData.svg_content);
        }
      }
    } catch (error: any) {
      this.logger.error(`Failed to load ${lib.name}: ${error.message}`);
    }
  }

  private generateSearchTagsFromName(iconName: string, displayName: string): string[] {
    const tags = new Set<string>();
    
    tags.add(iconName.toLowerCase());
    tags.add(displayName.toLowerCase());
    
    const words = displayName.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1);
    
    words.forEach(word => tags.add(word));
    
    const aliases: Record<string, string[]> = {
      'home': ['house', 'dashboard'],
      'user': ['person', 'profile', 'account'],
      'settings': ['gear', 'config', 'options', 'cog'],
      'search': ['find', 'magnify', 'lookup'],
      'mail': ['email', 'envelope', 'message'],
      'phone': ['telephone', 'call'],
      'heart': ['love', 'like', 'favorite'],
      'star': ['favorite', 'rating'],
      'coffee': ['cup', 'drink', 'caffeine'],
      'car': ['vehicle', 'auto', 'drive'],
      'play': ['start', 'run'],
      'pause': ['stop', 'halt'],
      'check': ['tick', 'confirm', 'done'],
      'close': ['x', 'cancel', 'exit'],
      'add': ['plus', 'create', 'new'],
      'remove': ['delete', 'minus', 'trash'],
      'edit': ['pencil', 'modify', 'change'],
      'save': ['download', 'export'],
      'upload': ['import', 'add'],
      'view': ['eye', 'show', 'visible'],
      'hide': ['eyeoff', 'hidden', 'invisible'],
      'lock': ['secure', 'private'],
      'unlock': ['open', 'public']
    };
    
    for (const [key, values] of Object.entries(aliases)) {
      if (Array.from(tags).some(tag => tag.includes(key))) {
        values.forEach(alias => tags.add(alias));
      }
    }
    
    return Array.from(tags);
  }

  async searchIcons(params: IconSearchParams): Promise<{ icons: Icon[]; total: number }> {
    const { query, limit = 50, offset = 0 } = params;
    
    let filteredIcons = this.iconIndex;

    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      filteredIcons = filteredIcons.filter(icon => {
        return (
          icon.name.toLowerCase().includes(searchTerm) ||
          icon.display_name.toLowerCase().includes(searchTerm) ||
          icon.tags.some(tag => tag.includes(searchTerm))
        );
      });

      filteredIcons.sort((a, b) => {
        const aExact = a.name.toLowerCase() === searchTerm ? 1 : 0;
        const bExact = b.name.toLowerCase() === searchTerm ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;

        const aStartsWith = a.display_name.toLowerCase().startsWith(searchTerm) ? 1 : 0;
        const bStartsWith = b.display_name.toLowerCase().startsWith(searchTerm) ? 1 : 0;
        if (aStartsWith !== bStartsWith) return bStartsWith - aStartsWith;

        return a.name.localeCompare(b.name);
      });
    }

    const total = filteredIcons.length;
    const paginatedIcons = filteredIcons.slice(offset, offset + limit);

    return { icons: paginatedIcons, total };
  }

  private formatDisplayName(name: string): string {
    return name.replace(/([A-Z])/g, ' $1').trim();
  }
} 