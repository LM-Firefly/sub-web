import btoa from "btoa";
import atob from "atob";

// 假设你有一个自定义的 base64 指令
const base64Directive = {
    mounted(el, binding) {
      // 在此处实现指令逻辑，比如对文本进行 base64 编解码等
      // 这仅为示例逻辑
      el.innerText = btoa(binding.value);
    }
  };

  export default {
    install ( app )
    {
      app.config.globalProperties.$btoa = ( string ) => btoa( string );
      app.config.globalProperties.$atob = ( string ) => atob( string );
      app.directive('base64', base64Directive);
    }
  };
