import Vue from 'vue';
import App from './app.vue';

import vuetify from './plugins/vuetify';
import store from './store/index';
import router from './router';
import {initializeAuth} from './libs/auth';

initializeAuth(store);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
