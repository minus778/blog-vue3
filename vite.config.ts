import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//引入gzip压缩
import viteCompression from 'vite-plugin-compression'
//压缩图片
import viteImagemin from 'vite-plugin-imagemin'

const pathSrc = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  //配置打包公共根路径
  base: "./",
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
    //gzip压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    //图片压缩
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ],
  //生产环境配置
  build: {
    //移除console.log
    minify: 'terser', // 默认为esbuild,需要安装terser -D
    terserOptions: {
      compress: {
        // drop_console: true, // 生产环境移除console
        // drop_debugger: true // 生产环境移除debugger
      }
    },
    //配置打包输出文件夹
    rollupOptions: {
      output: { // 配置输出文件夹
        //分包的js
        chunkFileNames: 'static/js/[name]-[hash].js',
        //入口文件的js
        entryFileNames: 'static/js/[name].js',
        //静态资源文件--图片/css等
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // //静态资源分拆打包
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     return id.toString().split('node_modules/')[1].split('/')[0].toString();
        //   }
        // }
      }
    }
  },
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
    proxy: {
      '/api': {
        target: "http://114.55.75.3:3000",
        // target: 'http://127.0.0.1:4000',
        changeOrigin: true
      }
    }
  },
})
