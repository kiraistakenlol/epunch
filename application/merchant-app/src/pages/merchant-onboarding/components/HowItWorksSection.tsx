import React, { useMemo, useState, useEffect } from 'react';
import { MerchantDto, PunchCardDto, PunchCardStyleDto, LoyaltyProgramDto, emptyPunchCardStyle } from 'e-punch-common-core';
import { WorkflowStep } from './WorkflowStep';
import {
  PhoneFrame,
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
  loyaltyPrograms: LoyaltyProgramDto[];
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  merchant,
  userAppUrl,
  loyaltyPrograms
}) => {
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [merchantStyle, setMerchantStyle] = useState<PunchCardStyleDto | null>(null);

  useEffect(() => {
    if (merchant) {
      fetchMerchantStyle();
    }
  }, [merchant]);

  useEffect(() => {
    if (merchant && merchantStyle && loyaltyPrograms.length > 0 && !onboardingImageUrl && !isGeneratingImage) {
      generateOnboardingImagePreview();
    }
  }, [merchant, merchantStyle, loyaltyPrograms]);

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
        loyaltyPrograms[0]?.name || `${merchant.name} Rewards`
      );
      setOnboardingImageUrl(imageDataUrl);
    } catch (error: any) {
      console.error('Failed to generate onboarding image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const createMockPunchCard = (id: string, loyaltyProgramId: string, currentPunches: number, totalPunches?: number): PunchCardDto => {
    const program = loyaltyPrograms[0];
    return {
      id,
      loyaltyProgramId,
      shopName: merchant.name,
      shopAddress: merchant.address || '',
      currentPunches,
      totalPunches: totalPunches || program?.requiredPunches || 10,
      status: currentPunches >= (totalPunches || program?.requiredPunches || 10) ? 'REWARD_READY' : 'ACTIVE',
      createdAt: new Date().toISOString(),
      styles: merchantStyle || emptyPunchCardStyle
    };
  };

  if (loyaltyPrograms.length === 0) {
    return (
      <section className={styles.howItWorks}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.infoMessage}>
            <h3>📋 Setup Required</h3>
            <p>To see how ePunch works, you'll need to create at least one loyalty program first.</p>
            <p>Go to your dashboard and set up your first loyalty program to see the complete customer experience.</p>
          </div>
        </div>
      </section>
    );
  }

  const primaryLoyaltyProgram = loyaltyPrograms[0];

  const step4PreviewUrl = merchantStyle ? dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-1', primaryLoyaltyProgram.id, 7)],
    loyaltyPrograms: [primaryLoyaltyProgram],
    authState: 'authenticated',
    renderOnBackgroundColor: 'white',
  }) : '';

  const step5PreviewUrl = merchantStyle ? dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-2', primaryLoyaltyProgram.id, primaryLoyaltyProgram.requiredPunches)],
    loyaltyPrograms: [primaryLoyaltyProgram],
    selectedCardId: 'demo-card-2',
    authState: 'authenticated',
    renderOnBackgroundColor: 'white',
  }) : '';

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
                  <PhoneFrame>
                    <CameraInterface frameOffsetX={-60} frameOffsetY={15} frameSize={100}>
                    {onboardingImageUrl && (
                          <img
                            src={onboardingImageUrl}
                            alt="QR Code being scanned"
                            className={styles.qrCodeInCamera}
                          />
                        )}
                    </CameraInterface>
                  </PhoneFrame>
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
            note={primaryLoyaltyProgram.rewardDescription || "Free coffee, discount, or whatever you offer!"}
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