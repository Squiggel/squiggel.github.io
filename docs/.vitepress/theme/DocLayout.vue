<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const formatDate = (date) => {
  if (!date) return ''

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <div
        v-if="frontmatter.author || frontmatter.date"
        class="post-byline"
      >
        <span v-if="frontmatter.author" class="post-author">
          {{ frontmatter.author }}
        </span>

        <span
          v-if="frontmatter.author && frontmatter.date"
          class="post-byline-separator"
        >
          ·
        </span>

        <time v-if="frontmatter.date" :datetime="frontmatter.date">
          {{ formatDate(frontmatter.date) }}
        </time>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
