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
  
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | undefined>(undefined);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [merchantStyle, setMerchantStyle] = useState<PunchCardStyleDto | undefined>(undefined);
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgramDto | undefined>(undefined);
  const [isLoadingLoyaltyProgram, setIsLoadingLoyaltyProgram] = useState(true);
  const [loyaltyProgramError, setLoyaltyProgramError] = useState<string | undefined>(undefined);

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
    if (merchant && merchantStyle && loyaltyProgram && !onboardingImageUrl && !isGeneratingImage) {
      generateOnboardingImagePreview();
    }
  }, [merchant, merchantStyle, loyaltyProgram, onboardingImageUrl, isGeneratingImage]);

  const fetchMerchantData = async () => {
    if (!merchant) return;

    try {
      await Promise.all([
        fetchMerchantStyle(),
        fetchLoyaltyProgram()
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

  const fetchLoyaltyProgram = async () => {
    if (!merchant) return;

    try {
      setIsLoadingLoyaltyProgram(true);
      setLoyaltyProgramError(undefined);
      const programs = await apiClient.getMerchantLoyaltyPrograms(merchant.id);
      
      if (programs.length === 0) {
        setLoyaltyProgramError('No loyalty programs found.');
        setLoyaltyProgram(undefined);
        return [];
      }

      const sortedPrograms = [...programs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setLoyaltyProgram(sortedPrograms[0]);
      return programs;
    } catch (error: any) {
      console.error('Failed to fetch loyalty program:', error);
      setLoyaltyProgramError('Failed to load loyalty program.');
      setLoyaltyProgram(undefined);
      return [];
    } finally {
      setIsLoadingLoyaltyProgram(false);
    }
  };

  const generateOnboardingImagePreview = async () => {
    if (!merchant || !merchantStyle || !loyaltyProgram) return;

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
        loyaltyProgram.name || `${merchant.name} Rewards`
      );
      setOnboardingImageUrl(imageDataUrl);
    } catch (error: any) {
      console.error('Failed to generate onboarding image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (merchantLoading || isLoadingLoyaltyProgram) {
    return <LoadingState />;
  }

  if (merchantError || !merchant) {
    return <ErrorState merchantSlug={merchantSlug || 'unknown'} />;
  }

  if (loyaltyProgramError || !loyaltyProgram) {
    return (
      <div className={styles.container}>
        <TopContactBar />
        <div className={styles.errorContainer}>
          <h1>Loyalty Program Required</h1>
          <p>
            {loyaltyProgramError || 'This merchant needs to set up a loyalty program first.'}
          </p>
          <p>
            Contact the merchant to create a loyalty program before accessing this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TopContactBar />
      
      {merchantStyle && (
        <HeroSection
          merchant={merchant}
          loyaltyProgram={loyaltyProgram}
          punchCardStyle={merchantStyle}
        />
      )}

      <PhysicalVSDigigalCoparisonSection />

      <FeaturesSection />

      <HowItWorksSection
        merchant={merchant}
        loyaltyProgram={loyaltyProgram}
        punchCardStyle={merchantStyle || emptyPunchCardStyle}
        onboardingImageUrl={onboardingImageUrl}
      />

      <BenefitsSection merchant={merchant} />

      <FuturePlansSection />

      <SocialProofSection />

      <CTASection merchant={merchant} />
    </div>
  );
}; 