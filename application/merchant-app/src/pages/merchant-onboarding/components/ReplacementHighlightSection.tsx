import React from 'react';
import styles from './ReplacementHighlightSection.module.css';

export const ReplacementHighlightSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionContent}>
        <div className={styles.replacementHighlight}>
          <h3>🔄 No More Physical Cards</h3>
          <div className={styles.comparison}>
            <div className={styles.oldWay}>
              <h4>❌ Old Way</h4>
              <ul>
                <li>Print thousands of cards</li>
                <li>Client lose cards</li>
                <li>Cards get damaged</li>
                <li>Expensive to replace</li>
              </ul>
            </div>
            <div className={styles.newWay}>
              <h4>✅ ePunch Way</h4>
              <ul>
                <li>One QR code - print once</li>
                <li>Never lose digital cards</li>
                <li>Always perfect condition</li>
                <li>Zero ongoing costs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 