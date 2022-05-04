import Vue from 'vue';
import App from './app.vue';

import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
import store from './store/index';
import router from './router';
import {initializeAuth} from './libs/firebase';

initializeAuth(store);

new Vue({
  store,
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app');
