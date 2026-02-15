/**
 * Professional i18n Configuration
 * Supports: Arabic (RTL), English, Urdu, Indonesian, Turkish
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Import translation files
import ar from './ar';
import en from './en';
import ur from './ur';
import id from './id';
import tr from './tr';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  ur: { translation: ur },
  id: { translation: id },
  tr: { translation: tr }
};

// Detect and configure RTL
const detectRTL = (language: string): boolean => {
  const rtlLanguages = ['ar', 'ur', 'he', 'fa'];
  return rtlLanguages.includes(language);
};

// Initialize i18n
const initializeI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem('@app_language');
  const deviceLanguage = Localization.locale.split('-')[0];
  const defaultLanguage = savedLanguage || deviceLanguage || 'ar';
  
  // Configure RTL
  const isRTL = detectRTL(defaultLanguage);
  I18nManager.forceRTL(isRTL);
  
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLanguage,
      fallbackLng: 'ar',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
    
  return i18n;
};

// Language switcher with persistence
export const changeLanguage = async (language: string): Promise<void> => {
  const isRTL = detectRTL(language);
  
  // Update i18n
  await i18n.changeLanguage(language);
  
  // Persist preference
  await AsyncStorage.setItem('@app_language', language);
  
  // Update RTL configuration
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // Note: App restart required for full RTL switch
  }
};

// Get current language info
export const getCurrentLanguage = () => ({
  code: i18n.language,
  isRTL: detectRTL(i18n.language),
  name: resources[i18n.language as keyof typeof resources]?.translation?.languageName || 'Arabic'
});

// Available languages
export const availableLanguages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'en', name: 'English', flag: '🇬🇧', isRTL: false },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', isRTL: true },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', isRTL: false },
];

export { initializeI18n };
export default i18n;
