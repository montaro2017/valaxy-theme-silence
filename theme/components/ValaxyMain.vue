<script lang="ts" setup>
import type { Post } from 'valaxy'
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useThemeConfig } from '../composables'

const props = defineProps<{
  frontmatter: Post
}>()
const siteConfig = useSiteConfig()

const license = computed(() => siteConfig.value.license)
const sponsor = computed(() => siteConfig.value.sponsor)

const themeConfig = useThemeConfig()

const defaultToc = computed(() => {
  return props.frontmatter.toc ?? false
})

const tocSerialNumber = computed(() => {
  return themeConfig.value.post?.toc?.serialNumber ?? true
})

const giscusEnabled = computed(() => themeConfig.value.giscus?.enable ?? false)
</script>

<template>
  <main class="silence-post">
    <header class="silence-post-title">
      {{ frontmatter.title }}
    </header>
    <div class="max-w-none prose dark:prose-invert">
      <ValaxyMd :frontmatter="frontmatter">
        <slot name="main-content-md" />
      </ValaxyMd>
    </div>
    <silence-copyright v-if="license.enabled" />
    <silence-post-info :frontmatter="frontmatter" />
    <silence-sponsor v-if="sponsor.enable" />
    <silence-post-nav />
    <silence-post-desc :frontmatter="frontmatter" />
    <div v-if="siteConfig.comment.enable && frontmatter.comment !== false" class="comment">
      <SilenceGiscus v-if="giscusEnabled" />
      <slot v-else name="comment" />
    </div>
    <silence-post-toc :default-toc="defaultToc" :serial-number="tocSerialNumber" />
  </main>
</template>

<style>
.silence-post-title {
  font-size: 21px;
  line-height: 1.2;
}
</style>
