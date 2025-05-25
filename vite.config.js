// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// export default defineConfig({
//   plugins: [vue()],
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'
//       },
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           process: true,
//           buffer: true
//         })
//       ]
//     }
//   },
//   define: {
//     global: 'globalThis'
//   }
// })

import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()]
    }
  }
})


