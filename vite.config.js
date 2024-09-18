import { resolve } from 'path';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: { outDir: '../dist' },

  plugins: [glsl()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src/'),
    },
  },

  server: { host: true },
});
