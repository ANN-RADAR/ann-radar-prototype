import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import vuetify from './plugins/vuetify';

Vue.use(Router);

import routes from './routes';

const router = new Router({routes});

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
