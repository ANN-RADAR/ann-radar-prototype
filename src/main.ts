import Vue from 'vue';
import Router from 'vue-router';
import App from './app.vue';
import vuetify from './plugins/vuetify';
import store from './store/index';

Vue.use(Router);

import routes from './routes';

const router = new Router({routes});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
