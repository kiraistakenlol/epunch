import React from 'react';
import { useLocalization } from 'e-punch-common-ui';
import 'react-vertical-timeline-component/style.min.css';
import styles from './FuturePlansSection.module.css';

export const FuturePlansSection: React.FC = () => {
  const { t } = useLocalization();
  
  const timelineGroups = [
    {
      status: t('merchantOnboarding.futurePlans.availableNow'),
      color: '#10b981',
      items: [
        {
          title: t('merchantOnboarding.futurePlans.multiplePrograms.title'),
          description: t('merchantOnboarding.futurePlans.multiplePrograms.description'),
          icon: '⚡'
        },
        {
          title: t('merchantOnboarding.futurePlans.customization.title'),
          description: t('merchantOnboarding.futurePlans.customization.description'),
          icon: '🎨'
        },
        {
          title: t('merchantOnboarding.futurePlans.analytics.title'),
          description: t('merchantOnboarding.futurePlans.analytics.description'),
          icon: '📊'
        }
      ]
    },
    {
      status: t('merchantOnboarding.futurePlans.comingSoon'),
      color: '#f59e0b',
      items: [
        {
          title: t('merchantOnboarding.futurePlans.targeting.title'),
          description: t('merchantOnboarding.futurePlans.targeting.description'),
          icon: '💬'
        },
        {
          title: t('merchantOnboarding.futurePlans.bundles.title'),
          description: t('merchantOnboarding.futurePlans.bundles.description'),
          icon: '💰'
        }
      ]
    },
    {
      status: t('merchantOnboarding.futurePlans.year2025'),
      color: '#6366f1',
      items: [
        {
          title: t('merchantOnboarding.futurePlans.behaviorAnalysis.title'),
          description: t('merchantOnboarding.futurePlans.behaviorAnalysis.description'),
          icon: '📈'
        },
        {
          title: t('merchantOnboarding.futurePlans.aiSuggestions.title'),
          description: t('merchantOnboarding.futurePlans.aiSuggestions.description'),
          icon: '🤖'
        }
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{t('merchantOnboarding.futurePlans.title')}</h2>
        <p className={styles.sectionSubtitle}>
          {t('merchantOnboarding.futurePlans.subtitle')}
        </p>
        
        <div className={styles.timelineContainer}>
          {timelineGroups.map((group) => (
            <div key={group.status} className={styles.timelineGroup}>
              <div className={styles.groupHeader}>
                <div 
                  className={styles.groupBadge}
                  style={{ backgroundColor: group.color }}
                >
                  {group.status}
                </div>
              </div>
              
              <div className={styles.groupContent} style={{ borderLeftColor: group.color }}>
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.groupItem}>
                    <div 
                      className={styles.itemIcon}
                      style={{ backgroundColor: group.color }}
                    >
                      {item.icon}
                    </div>
                    <div className={styles.itemContent}>
                      <h3 className={styles.featureTitle}>{item.title}</h3>
                      <p className={styles.featureDescription}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 