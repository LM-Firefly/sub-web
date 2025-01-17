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

};