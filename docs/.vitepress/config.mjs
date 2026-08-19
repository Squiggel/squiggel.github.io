// .vitepress/config.mjs
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "My Blog",
  description: "A VitePress Site",
  themeConfig: {
    // This defines the sidebar navigation
    sidebar: [
      {
        text: 'Articles',
        items: [
          { text: 'My First Post', link: '/posts/testpost1' }
          // Add new posts here as you create them!
        ]
      }
    ]
  }
})
