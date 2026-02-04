import { createApp } from 'vue'
import '@/assets/css/notify.css';
import App from './App.vue'
import router from './router';
import { registerPlugins } from './plugins';
import './registerServiceWorker';

const app = createApp( App );

app.use( router );
registerPlugins( app );

app.mount( '#app' );
