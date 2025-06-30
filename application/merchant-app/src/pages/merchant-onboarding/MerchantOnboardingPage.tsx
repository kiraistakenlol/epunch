import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchMerchantBySlug } from '../../store/merchantSlice';
import { generateOnboardingImage } from '../../utils/onboardingImageUtil';
import { apiClient, appColors } from 'e-punch-common-ui';
import { useTranslation } from 'react-i18next';
import { PunchCardStyleDto, LoyaltyProgramDto, emptyPunchCardStyle } from 'e-punch-common-core';
import {
  TopContactBar,
  TeaserSection,
  HeroSection,
  HowItWorksSection,
  ProblemSolutionSection,
  FuturePlansSection,
  BenefitsSection,
  SocialProofSection,
  CTASection,
  LoadingState,
  ErrorState
} from './components';
import styles from './MerchantOnboardingPage.module.css';

export const MerchantOnboardingPage: React.FC = () => {
  const { t } = useTranslation('merchantOnboarding');
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
        setLoyaltyProgramError(t('error.loyaltyProgramSetupFirst'));
        setLoyaltyProgram(undefined);
        return [];
      }

      const sortedPrograms = [...programs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setLoyaltyProgram(sortedPrograms[0]);
      return programs;
    } catch (error: any) {
      console.error('Failed to fetch loyalty program:', error);
      setLoyaltyProgramError(t('error.loyaltyProgramSetupFirst'));
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
          <h1>{t('error.loyaltyProgramRequired')}</h1>
          <p>
            {loyaltyProgramError || t('error.loyaltyProgramSetupFirst')}
          </p>
          <p>
            {t('error.contactMerchant')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TopContactBar />
      
      <TeaserSection merchant={merchant} />
      
      <div id="hero">
        {merchantStyle && (
          <HeroSection
            merchant={merchant}
            loyaltyProgram={loyaltyProgram}
            punchCardStyle={merchantStyle}
          />
        )}
      </div>

      <div id="comparison">
        <ProblemSolutionSection />
      </div>

      <div id="benefits">
        <BenefitsSection merchant={merchant} />
      </div>

      <div id="how-it-works">
        <HowItWorksSection
          merchant={merchant}
          loyaltyProgram={loyaltyProgram}
          punchCardStyle={merchantStyle || emptyPunchCardStyle}
          onboardingImageUrl={onboardingImageUrl}
        />
      </div>

      <div id="future">
        <FuturePlansSection />
      </div>

      <div id="social-proof">
        <SocialProofSection />
      </div>

      <div id="get-started">
        <CTASection merchant={merchant} />
      </div>
    </div>
  );
}; 