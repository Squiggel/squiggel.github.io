import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,

  enhanceApp({ router }) {
    const setupMobileAccordions = () => {
      // Only activate on mobile
      if (window.innerWidth > 768) return

      const content = document.querySelector('.vp-doc')
      if (!content) return

      const headings = Array.from(content.querySelectorAll('h2'))

      headings.forEach((heading) => {
        // Don't initialize twice
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

        // Create wrapper
        const wrapper = document.createElement('div')
        wrapper.className = 'mobile-accordion-content'
        wrapper.hidden = true

        // Insert wrapper before the first element
        heading.parentNode.insertBefore(wrapper, elements[0])

        // Move elements into wrapper
        elements.forEach((element) => {
          wrapper.appendChild(element)
        })

        // Toggle
        heading.addEventListener('click', () => {
          const isOpen = !wrapper.hidden

          wrapper.hidden = isOpen
          heading.classList.toggle('is-open', !isOpen)
          heading.classList.toggle('is-collapsed', isOpen)
        })
      })
    }

    // Initial page
    if (typeof window !== 'undefined') {
      setTimeout(setupMobileAccordions, 0)

      // VitePress client-side navigation
      router.onAfterRouteChanged = () => {
        setTimeout(setupMobileAccordions, 0)
      }
    }
  }
}
