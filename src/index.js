import Vue from "vue";
import DataView from "./DataView.vue";
import PackageFile from "../package.json";
import Element from "../plugins/element-ui";

const VERSION = PackageFile.version;

Vue.use(Element);

const install = (Vue) => {
  if (install.installed) return;

  Vue.component("easyapi-data-view", DataView);
};

export default install;

export const components = {
  DataView,
  VERSION,
};
