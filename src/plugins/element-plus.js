import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
// import '@/assets/css/element-plus.scss' // 如果需要自定义主题

// Element Plus 使用全局配置替代了 Vue.prototype 的方式
// 这些方法现在可以直接通过组合式 API 使用
import {
  ElLoading,
  ElMessageBox,
  ElMessage,
  ElNotification
} from 'element-plus'

export default {
  install ( app )
  {
    // 如果需要在组件中使用，可以这样配置
    app.config.globalProperties.$loading = ElLoading.service
    app.config.globalProperties.$msgbox = ElMessageBox
    app.config.globalProperties.$alert = ElMessageBox.alert
    app.config.globalProperties.$confirm = ElMessageBox.confirm
    app.config.globalProperties.$prompt = ElMessageBox.prompt
    app.config.globalProperties.$notify = ElNotification
    app.config.globalProperties.$message = ElMessage
    app.use( ElementPlus, {
      locale: zhCn,
      size: 'small',
    })
  }
}
