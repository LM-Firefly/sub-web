import { createApp } from 'vue'
import '@/assets/css/notify.css';
import App from './App.vue';
import router from './router';

const app = createApp( App );

// 导入并注册插件
import initElementUI from './plugins/element-ui';
import { registerPlugins } from './plugins';
import initIcons from './icons'; // icon
import './registerServiceWorker';

app.use( router );
initElementUI( app );
registerPlugins( app );
initIcons( app );

app.mount( '#app' );

// 确认未 import 'element-plus/dist/index.css';
