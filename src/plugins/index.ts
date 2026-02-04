import type { App } from 'vue';
import SvgIcon from '../components/SvgIcon/index.vue';
import {
  Delete,
  Document,
  DocumentChecked,
  DocumentCopy,
  Expand,
  InfoFilled,
  Link,
  MagicStick,
  Operation,
  Plus,
  Setting
} from '@element-plus/icons-vue';

export const registerPlugins = (app: App) => {
  app.component('svg-icon', SvgIcon);
  [
    Delete,
    Document,
    DocumentChecked,
    DocumentCopy,
    Expand,
    InfoFilled,
    Link,
    MagicStick,
    Operation,
    Plus,
    Setting
  ].forEach((icon) => {
    if (icon?.name) {
      app.component(icon.name, icon);
    }
  });
};

export default registerPlugins;
