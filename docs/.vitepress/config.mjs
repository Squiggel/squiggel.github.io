import { defineConfig } from 'vitepress'
import wikilinks from 'markdown-it-wikilinks'

export default defineConfig({
  title: "Dahu! An eclectic collection for no one in particular.",
  appearance: 'light',
  themeConfig: {
    logo: '/images/dahu-logo.svg',
    nav: [],
    docFooter: { prev: false, next: false },
    outline: { level: 'deep', label: 'Contents' },
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
