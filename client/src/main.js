
import Vue from 'vue'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'mdbvue/build/css/mdb.css'
import VeeValidate from 'vee-validate';
import App from './App'
import store  from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import GSignInButton from 'vue-google-signin-button'
import SocialSharing from 'vue-social-sharing'
Vue.use(GSignInButton)
Vue.use(SocialSharing)
Vue.use(VueMaterial);
Vue.use(VeeValidate);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

 



