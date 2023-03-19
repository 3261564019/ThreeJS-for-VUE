import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

export default defineConfig({
  plugins: [vue()],
  resolve:{
    //设置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      "/assets":"src/assets/",
      "/textures/water":"src/assets/waterTexture/",
      '*': path.resolve('')
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // additionalData:"@import './src/assets/css/base.less';",
        javascriptEnabled: true,
      },
    }
  }
})
