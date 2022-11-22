import de from './de.json';
import en from './en.json';

export const fallbackLocale = 'en';

export const messages = {
  de,
  // Locale terms shouldn't be translated, so we just add them to the fallback locale
  en: {...en, locales: {en: 'English', de: 'Deutsch'}}
};
