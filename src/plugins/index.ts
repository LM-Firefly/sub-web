import axios from 'axios';
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
import 'virtual:svg-icons-register';

// 统一插件注册中心
const plugins = {
  globalProperties: {
    axios: ( app ) =>
    {
      axios.defaults.timeout = 15000;
      app.config.globalProperties.$axios = axios;
    },
    device: ( app ) =>
    {
      app.config.globalProperties.$getOS = () =>
      {
        const ua = navigator.userAgent;
        const isWindowsPhone = /(?:Windows Phone)/.test( ua );
        const isSymbian = /(?:SymbianOS)/.test( ua ) || isWindowsPhone;
        const isAndroid = /(?:Android)/.test( ua );
        const isFireFox = /(?:Firefox)/.test( ua );
        const isTablet = /(?:iPad|PlayBook)/.test( ua ) ||
          ( isAndroid && !/(?:Mobile)/.test( ua ) ) ||
          ( isFireFox && /(?:Tablet)/.test( ua ) );
        const isIPhone = /(?:iPhone)/.test( ua ) && !isTablet;
        const isPc = !isIPhone && !isAndroid && !isSymbian && !isWindowsPhone;
        return { isTablet, isIPhone, isAndroid, isPc };
      };
    }
  },
  components: {
    svgIcon: (app) => {
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
    }
  }
};

export const registerPlugins = ( app ) =>
{
  Object.values( plugins.globalProperties ).forEach( plugin => plugin( app ) );
  Object.values( plugins.components ).forEach( component => component( app ) );
};

export default registerPlugins;
