import React, { useMemo, useState, useEffect } from 'react';
import { MerchantDto, PunchCardDto, PunchCardStyleDto } from 'e-punch-common-core';
import { WorkflowStep } from './WorkflowStep';
import {
  PhoneFrame,
  PhoneFrameNew,
  MerchantAppMobileFrameMockup,
  MerchantScannerPageMockup,
  MerchantCustomerScanResult,
  MerchantPunchCardRedeemResult,
  TwoScreenFlow,
  PhoneWithUserApp,
  CameraInterface
} from '../../../components/shared';
import { dashboardPreviewService } from '../../../utils/dashboardPreviewService';
import { generateOnboardingImage } from '../../../utils/onboardingImageUtil';
import { apiClient, appColors } from 'e-punch-common-ui';
import styles from './HowItWorksSection.module.css';

interface HowItWorksSectionProps {
  merchant: MerchantDto;
  userAppUrl: string;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  merchant,
  userAppUrl
}) => {
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [merchantStyle, setMerchantStyle] = useState<PunchCardStyleDto | null>(null);

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
      const backgroundColor = appColors.epunchBrown;
      const qrBackgroundColor = appColors.epunchWhite;
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

  // Create mock punch card data with 7/10 punches for step 4
  const punchCardWith7Punches: PunchCardDto = useMemo(() => ({
    id: 'demo-card-1',
    loyaltyProgramId: 'demo-loyalty-1',
    shopName: merchant.name,
    shopAddress: merchant.address || '123 Main Street',
    currentPunches: 7,
    totalPunches: 10,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),
    styles: {
      primaryColor: '#8B4513',
      secondaryColor: '#F4E4BC',
      logoUrl: null,
      backgroundImageUrl: null,
      punchIcons: null
    }
  }), [merchant.name, merchant.address]);

  // Create mock punch card data with 10/10 punches (completed) for step 5
  const completedPunchCard: PunchCardDto = useMemo(() => ({
    id: 'demo-card-2',
    loyaltyProgramId: 'demo-loyalty-2',
    shopName: merchant.name,
    shopAddress: merchant.address || '123 Main Street',
    currentPunches: 10,
    totalPunches: 10,
    status: 'REWARD_READY' as const,
    createdAt: new Date().toISOString(),
    styles: {
      primaryColor: '#8B4513',
      secondaryColor: '#F4E4BC',
      logoUrl: null,
      backgroundImageUrl: null,
      punchIcons: null
    }
  }), [merchant.name, merchant.address]);

  // Generate preview URL for step 4
  const step4PreviewUrl = useMemo(() => {
    return dashboardPreviewService.getPreviewUrl({
      cards: [punchCardWith7Punches],
      authState: 'authenticated',
      renderOnBackgroundColor: 'white'
    });
  }, [punchCardWith7Punches]);

  // Generate preview URL for step 5 (completed card)
  const step5PreviewUrl = useMemo(() => {
    return dashboardPreviewService.getPreviewUrl({
      cards: [completedPunchCard],
      selectedCardId: 'demo-card-2', // Show the card as selected for redemption
      authState: 'authenticated',
      renderOnBackgroundColor: 'white'
    });
  }, [completedPunchCard]);

  return (
    <section className={styles.howItWorks}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>
          How It Works
        </h2>

        <div className={styles.stepsContainer}>
          <WorkflowStep
            stepNumber={1}
            role="you"
            title="Print and display at checkout"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              {onboardingImageUrl ? (
                <div className={styles.qrCodeImageContainer}>
                  <img
                    src={onboardingImageUrl}
                    alt="Your QR Code for customers to scan"
                    className={styles.qrCodeImage}
                  />
                </div>
              ) : (
                <div className={styles.qrCodePlaceholder}>
                  <p>QR Code will appear here</p>
                </div>
              )}
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={2}
            role="customer"
            title="Customer scans your QR code"
            note="Opens ePunch instantly, no app download"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrameNew>
                    <CameraInterface frameOffsetX={-60} frameOffsetY={15} frameSize={100}>
                    {onboardingImageUrl && (
                          <img
                            src={onboardingImageUrl}
                            alt="QR Code being scanned"
                            className={styles.qrCodeInCamera}
                          />
                        )}
                    </CameraInterface>
                  </PhoneFrameNew>
                }
                secondScreen={
                  <PhoneWithUserApp src={userAppUrl} />
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={3}
            role="you"
            title="Scan client's QR and PUNCH"
            note="Simple one-tap process"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantScannerPageMockup frameSize={150} frameOffsetY={-35}>
                        <div style={{width: '200px', aspectRatio: '375 / 667'}}>
                          <PhoneWithUserApp src={userAppUrl} />
                        </div>
                      </MerchantScannerPageMockup>
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
                secondScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantCustomerScanResult merchant={merchant} />
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={4}
            role="customer"
            title="Card fills up over time"
            note="Each visit adds +1 punch automatically"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <div className={styles.cardProgressDemo}>
                <div className={styles.resultPhone}>
                  <div className={styles.regularPhoneContainer}>
                    <PhoneWithUserApp src={step4PreviewUrl} />
                  </div>
                </div>
              </div>
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={5}
            role="customer"
            title="Shows reward QR when ready"
            note="Special QR appears when card is full"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <div className={styles.cardCompletionDemo}>
                <div className={styles.resultPhone}>
                <div className={styles.regularPhoneContainer}>
                    <PhoneWithUserApp src={step5PreviewUrl} />
                  </div>
                </div>
              </div>
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={6}
            role="you"
            title="Scan reward, hit 'REDEEM'"
            note="Card resets automatically"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantScannerPageMockup>
                        <div style={{width: '70%', height: '100%', paddingTop: '10%'}}>
                          <PhoneWithUserApp src={step5PreviewUrl} />
                        </div>
                      </MerchantScannerPageMockup>
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
                secondScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantPunchCardRedeemResult merchant={merchant} />
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={7}
            role="customer"
            title="Customer gets reward"
            note="Free coffee, discount, or whatever you offer!"
          >
            <div className={styles.singleStep}>
              <div className={styles.rewardSchema}>
                <div className={styles.rewardIcon}>🎁</div>
                <div className={styles.schemaArrow}>→</div>
                <div className={styles.clientAvatar}>
                  <div className={styles.avatarCircle}>
                    <img
                      src="/images/client.png"
                      alt="Customer"
                      className={styles.clientAvatarImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </WorkflowStep>
        </div>

        <div className={styles.replacementHighlight}>
          <h3>🔄 No More Physical Cards</h3>
          <div className={styles.comparison}>
            <div className={styles.oldWay}>
              <h4>❌ Old Way</h4>
              <ul>
                <li>Print thousands of cards</li>
                <li>Customers lose cards</li>
                <li>Cards get damaged</li>
                <li>Expensive to replace</li>
              </ul>
            </div>
            <div className={styles.newWay}>
              <h4>✅ ePunch Way</h4>
              <ul>
                <li>One QR code - print once</li>
                <li>Never lose digital cards</li>
                <li>Always perfect condition</li>
                <li>Zero ongoing costs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 