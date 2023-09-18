import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {fallbackLocale, getMessages} from '../i18n/index';

Vue.use(VueI18n);

const vueI18n = new VueI18n({
  locale: fallbackLocale,
  fallbackLocale: fallbackLocale
});

getMessages().then(messages =>
  Object.keys(messages).forEach(locale =>
    vueI18n.setLocaleMessage(locale, messages[locale])
  )
);

export default vueI18n;
