import React, { useState } from 'react';
import { PhoneFrame } from './components';
import { DesignVariant } from './types';
import { cardFirstVariant } from './variants/card-first';
import { qrFirstVariant } from './variants/qr-first';
import './DesignMockupsPage.css';

const DesignMockupsPage: React.FC = () => {
  const [selectedVariants, setSelectedVariants] = useState<string[]>(['card-first']);

  const designVariants: DesignVariant[] = [
    cardFirstVariant,
    qrFirstVariant,
    // Future variants can be added here
  ];

  const toggleVariant = (variantId: string) => {
    setSelectedVariants(prev => 
      prev.includes(variantId) 
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    );
  };

  const activeVariants = designVariants.filter(v => selectedVariants.includes(v.id));

  return (
    <div className="design-mockups-page">
      <header className="mockups-header">
        <h1>Design Mockups</h1>
        <p>Interactive prototypes for E-Punch user app redesign</p>
      </header>

      <div className="variant-selector">
        <h2>Design Variants</h2>
        <div className="variant-toggles">
          {designVariants.map((variant) => (
            <label key={variant.id} className="variant-toggle">
              <input
                type="checkbox"
                checked={selectedVariants.includes(variant.id)}
                onChange={() => toggleVariant(variant.id)}
              />
              <div className="variant-info">
                <div className="variant-name">{variant.name}</div>
                <div className="variant-description">{variant.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mockup-canvas">
        {activeVariants.map((variant) => (
          <div key={variant.id} className="variant-section">
            <h2 className="variant-title">{variant.name}</h2>
            <div className="screens-grid">
              {variant.screens.map((screen) => {
                const ScreenComponent = screen.component;
                return (
                  <div key={screen.id} className="screen-container">
                    <h3 className="screen-title">{screen.name}</h3>
                    <PhoneFrame>
                      <ScreenComponent />
                    </PhoneFrame>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignMockupsPage; 