import React from 'react';
import { 
  VerticalTimeline, 
  VerticalTimelineElement 
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styles from './FuturePlansSection.module.css';

export const FuturePlansSection: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available Now':
        return '#10b981';
      case 'Coming Soon':
        return '#f59e0b';
      case '2025':
        return '#6366f1';
      default:
        return '#006b3d';
    }
  };

  const timelineItems = [
    {
      status: 'Available Now',
      title: 'Multi-Program Management',
      description: 'Run multiple loyalty programs simultaneously - coffee rewards, meal deals, service packages. Each program works independently with custom rules.',
      icon: '⚡'
    },
    {
      status: 'Available Now',
      title: 'Custom Branded Cards',
      description: 'Design punch cards that match your brand - upload your logo, choose colors, and customize the look that represents your business.',
      icon: '🎨'
    },
    {
      status: 'Available Now',
      title: 'Basic Analytics Dashboard',
      description: 'Track customer participation, program performance, and punch card completion rates. See which rewards work best.',
      icon: '📊'
    },
    {
      status: 'Coming Soon',
      title: 'Direct Customer Outreach',
      description: 'Send targeted promotions and offers directly to customers via email or WhatsApp. Re-engage inactive customers automatically.',
      icon: '💬'
    },
    {
      status: 'Coming Soon',
      title: 'Prepaid Bundle Programs',
      description: 'Sell $200 upfront, customer gets discounted purchases. Improve cash flow while rewarding loyal customers with better deals.',
      icon: '💰'
    },
    {
      status: '2025',
      title: 'Advanced Analytics & Insights',
      description: 'Deep customer behavior analysis, peak hours tracking, seasonal trends, and revenue impact reports. Know exactly what drives your business.',
      icon: '📈'
    },
    {
      status: '2025',
      title: 'AI-Powered Recommendations',
      description: 'Get personalized suggestions for optimal program settings, pricing strategies, and customer targeting based on your specific business data.',
      icon: '🤖'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>Product Roadmap</h2>
        <p className={styles.sectionSubtitle}>
          Start with powerful features today, then unlock advanced capabilities as your business grows.
        </p>
        
        <div className={styles.timelineContainer}>
          <VerticalTimeline
            lineColor="#006b3d"
            animate={true}
          >
            {timelineItems.map((item, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                contentStyle={{
                  background: 'white',
                  color: '#2d3748',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}
                contentArrowStyle={{
                  borderRight: '7px solid white'
                }}
                                 date={item.status}
                                 iconStyle={{
                   background: getStatusColor(item.status),
                   color: '#fff',
                   boxShadow: `0 0 0 4px ${getStatusColor(item.status)}20`
                 }}
              >
                <h3 className={styles.featureTitle}>{item.title}</h3>
                <p className={styles.featureDescription}>{item.description}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
        
        <div className={styles.growthCallout}>
          <h3 className={styles.calloutTitle}>🚀 From simple cards to smart business insights</h3>
          <p className={styles.calloutText}>
            Launch your loyalty programs today with multi-program management and custom branding. 
            Then unlock advanced analytics, customer outreach, and AI-powered recommendations as we expand.
          </p>
        </div>
      </div>
    </section>
  );
}; 