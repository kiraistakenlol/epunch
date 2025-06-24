import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { MerchantDto } from 'e-punch-common-core';
import { apiClient } from 'e-punch-common-ui';

const capturePunchCardDesign = async (merchant: MerchantDto, backgroundColor: string, loyaltyProgramName?: string): Promise<string> => {
  try {
    const merchantStyle = await apiClient.getMerchantDefaultPunchCardStyle(merchant.id);
    
    const baseUrl = import.meta.env.VITE_USER_APP_URL;
    const previewParams = new URLSearchParams({
      merchantName: merchant.name,
      currentPunches: '3',
      totalPunches: '10',
      status: 'ACTIVE',
      hideShadow: 'true',
      renderOnBackgroundColor: backgroundColor
    });

    if (merchantStyle.primaryColor) {
      previewParams.set('primaryColor', merchantStyle.primaryColor);
    }
    if (merchantStyle.secondaryColor) {
      previewParams.set('secondaryColor', merchantStyle.secondaryColor);
    }

    if (merchantStyle.logoUrl) {
      previewParams.set('logoUrl', merchantStyle.logoUrl);
    }

    if (merchantStyle.punchIcons) {
      previewParams.set('punchIcons', JSON.stringify(merchantStyle.punchIcons));
    }

    if (loyaltyProgramName?.trim()) {
      previewParams.set('loyaltyProgramName', loyaltyProgramName.trim());
    }

    const iframeUrl = `${baseUrl}/merchant/card-preview?${previewParams.toString()}`;

    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '500px';
    iframe.style.height = '400px'; // 500/400 = 1.25 aspect ratio
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    return new Promise<string>((resolve) => {
      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        resolve('');
      }, 10000);

      const handleMessage = (event: MessageEvent) => {
        if (event.source !== iframe.contentWindow) return;

        if (event.data.type === 'CARD_PREVIEW_READY') {
          iframe.contentWindow?.postMessage({ type: 'CAPTURE_CARD' }, '*');
        } else if (event.data.type === 'CARD_CAPTURED') {
          clearTimeout(timeout);
          window.removeEventListener('message', handleMessage);
          document.body.removeChild(iframe);
          resolve(event.data.imageDataURL);
        } else if (event.data.type === 'CARD_CAPTURE_ERROR') {
          clearTimeout(timeout);
          window.removeEventListener('message', handleMessage);
          document.body.removeChild(iframe);
          resolve(''); // Fallback to empty string
        }
      };

      window.addEventListener('message', handleMessage);

      iframe.onerror = (error) => {
        clearTimeout(timeout);
        window.removeEventListener('message', handleMessage);
        document.body.removeChild(iframe);
        resolve(''); // Fallback to empty string
      };
    });

  } catch (error) {
    console.error('[PDF] Failed to capture punch card design:', error);
    return '';
  }
};

export const generateOnboardingImage = async (
  merchant: MerchantDto,
  backgroundColor: string,
  qrCodeBackgroundColor: string,
  titleColor: string,
  title: string,
  loyaltyProgramName?: string
): Promise<string> => {
  const qrCodeUrl = `https://epunch.app?merchant=${merchant.slug}`;

  const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  const cardImageDataUrl = await capturePunchCardDesign(merchant, backgroundColor, loyaltyProgramName);

  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '800px';
  tempContainer.style.height = '600px';
  tempContainer.style.backgroundColor = backgroundColor;
  tempContainer.style.padding = '40px';
  tempContainer.style.fontFamily = 'Arial, sans-serif';

  tempContainer.innerHTML = `
    <div style="
      width: 100%;
      height: 100%;
      background: ${backgroundColor};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 30px;
      box-sizing: border-box;
    ">
      <div style="margin-bottom: 20px;">
        <h1 style="
          font-weight: bold;
          color: ${titleColor};
          margin: 0;
          font-size: 4rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">${title}</h1>
      </div>

      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
      ">
          <div style="
            background-color: ${qrCodeBackgroundColor};
            border: 12px solid ${qrCodeBackgroundColor};
            border-radius: 0;
            width: 230px;
            height: 230px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img src="${qrCodeDataURL}" style="width: 100%; height: 100%;" alt="QR Code" />
          </div>

        <div style="
          color: ${titleColor};
          font-weight: 900;
          font-size: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">→</div>

        ${cardImageDataUrl ? `
        <div style="
          width: 350px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        ">
          <img src="${cardImageDataUrl}" style="width: 100%; height: 100%; object-fit: contain;" alt="Punch Card Preview" />
        </div>` : `
        <div style="
          width: 280px;
          height: 180px;
          background-color: #8d6e63;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(93, 64, 55, 0.3);
        ">
          <div style="
            background-color: #5d4037;
            color: ${titleColor};
            padding: 12px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="font-weight: bold; font-size: 1.1rem;">${merchant.name}</span>
          </div>

          <div style="
            padding: 15px;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          ">
            <div style="
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 6px;
              width: 100%;
              justify-items: center;
            ">
              ${[...Array(10)].map((_, index) => {
    const isFilled = index < 3;
    const color = isFilled ? '#3e2723' : 'rgba(250, 250, 232, 0.78)';

    return `<div style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background-color: ${color};
                  border: 2px solid #5d4037;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "></div>`;
  }).join('')}
            </div>

            <div style="
              color: ${titleColor};
              font-size: 0.9rem;
              font-weight: 500;
              text-align: center;
            ">
              Buy 10, Get 1 Free
            </div>
          </div>
        </div>`}
      </div>
    </div>
  `;

  document.body.appendChild(tempContainer);

  try {
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(tempContainer, {
      backgroundColor: backgroundColor,
      width: 800,
      height: 600,
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    return canvas.toDataURL('image/png');

  } finally {
    document.body.removeChild(tempContainer);
  }
};

export const downloadImage = (imageDataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = imageDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};