import { PunchCardDto, LoyaltyProgramDto } from 'e-punch-common-core';

export interface DashboardPreviewParams {
  merchantSlug?: string;
  cards?: PunchCardDto[];
  loyaltyPrograms: LoyaltyProgramDto[];
  selectedCardId?: string;
  completionOverlayCardId?: string;
  renderOnBackgroundColor?: string;
  locale?: string;
}

export interface DashboardPreviewConfig {
  userAppBaseUrl?: string;
  timeout?: number;
}

class DashboardPreviewService {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(config: DashboardPreviewConfig = {}) {
    this.baseUrl = config.userAppBaseUrl || import.meta.env.VITE_USER_APP_URL || 'http://localhost:5173';
    this.defaultTimeout = config.timeout || 10000;
  }

  private buildPreviewUrl(params: DashboardPreviewParams): string {
    const previewUrl = new URL(`${this.baseUrl}/preview`);
    
    const {
      merchantSlug,
      cards,
      loyaltyPrograms,
      selectedCardId,
      completionOverlayCardId,
      renderOnBackgroundColor = 'white',
      locale
    } = params;

    previewUrl.searchParams.set('renderOnBackgroundColor', renderOnBackgroundColor);
    previewUrl.searchParams.set('loyaltyPrograms', JSON.stringify(loyaltyPrograms));

    if (merchantSlug) previewUrl.searchParams.set('merchantSlug', merchantSlug);
    if (cards) previewUrl.searchParams.set('cards', JSON.stringify(cards));
    if (selectedCardId) previewUrl.searchParams.set('selectedCardId', selectedCardId);
    if (completionOverlayCardId) previewUrl.searchParams.set('completionOverlayCardId', completionOverlayCardId);
    if (locale) previewUrl.searchParams.set('locale', locale);

    return previewUrl.toString();
  }

  public getPreviewUrl(params: DashboardPreviewParams): string {
    return this.buildPreviewUrl(params);
  }

  public async captureDashboardImage(params: DashboardPreviewParams): Promise<string> {
    const iframeUrl = this.buildPreviewUrl(params);

    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '390px'; // Mobile width
    iframe.style.height = '844px'; // Mobile height
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    return new Promise<string>((resolve) => {
      const timeout = setTimeout(() => {
        this.cleanupIframe(iframe, handleMessage);
        resolve('');
      }, this.defaultTimeout);

      const handleMessage = (event: MessageEvent) => {
        if (event.source !== iframe.contentWindow) return;

        if (event.data.type === 'DASHBOARD_PREVIEW_READY') {
          iframe.contentWindow?.postMessage({ type: 'CAPTURE_DASHBOARD' }, '*');
        } else if (event.data.type === 'DASHBOARD_CAPTURED') {
          clearTimeout(timeout);
          this.cleanupIframe(iframe, handleMessage);
          resolve(event.data.imageDataURL);
        } else if (event.data.type === 'DASHBOARD_CAPTURE_ERROR') {
          clearTimeout(timeout);
          this.cleanupIframe(iframe, handleMessage);
          resolve('');
        }
      };

      window.addEventListener('message', handleMessage);

      iframe.onerror = () => {
        clearTimeout(timeout);
        this.cleanupIframe(iframe, handleMessage);
        resolve('');
      };
    });
  }

  private cleanupIframe(iframe: HTMLIFrameElement, messageHandler: (event: MessageEvent) => void): void {
    window.removeEventListener('message', messageHandler);
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  }
}

export const dashboardPreviewService = new DashboardPreviewService();

export const createDashboardPreviewService = (config?: DashboardPreviewConfig) => {
  return new DashboardPreviewService(config);
}; 