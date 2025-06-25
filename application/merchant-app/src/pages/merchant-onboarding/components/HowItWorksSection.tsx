import React from 'react';
import { MerchantDto } from 'e-punch-common-core';
import { WorkflowStep } from './WorkflowStep';
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
  return (
    <section className={styles.howItWorks}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Replace Physical Punch Cards Forever</h2>
        <p className={styles.sectionSubtitle}>See exactly how your customers will experience digital loyalty</p>
        
        <div className={styles.stepsContainer}>
          <WorkflowStep
            stepNumber={1}
            role="you"
            title={`Display QR Code in Your ${merchant.name}`}
            note="Print this and put it on your counter"
            showArrow={true}
          >
            {onboardingImageUrl && (
              <div className={styles.printableQR}>
                <img src={onboardingImageUrl} alt="QR Code to display" className={styles.stepImage} />
              </div>
            )}
          </WorkflowStep>

          <WorkflowStep
            stepNumber={2}
            role="customer"
            title="Scans & Gets Digital Card"
            note="Customer instantly gets their loyalty card - no app download needed"
            showArrow={true}
          >
            <div className={styles.phoneFrame}>
              <iframe
                src={userAppUrl}
                className={styles.appIframe}
                title={`${merchant.name} Customer Experience`}
                loading="lazy"
              />
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={3}
            role="customer"
            title="Makes Purchase"
            note="Customer buys coffee, food, etc."
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <div className={styles.flowIcon}>🛒</div>
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={4}
            role="you"
            title="Scan & Give Punch"
            note="2 seconds with our scanner app"
            showArrow={true}
          >
            <div className={styles.singleStep}>
              <div className={styles.flowIcon}>📷</div>
            </div>
          </WorkflowStep>

          <WorkflowStep
            stepNumber={5}
            role="customer"
            title="Gets Reward"
            note="Free item when card is complete"
          >
            <div className={styles.singleStep}>
              <div className={styles.flowIcon}>🎁</div>
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