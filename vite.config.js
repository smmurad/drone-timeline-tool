import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/manifest.json',
          dest: './'
        },
        {
          src: 'public/*',
          dest: './'
        },
        {
          src: 'src/background/background.js',
          dest: './'
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'src/popup/index.jsx'),
      output: {
        entryFileNames: 'popup.js',
        assetFileNames: '[name].[ext]'
      },
      external: [
        'public/popup.html'  // Tell Rollup to ignore this file
      ]
    }
  }
}); 