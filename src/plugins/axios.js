// src/plugins/axios.js
import axios from 'axios';

export default {
  install(app) {
    // 挂载 axios 到组件实例上，所有组件可通过 this.$axios 访问
    app.config.globalProperties.$axios = axios;
  }
};
