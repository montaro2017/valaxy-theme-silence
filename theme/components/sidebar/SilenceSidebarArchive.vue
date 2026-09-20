<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeConfig } from '../../composables'
import { useArchives } from '../../utils/archive'

const themeConfig = useThemeConfig()

const archiveLimit = computed(() => themeConfig.value.sidebar?.archiveLimit ?? 0)
const archives = useArchives()

const archiveToShow = computed(() => {
  if (archiveLimit.value > 0) {
    return new Map(Array.from(archives.value).slice(0, archiveLimit.value))
  }
  return archives.value
})
</script>

<template>
  <silence-sidebar-block title="归档">
    <silence-sidebar-archive-item v-for="archive in archiveToShow" :key="archive[1].id" :archive="archive" />
  </silence-sidebar-block>
</template>
