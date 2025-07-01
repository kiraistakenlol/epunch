import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './resources/en/common.json';
import enAuth from './resources/en/auth.json';
import enDashboard from './resources/en/dashboard.json';
import enPunchCards from './resources/en/punch-cards.json';
import enLanding from './resources/en/landing.json';
import enMerchantOnboarding from './resources/en/merchant-onboarding.json';

import esCommon from './resources/es/common.json';
import esAuth from './resources/es/auth.json';
import esDashboard from './resources/es/dashboard.json';
import esPunchCards from './resources/es/punch-cards.json';
import esLanding from './resources/es/landing.json';
import esMerchantOnboarding from './resources/es/merchant-onboarding.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    punchCards: enPunchCards,
    landing: enLanding,
    merchantOnboarding: enMerchantOnboarding,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    dashboard: esDashboard,
    punchCards: esPunchCards,
    landing: esLanding,
    merchantOnboarding: esMerchantOnboarding,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'epunch-language',
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n; 