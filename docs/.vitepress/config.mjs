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
      md.use(wikilinks({ 
        makeAllLinksAbsolute: true,
        uriSuffix: '' // This stops the plugin from appending .html
      }))
    }
  }
})
