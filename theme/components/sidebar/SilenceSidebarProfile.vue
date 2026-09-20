<script lang="ts" setup>
import type { CategoryList, Post } from 'valaxy'
import { isCategoryList, useCategories, useSiteConfig, useTags } from 'valaxy'
import { computed } from 'vue'
import { useThemeConfig } from '../../composables'
import { useAllPosts } from '../../utils/theme'

const themeConfig = useThemeConfig()
const siteConfig = useSiteConfig()

const avatar = computed(() => themeConfig.value.sidebar?.avatar ?? siteConfig.value.author.avatar)
const author = computed(() => themeConfig.value.sidebar?.author ?? siteConfig.value.author.name)
const intro = computed(() => themeConfig.value.sidebar?.intro ?? siteConfig.value.author.intro)

const posts = useAllPosts()
const postCount = computed(() => posts.value.length)

const categories = useCategories()
const categoryCount = computed(() => {
  function recursive(categories: Map<string, Post | CategoryList>) {
    let count = 0
    for (const [_, category] of categories) {
      if (isCategoryList(category) && category.name !== 'Uncategorized') {
        count++
        if (category.children) {
          count += recursive(category.children)
        }
      }
    }
    return count
  }
  return recursive(categories.value.children)
})

const tags = useTags()
const tagCount = computed(() => tags.value.size)
</script>

<template>
  <div class="silence-profile">
    <div class="silence-sidebar-profile-avatar">
      <img :src="avatar" alt="">
    </div>
    <div class="silence-sidebar-profile-author">
      {{ author }}
    </div>
    <div v-if="intro" class="silence-sidebar-profile-intro">
      {{ intro }}
    </div>
    <div class="silence-sidebar-profile-statistic">
      <div class="silence-sidebar-profile-statistic-item">
        <div class="silence-sidebar-profile-statistic-item-number">
          {{ postCount }}
        </div>
        <div class="silence-sidebar-profile-statistic-item-title">
          文章
        </div>
      </div>
      <div class="silence-sidebar-profile-statistic-item">
        <div class="silence-sidebar-profile-statistic-item-number">
          {{ categoryCount }}
        </div>
        <div class="silence-sidebar-profile-statistic-item-title">
          分类
        </div>
      </div>
      <div class="silence-sidebar-profile-statistic-item">
        <div class="silence-sidebar-profile-statistic-item-number">
          {{ tagCount }}
        </div>
        <div class="silence-sidebar-profile-statistic-item-title">
          标签
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.silence-sidebar-profile-avatar {
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  aspect-ratio: 1 / 1;
  background-color: var(--panel-bg-color);
}

.silence-sidebar-profile-author {
  font-size: 17px;
  font-weight: 700;
  margin-top: 10px;
  text-align: center;
}

.silence-sidebar-profile-intro {
  font-size: 14px;
  font-weight: 300;
  margin-top: 10px;
  text-align: center;
}

.silence-sidebar-profile-statistic {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  /* border-top: 1px solid var(--border-color); */
  /* border-bottom: 1px solid var(--border-color); */
  justify-content: space-evenly;
}

.silence-sidebar-profile-statistic-item {
  text-align: center;
}

.silence-sidebar-profile-statistic-item-number {
  font-weight: 800;
}
</style>
