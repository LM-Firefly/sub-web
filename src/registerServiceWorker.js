/* eslint-disable no-console */

import { register } from "register-service-worker";

if ( process.env.NODE_ENV === "production" )
{
  register( '/sw.js', {
    ready ()
    {
      console.log(
        "App is being served from cache by a service worker.\n" +
        "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered ( registration )
    {
      console.log( "Service worker has been registered." );

      // 定期检查更新(每小时)
      setInterval( () =>
      {
        registration.update();
      }, 60 * 60 * 1000 );
    },
    cached ()
    {
      console.log( "Content has been cached for offline use." );
    },
    updatefound ()
    {
      console.log( "New content is downloading." );
    },
    updated ( registration )
    {
      console.log( "New content is available please refresh." );

      // 添加更新提示
      if ( confirm( '新版本可用，是否立即刷新？' ) )
      {
        registration.waiting.postMessage( { type: 'SKIP_WAITING' } );
        window.location.reload();
      }
    },
    offline ()
    {
      console.log(
        "No internet connection found. App is running in offline mode."
      );

      // 显示离线提示
      if ( 'Notification' in window && Notification.permission === 'granted' )
      {
        new Notification( '您处于离线模式', {
          body: '应用正在使用缓存数据运行',
          icon: '/img/icons/icon-192x192.png'
        } );
      }
    },
    error ( error )
    {
      console.error( "Error during service worker registration:", error );

      // 检查是否为 content-type 错误
      if ( error && error.message && error.message.includes( 'content-type' ) )
      {
        console.warn( '请确保 public 目录下存在 service-worker.js，且服务器能正确返回该文件 (Content-Type: application/javascript)。' );
      }

      // 错误上报逻辑
      if ( navigator.onLine )
      {
        fetch( '/api/log-error', {
          method: 'POST',
          body: JSON.stringify( { error: error.message } )
        } ).catch( err =>
        {
          // 捕获404等错误，避免控制台报错
          console.warn( '日志上报失败:', err );
        } );
      }
    },
  } );

  // 后台同步注册
  if ( 'sync' in navigator )
  {
    navigator.serviceWorker.ready.then( registration =>
    {
      registration.sync.register( 'sync-data' ).then( () =>
      {
        console.log( 'Background sync registered' );
      } );
    } );
  }
}
