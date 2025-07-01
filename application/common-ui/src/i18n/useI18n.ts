import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

type Locale = 'en' | 'es';

export const useI18n = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);
  
  const setLocale = useCallback((locale: Locale) => {
    i18n.changeLanguage(locale);
  }, [i18n]);

  return {
    t,
    locale: i18n.language as Locale,
    setLocale,
  };
}; 