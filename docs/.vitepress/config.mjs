import { defineConfig } from 'vitepress'
import wikilinks from 'markdown-it-wikilinks'

export default defineConfig({
  title: "My Blog",
  description: "A VitePress Site",
  themeConfig: {
    docFooter: { prev: false, next: false },
    outline: { level: 'deep', label: 'Contents' }
  },
  
  // Add this new markdown block
  markdown: {
    config: (md) => {
      // Configured to use the "|" as the alias divider
      md.use(wikilinks({ makeAllLinksAbsolute: true }))
    }
  }
})
