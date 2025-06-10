import SvgIcon from '@/components/SvgIcon/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import GithubIcon from '@/icons/svg/github.svg'
import TelegramIcon from '@/icons/svg/telegram.svg'
import ClashIcon from '@/icons/svg/clash.svg'

export default ( app ) =>
{
  // register globally
  app.component( 'svg-icon', SvgIcon )

  // register element-plus icons
  for ( const [ key, component ] of Object.entries( ElementPlusIconsVue ) )
  {
    app.component( key, component )
  }

  // register custom SVG icons
  app.component( 'icon-github', GithubIcon )
  app.component( 'icon-telegram', TelegramIcon )
  app.component( 'icon-clash', ClashIcon )
}
