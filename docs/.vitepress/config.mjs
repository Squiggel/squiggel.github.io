import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "My Blog",
  description: "A VitePress Site",
  themeConfig: {
    docFooter: {
      prev: false,
      next: false
    },
    // Change outline to an object to set the custom label
    outline: {
      level: 'deep',
      label: 'Contents'
    }
  }
})
