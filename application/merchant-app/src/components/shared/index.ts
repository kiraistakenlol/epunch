import React from 'react';

export { PhoneWithUserApp } from './PhoneWithUserApp';

// Stub components for onboarding (minimal implementations)
export const PhoneFrame: React.FC<{ children?: React.ReactNode }> = ({ children }) => React.createElement('div', null, children);
export const MerchantAppMobileFrameMockup: React.FC<any> = () => React.createElement('div', null, 'Merchant App Mockup');
export const MerchantScannerPageMockup: React.FC<any> = () => React.createElement('div', null, 'Scanner Mockup');
export const MerchantCustomerScanResult: React.FC<any> = () => React.createElement('div', null, 'Customer Scan Result');
export const MerchantPunchCardRedeemResult: React.FC<any> = () => React.createElement('div', null, 'Punch Card Redeem Result');
export const TwoScreenFlow: React.FC<any> = () => React.createElement('div', null, 'Two Screen Flow');
export const CameraInterface: React.FC<any> = () => React.createElement('div', null, 'Camera Interface'); 