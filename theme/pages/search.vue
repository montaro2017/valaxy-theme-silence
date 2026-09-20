<script lang="ts" setup>
import { useFuseSearch, useSiteConfig } from 'valaxy'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThemePagination } from '../utils/pagination'
import { getFirstQuery, getSearchLink } from '../utils/route'
import { scrollToTop, setTitle } from '../utils/theme'

defineOptions({
  name: 'SilenceSearch',
})
const route = useRoute()
const keyword = computed(() => getFirstQuery(route, 'q')?.value ?? '')
const { results, fetchFuseListData } = useFuseSearch(keyword)

onMounted(() => {
  fetchFuseListData()
})

const title = computed(() => `${keyword.value} 的搜索结果（共${results.value?.length ?? 0}条）`)
setTitle(computed(() => `${keyword.value} - 搜索结果`))

const routePage = getFirstQuery(route, 'page')
const pageNum = computed(() => Number(routePage.value ?? 1))

const siteConfig = useSiteConfig()
const pageSize = computed(() => siteConfig.value.pageSize)

const posts = computed(() => {
  return results.value?.map(item => item.item)
})

const pagination = useThemePagination(posts, pageNum, pageSize)
const total = computed(() => pagination.value.total)
const displayPosts = computed(() => pagination.value.list)

function getLink(page: number) {
  return getSearchLink(keyword.value!, page)
}
</script>

<template>
  <silence-content-block :title="title">
    <silence-post-list :posts="displayPosts" />
    <silence-pagination :total="total" :page-size="pageSize" :page-num="pageNum" :link="getLink" @after="scrollToTop" />
  </silence-content-block>
</template>
