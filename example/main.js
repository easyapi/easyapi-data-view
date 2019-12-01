import Vue from 'vue'
import JsonView from '../src/index.js'
import App from './App.vue'

Vue.use(JsonView)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => (h)(App)
})