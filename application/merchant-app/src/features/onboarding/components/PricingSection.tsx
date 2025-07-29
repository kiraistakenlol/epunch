import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import './PricingSection.css';

export const PricingSection: React.FC = () => {
  const { t } = useI18n('merchantOnboarding');

  return (
    <section className="pricing-section">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">How much?</h2>
          <p className="pricing-subtitle">That's it. No hidden fees, no surprises.</p>
        </div>
        
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h3 className="plan-name">Complete Package</h3>
              <div className="plan-price">
                <span className="pricing-highlight" style={{fontSize: '1.2rem', color: '#667eea', fontWeight: '600', marginRight: '8px'}}>Only</span>
                <span className="price">$30</span>
                <span className="period">/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 