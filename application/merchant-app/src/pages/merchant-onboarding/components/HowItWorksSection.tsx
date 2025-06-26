import React, { useMemo } from 'react';
import { MerchantDto, PunchCardDto } from 'e-punch-common-core';
import { WorkflowStep } from './WorkflowStep';
import { dashboardPreviewService } from '../../../utils/dashboardPreviewService';
import styles from './HowItWorksSection.module.css';

interface HowItWorksSectionProps {
  merchant: MerchantDto;
  userAppUrl: string;
  onboardingImageUrl: string | null;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  merchant,
  userAppUrl,
  onboardingImageUrl
}) => {
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
            title="Put up QR code"
            note="Print and display at checkout"
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
              <div className={styles.scanningDemo}>
                <div className={styles.phoneWithCamera}>
                  <div className={styles.phoneFrame}>
                    <div className={styles.phoneScreen}>
                      <div className={styles.cameraInterface}>
                        <div className={styles.cameraTopBar}>
                          <span className={styles.cameraTitle}>Camera</span>
                          <div className={styles.cameraControls}>×</div>
                        </div>
                        <div className={styles.cameraViewfinder}>
                          <div className={styles.scanningFrame}></div>
                          {onboardingImageUrl && (
                            <img
                              src={onboardingImageUrl}
                              alt="QR Code being scanned"
                              className={styles.qrCodeInCamera}
                            />
                          )}
                          <div className={styles.scanningCorners}>
                            <div className={styles.corner} data-position="top-left"></div>
                            <div className={styles.corner} data-position="top-right"></div>
                            <div className={styles.corner} data-position="bottom-left"></div>
                            <div className={styles.corner} data-position="bottom-right"></div>
                          </div>
                        </div>
                        <div className={styles.cameraBottomBar}>
                          <div className={styles.cameraButton}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.scanResult}>
                  <div className={styles.resultArrow}>→</div>
                  <div className={styles.resultPhone}>
                    <div className={styles.resultPhoneFrame}>
                      <div className={styles.statusBarArea}></div>
                      <iframe
                        src={userAppUrl}
                        className={styles.appIframe}
                        title={`${merchant.name} ePunch App Opens`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={3}
            role="you"
            title="Scan their QR, hit 'PUNCH'"
            note="Simple one-tap process"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <div className={styles.merchantScanningDemo}>
                <div className={styles.phoneWithCamera}>
                  <div className={styles.phoneFrame}>
                    <div className={styles.phoneScreen}>
                      <div className={styles.cameraInterface}>
                        <div className={styles.cameraTopBar}>
                          <span className={styles.cameraTitle}>ePunch Merchant</span>
                          <div className={styles.cameraControls}>×</div>
                        </div>
                        <div className={styles.cameraViewfinder}>
                          <div className={styles.scanningFrame}></div>
                          <div className={styles.customerPhoneInCamera}>
                            <div className={styles.miniPhoneFrame}>
                              <iframe
                                src={userAppUrl}
                                className={styles.customerAppIframe}
                                title="Customer's ePunch App being scanned"
                                loading="lazy"
                              />
                            </div>
                          </div>
                          <div className={styles.scanningCorners}>
                            <div className={styles.corner} data-position="top-left"></div>
                            <div className={styles.corner} data-position="top-right"></div>
                            <div className={styles.corner} data-position="bottom-left"></div>
                            <div className={styles.corner} data-position="bottom-right"></div>
                          </div>
                        </div>
                        <div className={styles.cameraBottomBar}>
                          <div className={styles.cameraButton}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.scanResult}>
                  <div className={styles.resultArrow}>→</div>
                  <div className={styles.resultPhone}>
                    <div className={styles.resultPhoneFrame}>
                      <div className={styles.merchantScanResultInterface}>
                        <div className={styles.merchantAppHeader}>
                          <span className={styles.merchantAppTitle}>ePunch Merchant</span>
                          <div className={styles.merchantAppControls}>×</div>
                        </div>
                        <div className={styles.scanResultContent}>
                          <div className={styles.scanResultHeader}>
                            <h3>Select Loyalty Program</h3>
                            <p className={styles.userId}>User ID: abc123...</p>
                          </div>
                          <div className={styles.loyaltyProgramsList}>
                            <div className={styles.loyaltyProgram}>
                              <div className={styles.programInfo}>
                                <span className={styles.programName}>{merchant.name} Rewards</span>
                                <span className={styles.programProgress}>7/10 punches</span>
                              </div>
                              <div className={styles.selectedIndicator}>✓</div>
                            </div>
                            <div className={styles.loyaltyProgram}>
                              <div className={styles.programInfo}>
                                <span className={styles.programName}>VIP Program</span>
                                <span className={styles.programProgress}>2/5 punches</span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.punchButtonContainer}>
                            <div className={styles.punchButton}>PUNCH</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  <div className={styles.resultPhoneFrame}>
                    <div className={styles.statusBarArea}></div>
                    <iframe
                      src={step4PreviewUrl}
                      className={styles.appIframe}
                      title={`${merchant.name} ePunch Card Progress - 7/10 punches`}
                      loading="lazy"
                    />
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
                  <div className={styles.resultPhoneFrame}>
                    <div className={styles.statusBarArea}></div>
                    <iframe
                      src={step5PreviewUrl}
                      className={styles.appIframe}
                      title={`${merchant.name} ePunch Reward Ready - 10/10 punches complete`}
                      loading="lazy"
                    />
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
              <div className={styles.redeemScanningDemo}>
                <div className={styles.phoneWithCamera}>
                  <div className={styles.phoneFrame}>
                    <div className={styles.phoneScreen}>
                      <div className={styles.cameraInterface}>
                        <div className={styles.cameraTopBar}>
                          <span className={styles.cameraTitle}>ePunch Merchant</span>
                          <div className={styles.cameraControls}>×</div>
                        </div>
                        <div className={styles.cameraViewfinder}>
                          <div className={styles.scanningFrame}></div>
                          <div className={styles.customerPhoneInCamera}>
                            <div className={styles.miniPhoneFrame}>
                              <iframe
                                src={step5PreviewUrl}
                                className={styles.customerAppIframe}
                                title="Customer's reward-ready punch card QR"
                                loading="lazy"
                              />
                            </div>
                          </div>
                          <div className={styles.scanningCorners}>
                            <div className={styles.corner} data-position="top-left"></div>
                            <div className={styles.corner} data-position="top-right"></div>
                            <div className={styles.corner} data-position="bottom-left"></div>
                            <div className={styles.corner} data-position="bottom-right"></div>
                          </div>
                        </div>
                        <div className={styles.cameraBottomBar}>
                          <div className={styles.cameraButton}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.scanResult}>
                  <div className={styles.resultArrow}>→</div>
                  <div className={styles.resultPhone}>
                    <div className={styles.resultPhoneFrame}>
                      <div className={styles.redeemResultInterface}>
                        <div className={styles.merchantAppHeader}>
                          <span className={styles.merchantAppTitle}>ePunch Merchant</span>
                          <div className={styles.merchantAppControls}>×</div>
                        </div>
                        <div className={styles.redeemResultContent}>
                          <div className={styles.redeemResultHeader}>
                            <h3>🎁 Reward Redemption</h3>
                            <p className={styles.redeemCardId}>Card ID: demo123...</p>
                          </div>
                          <div className={styles.punchCardDetails}>
                            <h4>Punch Card Details</h4>
                            <div className={styles.detailsContent}>
                              <p><strong>Shop:</strong> {merchant.name}</p>
                              <p><strong>Address:</strong> {merchant.address || '123 Main Street'}</p>
                              <p><strong>Punches:</strong> 10/10</p>
                              <p><strong>Status:</strong> REWARD_READY</p>
                            </div>
                          </div>
                          <div className={styles.loyaltyProgramDetails}>
                            <h4>Loyalty Program</h4>
                            <div className={styles.detailsContent}>
                              <p><strong>Name:</strong> {merchant.name} Rewards</p>
                              <p><strong>Reward:</strong> Free coffee</p>
                              <p className={styles.programDescription}>
                                Get a free coffee after 10 punches!
                              </p>
                            </div>
                          </div>
                          <div className={styles.redeemButtonContainer}>
                            <div className={styles.redeemButton}>REDEEM!</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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