import React, { useState, useEffect } from 'react';
import {
  EpunchPage,
  EpunchCard,
  EpunchInput,
  EpunchColorPicker,
  EpunchButon,
  EpunchSpinner,
} from '../../components/foundational';
import { useAppSelector } from '../../store/hooks';
import { generateOnboardingImage, downloadImage } from '../../utils/onboardingImageUtil';
import { showSuccessToast, showErrorToast } from '../../utils/toast';
import styles from './WelcomeQRPage.module.css';
import { appColors } from '../../../../common-ui/src/theme/colors';

export const WelcomeQRPage: React.FC = () => {
  const { merchant, loading: merchantLoading, error: merchantError } = useAppSelector((state) => state.merchant);
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [loyaltyProgramName, setLoyaltyProgramName] = useState<string>('');
  const [titleColor, setTitleColor] = useState<string>(appColors.epunchWhite);
  const [title, setTitle] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>(appColors.epunchOrangeDark);
  const [qrCodeBackgroundColor, setQrCodeBackgroundColor] = useState<string>(appColors.epunchWhite);

  useEffect(() => {
    if (merchant && !title) {
      setTitle(merchant.name);
      if (!loyaltyProgramName) {
        setLoyaltyProgramName(`${merchant.name} Rewards`);
      }
    }
  }, [merchant, title, loyaltyProgramName]);

  useEffect(() => {
    if (merchant && !onboardingImageUrl && !isGeneratingImage && title) {
      generateOnboardingImagePreview();
    }
  }, [merchant, title]);

  const generateOnboardingImagePreview = async () => {
    if (!merchant || !title) return;

    try {
      setIsGeneratingImage(true);
      const imageDataUrl = await generateOnboardingImage(
        merchant,
        backgroundColor,
        qrCodeBackgroundColor,
        titleColor,
        title,
        loyaltyProgramName
      );
      setOnboardingImageUrl(imageDataUrl);
    } catch (error: any) {
      console.error('Failed to generate onboarding image:', error);
      showErrorToast('Failed to generate image preview');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!merchant || !onboardingImageUrl) return;

    try {
      const filename = `${merchant.name.replace(/[^a-zA-Z0-9]/g, '_')}_Welcome_QR.png`;
      downloadImage(onboardingImageUrl, filename);
      showSuccessToast('Image downloaded successfully!');
    } catch (error: any) {
      console.error('Failed to download image:', error);
      showErrorToast('Failed to download image');
    }
  };

  const handleRegenerateImage = () => {
    setOnboardingImageUrl(null);
    if (merchant) {
      generateOnboardingImagePreview();
    }
  };

  if (merchantLoading) {
    return (
      <EpunchPage title="Welcome QR Code" isLoading={true}>
        <div />
      </EpunchPage>
    );
  }

  if (merchantError) {
    return (
      <EpunchPage title="Welcome QR Code">
        <div className={styles['welcomeQRPage-errorContainer']}>
          <h2 className={styles['welcomeQRPage-errorTitle']}>
            Error loading merchant data: {merchantError}
          </h2>
        </div>
      </EpunchPage>
    );
  }

  if (!merchant) {
    return (
      <EpunchPage title="Welcome QR Code">
        <div className={styles['welcomeQRPage-errorContainer']}>
          <h2 className={styles['welcomeQRPage-errorTitle']}>
            Unable to load merchant data
          </h2>
        </div>
      </EpunchPage>
    );
  }

  return (
    <EpunchPage title="Welcome QR Code">
      <div className={styles['welcomeQRPage-container']}>
        <EpunchCard>
          <div className={styles['welcomeQRPage-contentLayout']}>
            {/* Controls Section */}
            <div className={styles['welcomeQRPage-controlsSection']}>
              <EpunchInput
                label="Title"
                placeholder="Your business name or title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <EpunchInput
                label="Loyalty Program Name"
                placeholder="e.g., Coffee Rewards, VIP Program"
                value={loyaltyProgramName}
                onChange={(e) => setLoyaltyProgramName(e.target.value)}
              />

              <EpunchColorPicker
                label="Background Color"
                value={backgroundColor}
                onChange={setBackgroundColor}
              />

              <EpunchColorPicker
                label="QR Code Background Color"
                value={qrCodeBackgroundColor}
                onChange={setQrCodeBackgroundColor}
              />

              <EpunchColorPicker
                label="Title Color"
                value={titleColor}
                onChange={setTitleColor}
              />

              <div className={styles['welcomeQRPage-buttonContainer']}>
                <EpunchButon
                  onClick={handleRegenerateImage}
                  disabled={isGeneratingImage}
                  className={styles['welcomeQRPage-primaryButton']}
                >
                  Apply
                </EpunchButon>
              </div>
            </div>

            {/* Preview Section */}
            <div className={styles['welcomeQRPage-previewSection']}>
              {isGeneratingImage ? (
                <div className={styles['welcomeQRPage-loadingContainer']}>
                  <EpunchSpinner size="lg" />
                  <p className={styles['welcomeQRPage-loadingText']}>
                    Generating your QR code...
                  </p>
                </div>
              ) : onboardingImageUrl ? (
                <div className={styles['welcomeQRPage-imagePreviewContainer']}>
                  <div className={styles['welcomeQRPage-imageWrapper']}>
                    <img
                      src={onboardingImageUrl}
                      alt="QR Code Image Preview"
                      className={styles['welcomeQRPage-previewImage']}
                    />
                  </div>

                  <div className={styles['welcomeQRPage-buttonContainer']}>
                    <EpunchButon
                      onClick={handleDownloadImage}
                      disabled={!onboardingImageUrl}
                      className={styles['welcomeQRPage-downloadButton']}
                    >
                      Download
                    </EpunchButon>
                  </div>
                </div>
              ) : (
                <div className={styles['welcomeQRPage-loadingContainer']}>
                  <p className={styles['welcomeQRPage-noPreviewText']}>
                    Preview will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </EpunchCard>
      </div>
    </EpunchPage>
  );
}; 