import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
//引入mavon-editor编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
//引入通用样式
import '@/assets/css/common.css'
//引入阿里图标样式
import '@/assets/css/iconfont.css'

const app = createApp(App)
//挂载router
app.use(router)
//挂载vuex
app.use(store, key)
//使用编辑器插件
app.use(mavonEditor)

app.mount('#app')
