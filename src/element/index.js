import { Checkbox, CheckboxButton, CheckboxGroup } from "element-ui";
const element = {
  install: function (Vue) {
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
  },
};

export default element;
