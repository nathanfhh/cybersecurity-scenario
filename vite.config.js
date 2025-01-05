import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: (env.VITE_APP_BASE_URL || '') + '/',
        server: {host: '0.0.0.0'},
        plugins: [
            vue(),
            vueDevTools(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
        build: {
            minify: "terser",
            sourcemap: false,
            target: "esnext",
            rollupOptions: {
                output: {
                    manualChunks: {
                        'element-plus': ["element-plus"],
                        'openai': ["openai"],
                        'highlight.js': ["highlight.js"],
                        'markdown-it': ["markdown-it"],
                    },
                },
            },
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
    }
})
