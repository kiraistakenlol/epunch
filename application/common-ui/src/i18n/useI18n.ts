import { useTranslation } from 'react-i18next';

type Locale = 'en' | 'es';

export const useI18n = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);
  
  const setLocale = (locale: Locale) => {
    i18n.changeLanguage(locale);
  };

  return {
    t,
    locale: i18n.language as Locale,
    setLocale,
  };
}; 