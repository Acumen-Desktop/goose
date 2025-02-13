import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'

// Read package.json synchronously
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))
const deps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]

export default defineConfig({
  build: {
    target: 'node23',
    outDir: 'dist',
    minify: false,
    sourcemap: true,
    lib: {
      entry: 'src/server.ts',
      formats: ['es'],
      fileName: 'server'
    },
    rollupOptions: {
      external: [
        /^node:/,
        ...deps,
        // Handle subpath imports
        /^@modelcontextprotocol\/sdk\/.*/
      ],
      output: {
        format: 'es',
        exports: 'named',
        generatedCode: {
          constBindings: true,
          objectShorthand: true
        }
      }
    }
  },
  optimizeDeps: {
    exclude: [
      '@modelcontextprotocol/sdk',
      'jsdom',
      'axios',
      'zod',
      'dom-to-semantic-markdown'
    ]
  }
})
