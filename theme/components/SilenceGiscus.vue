<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeConfig } from '../composables'
import { useSilenceAppStore } from '../store/app'

const themeConfig = useThemeConfig()
const route = useRoute()
const { isDark } = storeToRefs(useSilenceAppStore())
const container = ref<HTMLDivElement>()

const giscus = computed(() => themeConfig.value.giscus)
const giscusOrigin = 'https://giscus.app'

function clearGiscus() {
  container.value?.replaceChildren()
}

function renderGiscus() {
  clearGiscus()

  const options = giscus.value
  if (!container.value)
    return

  if (!options?.repo || !options.repoId || !options.categoryId) {
    if (import.meta.env.DEV)
      console.warn('[valaxy-theme-silence] Giscus requires repo, repoId, and categoryId.')
    return
  }

  const script = document.createElement('script')
  script.src = `${giscusOrigin}/client.js`
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', options.repo)
  script.setAttribute('data-repo-id', options.repoId)
  script.setAttribute('data-category', options.category ?? 'Announcements')
  script.setAttribute('data-category-id', options.categoryId)
  script.setAttribute('data-mapping', options.mapping ?? 'pathname')
  script.setAttribute('data-strict', options.strict ? '1' : '0')
  script.setAttribute('data-reactions-enabled', options.reactionsEnabled === false ? '0' : '1')
  script.setAttribute('data-emit-metadata', options.emitMetadata ? '1' : '0')
  script.setAttribute('data-input-position', options.inputPosition ?? 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', options.lang ?? 'zh-CN')
  script.setAttribute('data-loading', options.loading ?? 'lazy')

  container.value.appendChild(script)
}

function updateGiscusTheme() {
  const iframe = container.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage({
    giscus: {
      setConfig: {
        theme: isDark.value ? 'dark' : 'light',
      },
    },
  }, giscusOrigin)
}

onMounted(renderGiscus)

watch(() => route.fullPath, async () => {
  await nextTick()
  renderGiscus()
})

watch(giscus, async () => {
  await nextTick()
  renderGiscus()
}, { deep: true })

watch(isDark, updateGiscusTheme)
onBeforeUnmount(clearGiscus)
</script>

<template>
  <div ref="container" class="silence-giscus" />
</template>

<style scoped>
.silence-giscus {
  width: 100%;
  margin-top: 2rem;
}
</style>
