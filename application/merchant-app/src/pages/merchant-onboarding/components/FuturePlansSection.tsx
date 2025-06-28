import React from 'react';
import 'react-vertical-timeline-component/style.min.css';
import styles from './FuturePlansSection.module.css';

export const FuturePlansSection: React.FC = () => {
  const timelineGroups = [
    {
      status: 'Available Now',
      color: '#10b981',
      items: [
        {
          title: 'Run Multiple Programs',
          description: 'Coffee rewards, meal deals, service packages - all at once. Because why limit yourself?',
          icon: '⚡'
        },
        {
          title: 'Make It Yours',
          description: 'Upload your logo, pick your colors. Make cards so pretty customers want to show them off.',
          icon: '🎨'
        },
        {
          title: 'See What Works',
          description: 'Finally know which rewards actually work instead of guessing like everyone else.',
          icon: '📊'
        }
      ]
    },
    {
      status: 'Coming Soon',
      color: '#f59e0b',
      items: [
        {
          title: 'Hunt Down Lost Customers',
          description: 'Send targeted promos via email/WhatsApp. Automatically stalk... er, re-engage inactive customers.',
          icon: '💬'
        },
        {
          title: 'Get Paid Upfront',
          description: 'Sell $200 bundles, give discounts. Customers save money, you get cash flow. Win-win.',
          icon: '💰'
        }
      ]
    },
    {
      status: '2025',
      color: '#6366f1',
      items: [
        {
          title: 'Know Everything',
          description: 'Deep behavior analysis, peak hours, seasonal trends. Become a mind reader.',
          icon: '📈'
        },
        {
          title: 'Let AI Do the Thinking',
          description: 'Get personalized suggestions for pricing and targeting. Because robots are smarter than us.',
          icon: '🤖'
        }
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>What's Coming</h2>
        <p className={styles.sectionSubtitle}>
          Start with the good stuff today. Unlock mind-blowing features later.
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