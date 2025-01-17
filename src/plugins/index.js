import axios from 'axios';

// 统一插件注册中心
const plugins = {
  // 全局属性插件
  globalProperties: {
    axios: ( app ) =>
    {
      axios.defaults.timeout = 15000;
      app.config.globalProperties.$axios = axios;
    },
    base64: ( app ) =>
    {
      app.config.globalProperties.$btoa = window.btoa;
      app.config.globalProperties.$atob = window.atob;
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
    // clipboard功能已由原生API实现
  }
};

export const registerPlugins = ( app ) =>
{
  // 注册全局属性插件
  Object.values( plugins.globalProperties ).forEach( plugin => plugin( app ) );

  // 注册Vue插件
  Object.values( plugins.vuePlugins ).forEach( plugin => plugin( app ) );
};

export default registerPlugins;
