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
  userAppUrl: string;
  loyaltyProgram: LoyaltyProgramDto;
  punchCardStyle: PunchCardStyleDto;
  onboardingImageUrl: string | undefined;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  merchant,
  userAppUrl,
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

  const step4PreviewUrl = dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-1', loyaltyProgram.id, 7)],
    loyaltyPrograms: [loyaltyProgram],
    renderOnBackgroundColor: 'white',
  });



  const step5PreviewUrl =  dashboardPreviewService.getPreviewUrl({
    cards: [createMockPunchCard('demo-card-2', loyaltyProgram.id, loyaltyProgram.requiredPunches)],
    loyaltyPrograms: [loyaltyProgram],
    selectedCardId: 'demo-card-2',
    renderOnBackgroundColor: 'white',
  });

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
                    alt="Your QR Code for clients to scan"
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
            title="Scans your QR code"
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
            title="Scan & punch their card"
            note="Use your phone or tablet"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <TwoScreenFlow
                firstScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantScannerPageMockup frameSize={150} frameOffsetY={-20} >
                        <div style={{width: '70%', height: '100%', paddingTop: '10%'}}>
                          <PhoneWithUserApp src={userAppUrl} />
                        </div>
                      </MerchantScannerPageMockup>
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
                secondScreen={
                  <PhoneFrame>
                    <MerchantAppMobileFrameMockup merchant={merchant}>
                      <MerchantCustomerScanResult 
                        merchant={merchant} 
                      />
                    </MerchantAppMobileFrameMockup>
                  </PhoneFrame>
                }
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={4}
            role="customer"
            title="Punch card fills up (7/10)"
            note="Visual progress tracking"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <div className={styles.commonPhoneContainer}>
                <PhoneWithUserApp src={step4PreviewUrl} />
              </div>
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={5}
            role="customer"
            title="Shows reward QR when card is full (10/10)"
            note="Special QR appears when card is full"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <div className={styles.commonPhoneContainer}>
                <PhoneWithUserApp src={step5PreviewUrl} />
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
                      <MerchantScannerPageMockup frameSize={150} frameOffsetY={-20} >
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
            title="Client gets reward"
            note={loyaltyProgram.rewardDescription || "Free coffee, discount, or whatever you offer!"}
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
      </div>
    </section>
  );
}; 