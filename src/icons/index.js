import SvgIcon from '@/components/SvgIcon'; // svg component
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

  const req = require.context( './svg', false, /\.svg$/ );
  const requireAll = ( requireContext ) =>
    requireContext.keys().map( requireContext );
  requireAll( req );
};
