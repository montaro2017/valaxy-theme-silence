<script lang="ts" setup>
import { useTags } from 'valaxy'
import { computed } from 'vue'
import { useThemeConfig } from '../../composables'

const themeConfig = useThemeConfig()

const tagLimit = computed(() => themeConfig.value.sidebar?.tagLimit ?? 0)
const tags = useTags()

const tagsToShow = computed(() => {
  if (tagLimit.value > 0) {
    return new Map(Array.from(tags.value).slice(0, tagLimit.value))
  }
  return tags.value
})
</script>

<template>
  <silence-sidebar-block class="silence-sidebar-tags" title="标签">
    <silence-sidebar-tag-item v-for="tag in tagsToShow" :key="tag[0]" :tag="tag" />
  </silence-sidebar-block>
</template>
