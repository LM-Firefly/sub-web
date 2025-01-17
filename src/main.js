import { createApp } from 'vue'
import '@/assets/css/notify.css';
import App from './App.vue';
import router from './router';

const app = createApp( App );

// 导入并注册插件
import initElementUI from './plugins/element-ui';
import initClipboard from './plugins/clipboard';
import initBase64 from './plugins/base64';
import initParticles from './plugins/particles';
import initAxios from './plugins/axios';
import initDevice from './plugins/device';
import initIcons from './icons'; // icon
import './registerServiceWorker';

app.use( router );
initElementUI( app );
initClipboard( app );
initBase64( app );
initParticles( app );
initAxios( app );
initDevice( app );
initIcons( app );

app.mount( '#app' );
