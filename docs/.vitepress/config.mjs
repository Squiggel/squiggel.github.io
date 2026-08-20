import { defineConfig } from 'vitepress'
import wikilinks from 'markdown-it-wikilinks'

export default defineConfig({
  title: "DOMAIN-TBD",
  // description: "A VitePress Site",
  themeConfig: {
    appearance: false,
    docFooter: { prev: false, next: false },
    outline: { level: 'deep', label: 'Contents' }
  },
  
  markdown: {
    config: (md) => {
      md.use(wikilinks({ 
        baseURL: '/posts/',
        makeAllLinksAbsolute: true,
        uriSuffix: '',
        postProcessPageName: (pageName) => {
          return pageName.trim().replace(/\.md$/, '')
        }
      }))
    }
  }
})
