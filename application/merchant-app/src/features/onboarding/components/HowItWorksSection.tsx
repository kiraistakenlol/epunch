import React from 'react';
import { MerchantDto, PunchCardDto, LoyaltyProgramDto, PunchCardStyleDto } from 'e-punch-common-core';
import { useI18n } from 'e-punch-common-ui';
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
} from '.';
import { dashboardPreviewService } from '../../../services/dashboardPreview';
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
  const { t, locale } = useI18n('merchantOnboarding');

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
    locale,
  });

  const step4FullPreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-full', loyaltyProgram.id, fullPunches)],
    loyaltyPrograms: [loyaltyProgram],
    renderOnBackgroundColor: 'white',
    locale,
  });

  const step5PreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-reward', loyaltyProgram.id, fullPunches)],
    loyaltyPrograms: [loyaltyProgram],
    selectedCardId: 'demo-card-reward',
    renderOnBackgroundColor: 'white',
    locale,
  });

  const initialCustomerPreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-initial', loyaltyProgram.id, 0)],
    loyaltyPrograms: [loyaltyProgram],
    renderOnBackgroundColor: 'white',
    locale,
  });

  return (
    <section className={styles.howItWorks}>
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('howItWorks.title')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className={styles.stepsContainer}>
          <WorkflowStep
            stepNumber={1}
            title={t('howItWorks.step1.title')}
            description={t('howItWorks.step1.note')}
          >
            {onboardingImageUrl ? (
              <div className={styles.qrCodeContainer}>
                <img
                  src={onboardingImageUrl}
                  alt={t('howItWorks.qrPlaceholder')}
                  className={styles.qrCodeImage}
                />
              </div>
            ) : (
              <div className={styles.qrCodePlaceholder}>
                <p>{t('howItWorks.qrPlaceholder')}</p>
              </div>
            )}
          </WorkflowStep>

          <WorkflowStep
            stepNumber={2}
            title={t('howItWorks.step2.title')}
            description={t('howItWorks.step2.note')}
          >
            <div className={styles.phoneFlowContainer}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <CameraInterface frameOffsetX={-60} frameOffsetY={15} frameSize={100}>
                      {onboardingImageUrl && (
                        <img
                          src={onboardingImageUrl}
                          alt={t('howItWorks.qrPlaceholder')}
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
            title={t('howItWorks.step3.title')}
            description={t('howItWorks.step3.note')}
          >
            <div className={styles.phoneFlowContainer}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantScannerPageMockup frameSize={150} >
                        <div style={{ width: '50%', paddingTop: '10%' }}>
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
            title={t('howItWorks.step4.title', { partial: partialPunches, full: fullPunches })}
            description={t('howItWorks.step4.note')}
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
            title={t('howItWorks.step5.title')}
            description={t('howItWorks.step5.note')}
          >
            <div className={styles.centeredPhone}>
              <PhoneWithUserApp src={step5PreviewUrl} />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={6}
            title={t('howItWorks.step6.title')}
            description={t('howItWorks.step6.note')}
          >
            <div className={styles.phoneFlowContainer}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantScannerPageMockup frameSize={150} >
                        <div style={{ width: '50%', paddingTop: '10%' }}>
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
            title={t('howItWorks.step7.title')}
            description={loyaltyProgram.rewardDescription || t('howItWorks.step7.note')}
            isLast={true}
          >
            <div className={styles.rewardSchema}>
              <div className={styles.rewardIcon}>🎁</div>
              <div className={styles.schemaArrow}>→</div>
              <div className={styles.clientAvatar}>
                <div className={styles.avatarCircle}>
                  <img
                    src="/images/client.png"
                    alt={t('howItWorks.roleBadge.customer')}
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