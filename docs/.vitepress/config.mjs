import { defineConfig } from 'vitepress'
import wikilinks from 'markdown-it-wikilinks'

export default defineConfig({
  title: "My Blog",
  description: "A VitePress Site",
  themeConfig: {
    docFooter: { prev: false, next: false },
    outline: { level: 'deep', label: 'Contents' }
  },
  
  markdown: {
    config: (md) => {
      md.use(wikilinks({ 
        baseURL: '/posts/', // Automatically prepends /posts/ to all your wikilinks
        makeAllLinksAbsolute: true,
        uriSuffix: '',
        postProcessPageName: (pageName) => {
          return pageName.trim().replace(/\.md$/, '')
        }
      }))
    }
  }
})
