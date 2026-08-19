import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Untitled Site",
  description: "Markdown Driven Blog",
  base: '', 
  themeConfig: {
    nav: [
      { text: 'Home', link: '' },
    ],
    sidebar: [
      {
        text: 'Navigation',
        items: [
          { text: 'Home', link: '' }
        ]
      },
      {
        text: 'Articles',
        items: getPosts() 
      }
    ],
  },
})
