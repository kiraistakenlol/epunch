import React from 'react';
import { MerchantDto, PunchCardDto, PunchCardStyleDto, LoyaltyProgramDto } from 'e-punch-common-core';
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
import styles from './HowItWorksSection.module.css';

interface HowItWorksSectionProps {
  merchant: MerchantDto;
  loyaltyProgram: LoyaltyProgramDto;
  punchCardStyle: PunchCardStyleDto;
  onboardingImageUrl: string | undefined;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  merchant,
  loyaltyProgram,
  punchCardStyle,
  onboardingImageUrl
}) => {

  const createMockPunchCard = (id: string, loyaltyProgramId: string, currentPunches: number, totalPunches?: number): PunchCardDto => {
    const requiredPunches = totalPunches || loyaltyProgram.requiredPunches;
    return {
      id,
      loyaltyProgramId,
      shopName: merchant.name,
      shopAddress: merchant.address || '',
      currentPunches,
      totalPunches: requiredPunches,
      status: currentPunches >= requiredPunches ? 'REWARD_READY' : 'ACTIVE',
      createdAt: new Date().toISOString(),
      styles: punchCardStyle
    };
  };

  const partialPunches = Math.floor(loyaltyProgram.requiredPunches * 0.7);
  const fullPunches = loyaltyProgram.requiredPunches;

  const step4PartialPreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-partial', loyaltyProgram.id, partialPunches)],
    loyaltyPrograms: [loyaltyProgram],
    renderOnBackgroundColor: 'white',
  });

  const step4FullPreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-full', loyaltyProgram.id, fullPunches)],
    loyaltyPrograms: [loyaltyProgram],
    renderOnBackgroundColor: 'white',
  });

  const step5PreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-reward', loyaltyProgram.id, fullPunches)],
    loyaltyPrograms: [loyaltyProgram],
    selectedCardId: 'demo-card-reward',
    renderOnBackgroundColor: 'white',
  });

  const initialCustomerPreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-initial', loyaltyProgram.id, 0)],
    loyaltyPrograms: [loyaltyProgram],
    renderOnBackgroundColor: 'white',
  });

  return (
    <section className={styles.howItWorks}>
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Actually Works</h2>
          <p className={styles.sectionSubtitle}>
            Simple, fast, and works instantly with any smartphone
          </p>
        </div>

        <div className={styles.stepsContainer}>
          <WorkflowStep
            stepNumber={1}
            role="you"
            title="Put this QR code where people can see it"
            note="Print it, frame it, or display it digitally"
            showArrow={true}
          >
            {onboardingImageUrl ? (
              <div className={styles.qrCodeContainer}>
                <img
                  src={onboardingImageUrl}
                  alt="Your QR Code for clients to scan"
                  className={styles.qrCodeImage}
                />
              </div>
            ) : (
              <div className={styles.qrCodePlaceholder}>
                <p>QR Code will appear here</p>
              </div>
            )}
          </WorkflowStep>

          <WorkflowStep
            stepNumber={2}
            role="customer"
            title="Customer scans with their phone"
            note="No app downloads, no sign-ups, just works instantly"
            showArrow={true}
          >
            <div className={styles.phoneFlowContainer}>
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
                  <PhoneWithUserApp src={initialCustomerPreviewUrl} />
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={3}
            role="you"
            title="Scan their QR code back & hit PUNCH"
            note="Takes 2 seconds on your phone"
            showArrow={true}
          >
            <div className={styles.phoneFlowContainer}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantScannerPageMockup frameSize={150} frameOffsetY={-20} >
                        <div style={{ width: '70%', height: '100%', paddingTop: '10%' }}>
                          <PhoneWithUserApp src={initialCustomerPreviewUrl} />
                        </div>
                      </MerchantScannerPageMockup>
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
                secondScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantCustomerScanResult loyaltyProgram={loyaltyProgram} />
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={4}
            role="customer"
            title={`They watch their card fill up (${partialPunches}/${fullPunches} → ${fullPunches}/${fullPunches})`}
            note="Instant gratification with every visit"
            showArrow={true}
          >
            <div className={styles.phoneFlowContainer}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneWithUserApp src={step4PartialPreviewUrl} />
                }
                secondScreen={
                  <PhoneWithUserApp src={step4FullPreviewUrl} />
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={5}
            role="customer"
            title="Card full = special reward QR appears"
            note="They know exactly when they've earned it"
            showArrow={true}
          >
            <div className={styles.centeredPhone}>
              <PhoneWithUserApp src={step5PreviewUrl} />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={6}
            role="you"
            title="Scan reward QR, hit REDEEM, done"
            note="Card automatically resets for round 2"
            showArrow={true}
          >
            <div className={styles.phoneFlowContainer}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantScannerPageMockup frameSize={150} frameOffsetY={-20} >
                        <div style={{ width: '70%', height: '100%', paddingTop: '10%' }}>
                          <PhoneWithUserApp src={step5PreviewUrl} />
                        </div>
                      </MerchantScannerPageMockup>
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
                secondScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantPunchCardRedeemResult
                        merchant={merchant}
                        loyaltyProgram={loyaltyProgram}
                      />
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={7}
            role="customer"
            title="Happy customer gets their reward"
            note={loyaltyProgram.rewardDescription || "And starts dreaming about their next free coffee"}
          >
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
          </WorkflowStep>
        </div>
      </div>
    </section>
  );
}; 