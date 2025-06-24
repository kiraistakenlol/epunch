import { PunchIconsDto } from 'e-punch-common-core';

export interface PunchCardPreviewParams {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string | null;
  punchIcons?: PunchIconsDto | null;
  merchantName?: string;
  loyaltyProgramName?: string;
  currentPunches?: number;
  totalPunches?: number;
  status?: 'ACTIVE' | 'REWARD_READY' | 'REWARD_REDEEMED';
  showAnimations?: boolean;
  hideShadow?: boolean;
  renderOnBackgroundColor?: string;
}

export interface PunchCardPreviewConfig {
  baseUrl?: string;
  timeout?: number;
}

class PunchCardPreviewService {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(config: PunchCardPreviewConfig = {}) {
    this.baseUrl = config.baseUrl || import.meta.env.VITE_USER_APP_URL || 'http://localhost:5173';
    this.defaultTimeout = config.timeout || 10000;
  }

  private buildPreviewUrl(params: PunchCardPreviewParams): string {
    const previewUrl = new URL(`${this.baseUrl}/merchant/card-preview`);
    
    const {
      primaryColor,
      secondaryColor,
      logoUrl,
      punchIcons,
      merchantName = 'Preview Merchant',
      loyaltyProgramName,
      currentPunches = 3,
      totalPunches = 10,
      status = 'ACTIVE',
      showAnimations = false,
      hideShadow = false,
      renderOnBackgroundColor = 'transparent'
    } = params;

    previewUrl.searchParams.set('merchantName', merchantName);
    previewUrl.searchParams.set('currentPunches', currentPunches.toString());
    previewUrl.searchParams.set('totalPunches', totalPunches.toString());
    previewUrl.searchParams.set('status', status);
    previewUrl.searchParams.set('animations', showAnimations.toString());
    previewUrl.searchParams.set('hideShadow', hideShadow.toString());
    previewUrl.searchParams.set('renderOnBackgroundColor', renderOnBackgroundColor);

    if (primaryColor) previewUrl.searchParams.set('primaryColor', primaryColor);
    if (secondaryColor) previewUrl.searchParams.set('secondaryColor', secondaryColor);
    if (logoUrl) previewUrl.searchParams.set('logoUrl', logoUrl);
    if (loyaltyProgramName?.trim()) previewUrl.searchParams.set('loyaltyProgramName', loyaltyProgramName.trim());
    if (punchIcons) previewUrl.searchParams.set('punchIcons', JSON.stringify(punchIcons));

    return previewUrl.toString();
  }

  public getPreviewUrl(params: PunchCardPreviewParams): string {
    return this.buildPreviewUrl(params);
  }

  public async captureCardImage(params: PunchCardPreviewParams): Promise<string> {
    const iframeUrl = this.buildPreviewUrl(params);

    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '500px';
    iframe.style.height = '400px';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    return new Promise<string>((resolve) => {
      const timeout = setTimeout(() => {
        this.cleanupIframe(iframe, handleMessage);
        resolve('');
      }, this.defaultTimeout);

      const handleMessage = (event: MessageEvent) => {
        if (event.source !== iframe.contentWindow) return;

        if (event.data.type === 'CARD_PREVIEW_READY') {
          iframe.contentWindow?.postMessage({ type: 'CAPTURE_CARD' }, '*');
        } else if (event.data.type === 'CARD_CAPTURED') {
          clearTimeout(timeout);
          this.cleanupIframe(iframe, handleMessage);
          resolve(event.data.imageDataURL);
        } else if (event.data.type === 'CARD_CAPTURE_ERROR') {
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

export const punchCardPreviewService = new PunchCardPreviewService();

export const createPunchCardPreviewService = (config?: PunchCardPreviewConfig) => {
  return new PunchCardPreviewService(config);
}; 