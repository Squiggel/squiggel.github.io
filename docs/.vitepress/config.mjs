import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "My Blog",
  description: "A VitePress Site",
  themeConfig: {
    // 1. Completely disables the "Next" and "Previous" buttons across the site
    docFooter: {
      prev: false,
      next: false
    },
    
    // 2. Automatically generates an outline based on the current page's headings.
    // Setting it to 'deep' ensures it captures headings from h2 down to h6.
    outline: 'deep'
  }
})
