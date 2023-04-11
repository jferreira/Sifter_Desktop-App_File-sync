import { defineConfig } from 'vite'
import Pages from "vite-plugin-pages"
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vitejs.dev/config/
const viteConfig = defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [vue(), Pages()],
  experimental: {
    // using base was not working on windows as it removed the volume name
    renderBuiltUrl(filename, ctx) {
      return `./${filename}`;
    }
  }
})

export default viteConfig;
