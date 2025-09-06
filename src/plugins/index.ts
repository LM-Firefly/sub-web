import axios from 'axios';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import SvgIcon from '../components/SvgIcon/index.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register';

// 统一插件注册中心
const plugins = {
  // 全局属性插件
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

  // Vue插件
  vuePlugins: {
    elementPlus: (app) => {
      app.use(ElementPlus, {
        locale: zhCn
      });
    }
  },
  
  // 组件注册
  components: {
    svgIcon: (app) => {
      // register svg icon component
      app.component('svg-icon', SvgIcon);
      
      // register element-plus icons
      for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
      }
    }
  }
};

export const registerPlugins = ( app ) =>
{
  // 注册全局属性插件
  Object.values( plugins.globalProperties ).forEach( plugin => plugin( app ) );

  // 注册Vue插件
  Object.values( plugins.vuePlugins ).forEach( plugin => plugin( app ) );
  
  // 注册组件
  Object.values( plugins.components ).forEach( component => component( app ) );
};

export default registerPlugins;
