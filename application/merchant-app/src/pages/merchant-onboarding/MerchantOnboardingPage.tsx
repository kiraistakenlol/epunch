import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchMerchantBySlug } from '../../store/merchantSlice';
import { generateOnboardingImage } from '../../utils/onboardingImageUtil';
import { apiClient, appColors } from 'e-punch-common-ui';
import { PunchCardStyleDto } from 'e-punch-common-core';
import {
  TopContactBar,
  HeroSection,
  HowItWorksSection,
  BenefitsSection,
  SocialProofSection,
  CTASection,
  LoadingState,
  ErrorState
} from './components';
import styles from './MerchantOnboardingPage.module.css';

export const MerchantOnboardingPage: React.FC = () => {
  const { merchantSlug } = useParams<{ merchantSlug: string }>();
  const dispatch = useAppDispatch();
  const { merchant, loading: merchantLoading, error: merchantError } = useAppSelector((state) => state.merchant);
  
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [merchantStyle, setMerchantStyle] = useState<PunchCardStyleDto | null>(null);

  useEffect(() => {
    if (merchantSlug) {
      dispatch(fetchMerchantBySlug(merchantSlug));
    }
  }, [merchantSlug, dispatch]);

  useEffect(() => {
    if (merchant && !merchantStyle) {
      fetchMerchantStyle();
    }
  }, [merchant]);

  useEffect(() => {
    if (merchant && merchantStyle && !onboardingImageUrl && !isGeneratingImage) {
      generateOnboardingImagePreview();
    }
  }, [merchant, merchantStyle]);

  const fetchMerchantStyle = async () => {
    if (!merchant) return;

    try {
      const style = await apiClient.getMerchantDefaultPunchCardStyle(merchant.id);
      setMerchantStyle(style);
    } catch (error: any) {
      console.error('Failed to fetch merchant style:', error);
      setMerchantStyle({
        primaryColor: appColors.epunchOrangeDark,
        secondaryColor: appColors.epunchWhite,
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      });
    }
  };

  const generateOnboardingImagePreview = async () => {
    if (!merchant || !merchantStyle) return;

    try {
      setIsGeneratingImage(true);
      const backgroundColor = merchantStyle.primaryColor || appColors.epunchOrangeDark;
      const qrBackgroundColor = merchantStyle.secondaryColor || appColors.epunchWhite;
      const titleColor = appColors.epunchWhite;
      
      const imageDataUrl = await generateOnboardingImage(
        merchant,
        backgroundColor,
        qrBackgroundColor,
        titleColor,
        merchant.name,
        `${merchant.name} Rewards`
      );
      setOnboardingImageUrl(imageDataUrl);
    } catch (error: any) {
      console.error('Failed to generate onboarding image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (merchantLoading) {
    return <LoadingState />;
  }

  if (merchantError || !merchant) {
    return <ErrorState merchantSlug={merchantSlug || 'unknown'} />;
  }

  const baseUrl = import.meta.env.VITE_USER_APP_URL || 'https://epunch.app';
  const userAppUrl = `${baseUrl}?merchant=${merchant.slug}`;

  return (
    <div className={styles.container}>
      <TopContactBar />
      
      <HeroSection
        merchant={merchant}
        userAppUrl={userAppUrl}
        onboardingImageUrl={onboardingImageUrl}
        isGeneratingImage={isGeneratingImage}
      />

      <HowItWorksSection
        merchant={merchant}
        userAppUrl={userAppUrl}
        onboardingImageUrl={onboardingImageUrl}
      />

      <BenefitsSection merchant={merchant} />

      <SocialProofSection />

      <CTASection merchant={merchant} />
    </div>
  );
}; 