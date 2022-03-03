import Vue from 'vue'
import DataView from '../src/index.js'
import App from './App.vue'

Vue.use(DataView);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => (h)(App)
})

