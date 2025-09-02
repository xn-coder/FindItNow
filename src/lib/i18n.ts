
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../../public/locales/en/common.json';
import de from '../../public/locales/de/common.json';
import fr from '../../public/locales/fr/common.json';
import admin_en from '../../public/locales/en/admin.json';
import admin_de from '../../public/locales/de/admin.json';
import admin_fr from '../../public/locales/fr/admin.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false, // Set to true to see i18next logs in the console
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    resources: {
      en: {
        translation: { ...en, ...admin_en },
      },
      de: {
        translation: { ...de, ...admin_de },
      },
      fr: {
        translation: { ...fr, ...admin_fr },
      },
    },
     detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'finditnow_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
