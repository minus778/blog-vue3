import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const pathSrc = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //配置按需自动引入element-plus组件
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
      ],
      //修改存放所有自动导入的全局组件文件位置
      dts: resolve(pathSrc, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ],
      //修改存放所有自动注册的全局组件文件位置
      dts: resolve(pathSrc, 'components.d.ts'),
    }),
  ],
  //配置别名
  resolve: {
    alias: {
      '@': pathSrc
    }
  },
  //配置启动服务器
  server: {
    host: '0.0.0.0', //解决“vite use `--host` to expose”
    port: 8000,
    //open: true
  },
})
