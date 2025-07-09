import React from 'react';
import { PhoneFrame } from './components';
import { DesignVariant } from './types';
import { cardFirstDesign } from './designs/card-first';
import { qrFirstDesign } from './designs/qr-first';
import './DesignMockupsPage.css';

const DesignMockupsPage: React.FC = () => {
  const designVariants: DesignVariant[] = [
    qrFirstDesign,
    cardFirstDesign
  ];

  const activeVariants = designVariants.filter(v => v.screens.length > 0);

  return (
    <div className="design-mockups-page">
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