import React from 'react';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { useI18n } from 'e-punch-common-ui';
import { LanguageSwitch } from 'e-punch-common-ui';
import styles from './MerchantLandingPage.module.css';

const MerchantLandingPage: React.FC = () => {
  const { t } = useI18n('landing');

  return (
    <div className={styles.container}>
      <div className={styles.topContact}>
        <div className={styles.topContactContent}>
          <span>{t('getStarted')} </span>
          <a href="https://wa.me/79250419362" className={styles.topContactLink}>
            <FaWhatsapp /> {t('whatsapp')}
          </a>
          <span> | </span>
          <a href="https://t.me/sobolevchelovek" className={styles.topContactLink}>
            <FaTelegram /> {t('telegram')}
          </a>
          <span> | </span>
          <LanguageSwitch variant="landing" />
        </div>
      </div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.brandTitle}>ePunch</div>
            <h1 className={styles.heroTitle}>
              {t('digitalPunchCards')}
            </h1>
            <div className={styles.heroSubtitle}>
              <p className={styles.bulletPoint}>{t('noApps')}</p>
              <p className={styles.bulletPoint}>{t('noAccounts')}</p>
              <p className={styles.bulletPoint}>{t('justScan')}</p>
            </div>
          </div>
                    <div className={styles.heroDemo}>
            <div className={styles.heroVideoDemo}>
                             <h3 className={styles.demoTitle}>{t('watchDemo')}</h3>
              <div className={styles.heroVideoContainer}>
                <video 
                  className={styles.heroDemoVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/images/card_completion_flow/5_completion_overlay.png"
                >
                  <source src="/videos/final_version_1.mp4" type="video/mp4" />
                  <source src="/videos/card_completion_recording.mov" type="video/quicktime" />
                  Your browser does not support the video tag.
                </video>
                <p className={styles.stepLabel}>{t('customerCompletes')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className={styles.customerJourney}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{t('howCustomersUse')}</h2>
          <p className={styles.journeySubtitle}>{t('firstVisitToReward')}</p>
          
          <div className={styles.journeyFlow}>
            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>1</div>
                <h3>{t('step1.title')}</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/1_initial_state.png" alt="Customer's initial app view" className={styles.journeyImage} />
              </div>
              <p>{t('step1.description')}</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>2</div>
                <h3>{t('step2.title')}</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/2_one_punch.png" alt="First punch collected" className={styles.journeyImage} />
              </div>
              <p>{t('step2.description')}</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>3</div>
                <h3>{t('step3.title')}</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/4_six_punches.png" alt="Six punches collected" className={styles.journeyImage} />
              </div>
              <p>{t('step3.description')}</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>4</div>
                <h3>{t('step4.title')}</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/5_completion_overlay.png" alt="Completion celebration overlay" className={styles.journeyImage} />
              </div>
              <p>{t('step4.description')}</p>
            </div>

            <div className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <div className={styles.stepNumber}>5</div>
                <h3>{t('step5.title')}</h3>
              </div>
              <div className={styles.screenshotContainer}>
                <img src="/images/card_completion_flow/7_selected_for_redemption.png" alt="Selected for redemption" className={styles.journeyImage} />
              </div>
              <p>{t('step5.description')}</p>
            </div>
          </div>
        </div>
      </section>



      <section className={styles.benefits}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>{t('benefits.title')}</h2>
          <div className={styles.benefitsList}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>❤️</div>
              <div className={styles.benefitText}>
                <h3>{t('benefits.loyal.title')}</h3>
                <p>{t('benefits.loyal.description')}</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔄</div>
              <div className={styles.benefitText}>
                <h3>{t('benefits.visits.title')}</h3>
                <p>{t('benefits.visits.description')}</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>⚡</div>
              <div className={styles.benefitText}>
                <h3>{t('benefits.maintenance.title')}</h3>
                <p>{t('benefits.maintenance.description')}</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🎮</div>
              <div className={styles.benefitText}>
                <h3>{t('benefits.gamification.title')}</h3>
                <p>{t('benefits.gamification.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
          <p className={styles.ctaSubtitle}>
            {t('cta.subtitle')}
          </p>
          <div className={styles.contactButtons}>
            <a href="https://wa.me/79250419362" className={styles.primaryButton}>
              <FaWhatsapp /> {t('whatsapp')}
            </a>
            <a href="https://t.me/sobolevchelovek" className={styles.secondaryButton}>
              <FaTelegram /> {t('telegram')}
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