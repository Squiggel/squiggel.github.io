import DefaultTheme from 'vitepress/theme'
import DocLayout from './DocLayout.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: DocLayout,

  enhanceApp({ router }) {
    const setupMobileAccordions = () => {
      if (window.innerWidth > 768) return

      const content = document.querySelector('.vp-doc')
      if (!content) return

      const headings = Array.from(content.querySelectorAll('h2'))

      headings.forEach((heading) => {
        if (heading.dataset.accordionReady) return

        const elements = []
        let next = heading.nextElementSibling

        while (next && next.tagName !== 'H2') {
          elements.push(next)
          next = next.nextElementSibling
        }

        if (!elements.length) return

        heading.dataset.accordionReady = 'true'
        heading.classList.add('mobile-accordion-heading')
        heading.classList.add('is-collapsed')

        const wrapper = document.createElement('div')
        wrapper.className = 'mobile-accordion-content'
        wrapper.hidden = true

        heading.parentNode.insertBefore(wrapper, elements[0])

        elements.forEach((element) => {
          wrapper.appendChild(element)
        })

        heading.addEventListener('click', () => {
          const isOpen = !wrapper.hidden

          wrapper.hidden = isOpen
          heading.classList.toggle('is-open', !isOpen)
          heading.classList.toggle('is-collapsed', isOpen)
        })
      })
    }

    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')

      setTimeout(setupMobileAccordions, 0)

      router.onAfterRouteChanged = () => {
        setTimeout(setupMobileAccordions, 0)
      }
    }
  }
}
