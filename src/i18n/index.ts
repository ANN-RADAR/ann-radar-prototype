import VueI18n from 'vue-i18n/types';

export const locales = {
  en: 'English',
  de: 'Deutsch',
  dk: 'Dansk',
  es: 'Español',
  lv: 'Latvieši',
  sv: 'Svenska'
};

export const fallbackLocale = 'en';

export const getMessages = async (): Promise<VueI18n.LocaleMessages> => {
  const messages = await Object.keys(locales).reduce<
    Promise<VueI18n.LocaleMessages>
  >(async (messages: Promise<VueI18n.LocaleMessages>, locale: string) => {
    const previousMessages = await messages;

    previousMessages[locale] = await (
      await fetch(
        `https://storage.googleapis.com/ann-radar-data/i18n/${locale}.json`
      )
    ).json();
    return previousMessages;
  }, Promise.resolve({}));

  return {
    ...messages,
    // Locale terms shouldn't be translated, so we just add them to the fallback locale
    en: {...messages.en, locales}
  };
};
