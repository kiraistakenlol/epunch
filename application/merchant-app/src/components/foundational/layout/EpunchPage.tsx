import React from 'react';
import { colors, spacing } from '../../../theme/constants';
import { EpunchSpinner } from '../spinner/EpunchSpinner.tsx';
import { useAppSelector } from '../../../store/hooks';

export interface EpunchPageProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export const EpunchPage: React.FC<EpunchPageProps> = ({
  title,
  children,
  isLoading = false
}) => {
  const { isGlobalLoading, loadingMessage } = useAppSelector(state => state.loading);
  const showLoading = isLoading || isGlobalLoading;
  return (
    <div className="epunch-page">
      <header className="epunch-page-header">
        <h1 className="epunch-page-title">{title}</h1>
      </header>

      <main className="epunch-page-content">
        {showLoading ? (
          <div className="epunch-page-loading">
            <EpunchSpinner text={loadingMessage || "Loading..."} />
          </div>
        ) : (
          children
        )}
      </main>

      <style>{`
        .epunch-page {
          min-height: 100vh;
          background-color: ${colors.background.default};
          display: flex;
          flex-direction: column;
        }
        
        .epunch-page-header {
          padding: ${spacing.lg}px ${spacing.lg}px ${spacing.md}px;
                     border-bottom: 1px solid ${colors.border.default};
        }
        
        .epunch-page-title {
           margin: 0;
           font-size: clamp(1.5rem, 4vw, 2.5rem);
           font-weight: 600;
           color: var(--color-text-light);
           line-height: 1.2;
         }
        
        .epunch-page-content {
          flex: 1;
          padding: ${spacing.md}px;
        }
        
        .epunch-page-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          padding: ${spacing.xl}px;
        }
        
        @media (max-width: 768px) {
          .epunch-page-header {
            padding: ${spacing.md}px ${spacing.md}px ${spacing.sm}px;
          }
          
          .epunch-page-content {
            padding: ${spacing.sm}px;
          }
        }
      `}</style>
    </div>
  );
}; 