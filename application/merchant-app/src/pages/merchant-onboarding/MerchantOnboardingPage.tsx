import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchMerchantBySlug } from '../../store/merchantSlice';
import { generateOnboardingImage } from '../../utils/onboardingImageUtil';
import { apiClient, appColors } from 'e-punch-common-ui';
import { PunchCardStyleDto, LoyaltyProgramDto, emptyPunchCardStyle } from 'e-punch-common-core';
import {
  TopContactBar,
  HeroSection,
  HowItWorksSection,
  PhysicalVSDigigalCoparisonSection,
  FeaturesSection,
  FuturePlansSection,
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
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramDto[]>([]);
  const [isLoadingLoyaltyPrograms, setIsLoadingLoyaltyPrograms] = useState(true);

  useEffect(() => {
    if (merchantSlug) {
      dispatch(fetchMerchantBySlug(merchantSlug));
    }
  }, [merchantSlug, dispatch]);

  useEffect(() => {
    if (merchant) {
      fetchMerchantData();
    }
  }, [merchant]);

  useEffect(() => {
    if (merchant && merchantStyle && loyaltyPrograms.length > 0 && !onboardingImageUrl && !isGeneratingImage) {
      generateOnboardingImagePreview();
    }
  }, [merchant, merchantStyle, loyaltyPrograms, onboardingImageUrl, isGeneratingImage]);

  const fetchMerchantData = async () => {
    if (!merchant) return;

    try {
      await Promise.all([
        fetchMerchantStyle(),
        fetchLoyaltyPrograms()
      ]);
    } catch (error: any) {
      console.error('Failed to fetch merchant data:', error);
    }
  };

  const fetchMerchantStyle = async () => {
    if (!merchant) return;

    try {
      const style = await apiClient.getMerchantDefaultPunchCardStyle(merchant.id);
      setMerchantStyle(style);
      return style;
    } catch (error: any) {
      console.error('Failed to fetch merchant style:', error);
      const defaultStyle = {
        primaryColor: appColors.epunchOrangeDark,
        secondaryColor: appColors.epunchWhite,
        logoUrl: null,
        backgroundImageUrl: null,
        punchIcons: null
      };
      setMerchantStyle(defaultStyle);
      return defaultStyle;
    }
  };

  const fetchLoyaltyPrograms = async () => {
    if (!merchant) return;

    try {
      setIsLoadingLoyaltyPrograms(true);
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchant.id);
      const sortedPrograms = [...programs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setLoyaltyPrograms(sortedPrograms);
      return programs;
    } catch (error: any) {
      console.error('Failed to fetch loyalty programs:', error);
      setLoyaltyPrograms([]);
      return [];
    } finally {
      setIsLoadingLoyaltyPrograms(false);
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
        loyaltyPrograms[0]?.name || `${merchant.name} Rewards`
      );
      setOnboardingImageUrl(imageDataUrl);
    } catch (error: any) {
      console.error('Failed to generate onboarding image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (merchantLoading || isLoadingLoyaltyPrograms) {
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
        loyaltyPrograms={loyaltyPrograms}
      />

      {!isLoadingLoyaltyPrograms && loyaltyPrograms.length > 0 && (
        <HowItWorksSection
          merchant={merchant}
          userAppUrl={userAppUrl}
          loyaltyPrograms={loyaltyPrograms}
          punchCardStyle={merchantStyle || emptyPunchCardStyle}
          onboardingImageUrl={onboardingImageUrl}
        />
      )}

      <PhysicalVSDigigalCoparisonSection />

      <FeaturesSection />

      <BenefitsSection merchant={merchant} />

      <SocialProofSection />

      <FuturePlansSection />

      <CTASection merchant={merchant} />
    </div>
  );
}; 