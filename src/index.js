import Vue from 'vue'
import JsonView from './JsonView.vue'
import PackageFile from '../package.json'
import {Checkbox} from "element-ui"

const VERSION = PackageFile.version

Vue.use(Checkbox)

const install = (Vue) => {
  if (install.installed) return

  Vue.component('easyapi-json-view', JsonView)
}

export default install

export const components = {
  JsonView,
  VERSION
}
