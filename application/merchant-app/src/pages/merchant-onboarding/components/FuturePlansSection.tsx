import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import 'react-vertical-timeline-component/style.min.css';
import styles from './FuturePlansSection.module.css';

export const FuturePlansSection: React.FC = () => {
  const { t } = useI18n('merchantOnboarding');
  
  const timelineGroups = [
    {
      status: t('futurePlans.availableNow'),
      color: '#10b981',
      items: [
        {
          title: t('futurePlans.multiplePrograms.title'),
          description: t('futurePlans.multiplePrograms.description'),
          icon: '⚡'
        },
        {
          title: t('futurePlans.customization.title'),
          description: t('futurePlans.customization.description'),
          icon: '🎨'
        },
        {
          title: t('futurePlans.analytics.title'),
          description: t('futurePlans.analytics.description'),
          icon: '📊'
        }
      ]
    },
    {
      status: t('futurePlans.comingSoon'),
      color: '#f59e0b',
      items: [
        {
          title: t('futurePlans.targeting.title'),
          description: t('futurePlans.targeting.description'),
          icon: '💬'
        },
        {
          title: t('futurePlans.bundles.title'),
          description: t('futurePlans.bundles.description'),
          icon: '💰'
        }
      ]
    },
    {
      status: t('futurePlans.year2025'),
      color: '#6366f1',
      items: [
        {
          title: t('futurePlans.behaviorAnalysis.title'),
          description: t('futurePlans.behaviorAnalysis.description'),
          icon: '📈'
        },
        {
          title: t('futurePlans.aiSuggestions.title'),
          description: t('futurePlans.aiSuggestions.description'),
          icon: '🤖'
        }
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{t('futurePlans.title')}</h2>
        <p className={styles.sectionSubtitle}>
          {t('futurePlans.subtitle')}
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