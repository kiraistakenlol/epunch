import React from 'react';
import { useI18n } from 'e-punch-common-ui';
import './PricingSection.css';

export const PricingSection: React.FC = () => {
  const { t } = useI18n('merchantOnboarding');

  return (
    <section className="pricing-section">
      <div className="pricing-container">
        <div className="pricing-header">
          <h2 className="pricing-title">{t('pricing.title')}</h2>
          <p className="pricing-subtitle">{t('pricing.subtitle')}</p>
        </div>
        
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="pricing-card-header">
              <h3 className="plan-name">{t('pricing.starter.name')}</h3>
              <div className="plan-price">
                <span className="price">{t('pricing.starter.price')}</span>
                <span className="period">/{t('pricing.monthly')}</span>
              </div>
            </div>
            <ul className="features-list">
              <li className="feature-item">
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.starter.features.unlimitedClients')}
              </li>
              <li className="feature-item">
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.starter.features.consumptions')}
              </li>
              <li className="feature-item">
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.starter.features.loyaltyPrograms')}
              </li>
            </ul>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">{t('pricing.popular')}</div>
            <div className="pricing-card-header">
              <h3 className="plan-name">{t('pricing.professional.name')}</h3>
              <div className="plan-price">
                <span className="price">{t('pricing.professional.price')}</span>
                <span className="period">/{t('pricing.monthly')}</span>
              </div>
            </div>
            <ul className="features-list">
              <li className="feature-item">
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.professional.features.unlimitedClients')}
              </li>
              <li className="feature-item">
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.professional.features.consumptions')}
              </li>
              <li className="feature-item">
                <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.professional.features.loyaltyPrograms')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}; 