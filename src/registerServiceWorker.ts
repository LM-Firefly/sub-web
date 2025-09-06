/* eslint-disable no-console */

import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('新版本可用，是否立即刷新？')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App is ready for offline use.');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('您处于离线模式', {
        body: '应用正在使用缓存数据运行',
        icon: '/icons/icon-192x192.png'
      });
    }
  },
  onRegistered(registration) {
    console.log('Service worker has been registered.');
    
    // 定期检查更新(每小时)
    setInterval(() => {
      registration?.update();
    }, 60 * 60 * 1000);
  }
});
