import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './registerServiceWorker'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyDWriPwM7dGyf4FuVWagT9RIVR6UP8rLWk",
  authDomain: "timedule.firebaseapp.com",
  projectId: "timedule",
  storageBucket: "timedule.appspot.com",
  messagingSenderId: "632812129342",
  appId: "1:632812129342:web:0f31cfac8a5d368e4b556f",
  measurementId: "G-GQR05SFYPP"
};

firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
