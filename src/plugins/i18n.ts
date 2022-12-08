import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {fallbackLocale, messages} from '../i18n/index';

Vue.use(VueI18n);

export default new VueI18n({
  locale: fallbackLocale,
  fallbackLocale: fallbackLocale,
  messages
});
