import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

export default defineConfig({
  plugins: [vue()],

  css: {
    preprocessorOptions: {
      less: {
        // additionalData:"@import './src/assets/css/base.less';",
        javascriptEnabled: true,
      },
    }
  }
})
