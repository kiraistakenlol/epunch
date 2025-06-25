import React from 'react';
import styles from './MerchantLandingPage.module.css';

const MerchantLandingPage: React.FC = () => {

  return (
    <div className={styles.container}>
      <div className={styles.topContact}>
        <div className={styles.topContactContent}>
          <span>Get started today: </span>
          <a href="https://wa.me/79250419362" className={styles.topContactLink}>
            📞 WhatsApp
          </a>
          <span> | </span>
          <a href="https://t.me/sobolevchelovek" className={styles.topContactLink}>
            ✈️ Telegram
          </a>
        </div>
      </div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.brandTitle}>ePunch</div>
            <h1 className={styles.heroTitle}>
              Digital Punch Cards
            </h1>
            <div className={styles.heroSubtitle}>
              <p className={styles.bulletPoint}>• No apps to download</p>
              <p className={styles.bulletPoint}>• No accounts to create</p>
              <p className={styles.bulletPoint}>• Just scan and collect</p>
            </div>
          </div>
                    <div className={styles.heroDemo}>
            <div className={styles.heroVideoDemo}>
                             <h3 className={styles.demoTitle}>Watch How It Works</h3>
              <div className={styles.heroVideoContainer}>
                <video 
                  className={styles.heroDemoVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/images/card_completion_flow/5_completion_overlay.png"
                >
                  <source src="/videos/card_completion_recording.mp4" type="video/mp4" />
                  <source src="/videos/card_completion_recording.mov" type="video/quicktime" />
                  Your browser does not support the video tag.
                </video>
                <p className={styles.stepLabel}>Customer completes card → Gets reward</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className={styles.customerJourney}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>How Customers Use It</h2>
          <p className={styles.journeySubtitle}>From first visit to free reward</p>
          
          <div className={styles.journeyFlow}>
            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>1</div>
                <h3>Initial state</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/1_initial_state.png" alt="Customer's initial app view" className={styles.journeyImage} />
              </div>
              <p>Customer's QR code ready</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>2</div>
                <h3>First punch</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/2_one_punch.png" alt="First punch collected" className={styles.journeyImage} />
              </div>
              <p>First purchase → first punch</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>3</div>
                <h3>Building up</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/4_six_punches.png" alt="Six punches collected" className={styles.journeyImage} />
              </div>
              <p>Each purchase adds a punch</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>4</div>
                <h3>Card complete!</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/5_completion_overlay.png" alt="Completion celebration overlay" className={styles.journeyImage} />
              </div>
              <p>Celebration animation</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>5</div>
                <h3>Free reward</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/7_selected_for_redemption.png" alt="Selected for redemption" className={styles.journeyImage} />
              </div>
              <p>Customer claims their reward</p>
            </div>
          </div>
        </div>
      </section>



      <section className={styles.benefits}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Benefits to your business</h2>
          <div className={styles.benefitsList}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>❤️</div>
              <div className={styles.benefitText}>
                <h3>More loyal customers</h3>
                <p>73% higher retention rates</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔄</div>
              <div className={styles.benefitText}>
                <h3>Frequent repeat visits</h3>
                <p>20% increase in visit frequency</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>⚡</div>
              <div className={styles.benefitText}>
                <h3>Zero maintenance</h3>
                <p>No physical cards to replace</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎮</div>
              <div className={styles.benefitText}>
                <h3>Gamification</h3>
                <p>Visual progress drives engagement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaSubtitle}>
            Contact us to start your digital loyalty program today
          </p>
          <div className={styles.contactButtons}>
            <a href="https://wa.me/79250419362" className={styles.primaryButton}>
              📞 WhatsApp
            </a>
            <a href="https://t.me/sobolevchelovek" className={styles.secondaryButton}>
              ✈️ Telegram
            </a>
          </div>
          <div className={styles.contactInfo}>
            <p>+7 925 041 9362 | @sobolevchelovek</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MerchantLandingPage; 