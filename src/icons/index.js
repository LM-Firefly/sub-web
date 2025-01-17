import SvgIcon from '@/components/SvgIcon/index.vue'; // svg component
import 'virtual:svg-icons-register';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default ( app ) =>
{
  // register globally
  app.component( 'svg-icon', SvgIcon );

  // register element-plus icons
  for ( const [ key, component ] of Object.entries( ElementPlusIconsVue ) )
  {
    app.component( key, component )
  }

  // 不再需要 require.context 加载 svg
  // svg 图标已由 vite-plugin-svg-icons 自动注册
};
