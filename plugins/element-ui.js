import {
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Icon,
  Tooltip,
  Button,
  Message,
  Popover,
} from "element-ui";

const Element = {
  install: function (Vue) {
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Icon);
    Vue.use(Tooltip);
    Vue.use(Button);
    Vue.use(Popover);
    Vue.prototype.$message = Message;
  },
};

export default Element;
