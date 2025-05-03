import { createApp } from 'vue';
import App from './App.vue';
import clipboardPlugin from './plugins/clipboard';
import particlesPlugin from './plugins/particles';
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // element-plus css
import base64 from '@/plugins/base64';
import axiosPlugin from './plugins/axios';
import device from '@/plugins/device';
import "@/icons"; // icon
import "./registerServiceWorker";

const app = createApp(App);

// 使用插件
app.use(router);
app.use(ElementPlus);
app.use(clipboardPlugin);
app.use( base64 );
app.use(particlesPlugin);
app.use( axiosPlugin );
app.use( device );

app.mount( '#app' );
