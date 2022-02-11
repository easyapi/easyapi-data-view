import Vue from "vue";
import JsonView from "./JsonView.vue";
import PackageFile from "../package.json";
import Element from "../plugins/element-ui";

const VERSION = PackageFile.version;

Vue.use(Element);

const install = (Vue) => {
  if (install.installed) return;

  Vue.component("easyapi-json-view", JsonView);
};

export default install;

export const components = {
  JsonView,
  VERSION,
};
