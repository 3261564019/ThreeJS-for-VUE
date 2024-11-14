import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')


export default defineConfig(
    async () => {
        const glsl = (await import('vite-plugin-glsl')).default;
        return {
            plugins: [
                vue(),
                glsl({
                    include: [                   // Glob pattern, or array of glob patterns to import
                        '**/*.glsl', '**/*.wgsl',
                        '**/*.vert', '**/*.frag',
                        '**/*.vs', '**/*.fs'
                    ],
                    exclude: undefined,          // Glob pattern, or array of glob patterns to ignore
                    warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
                    defaultExtension: 'glsl',    // Shader suffix when no extension is specified
                    compress: false,             // Compress output shader code
                    watch: true,                 // Recompile shader on change
                })
            ],
            resolve:
                {
                    //设置路径别名
                    alias: {
                        '@':
                            path.resolve(__dirname, './src'),
                        "/assets":
                            "src/assets/",
                        "/textures/water":
                            "src/assets/waterTexture/",
                        '*':
                            path.resolve('')
                    }
                    ,
                }
            ,
            server: {
                port: 9999
            }
            ,
            css: {
                preprocessorOptions: {
                    less: {
                        // additionalData:"@import './src/assets/css/base.less';",
                        javascriptEnabled: true,
                    }
                    ,
                }
            }
        }
    }
)
