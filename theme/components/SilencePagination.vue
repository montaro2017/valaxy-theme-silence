<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  total: number
  pageSize: number
  pageNum?: number
  link?: (page: number) => string
}>(), {
  pageNum: 1,
})

const emit = defineEmits(['after'])

// 最多显示按钮数量 包含'...'和首页尾页页码 1...3 4 5...9
const maxButtonCount = 7

const maxPageNum = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const pageNum = computed(() => {
  const value = Number.isFinite(props.pageNum) ? Math.trunc(props.pageNum) : 1
  return Math.min(Math.max(value, 1), maxPageNum.value)
})

// 除去首页和尾页的页码按钮，中间的所有按钮，包含当前页
const buttons = computed(() => {
  const left = Array.from({ length: maxButtonCount - 1 })
    .map((_, i) => pageNum.value - maxButtonCount + 1 + i)
    .filter((n: number) => n > 0)
  const right = Array.from({ length: maxButtonCount - 1 })
    .map((_, i) => pageNum.value + i + 1)
    .filter((n: number) => n <= maxPageNum.value)
  const buttons = [...left, pageNum.value, ...right]
  if (buttons.length <= maxButtonCount) {
    return buttons
  }
  const pageNumIndex = left.length
  const offset = pageNumIndex <= Math.ceil(maxButtonCount / 2) ? 0 : pageNumIndex - Math.ceil(maxButtonCount / 2) + 1
  return buttons.slice(offset, offset + maxButtonCount)
})

// 当前页左侧的所有按钮
const leftButtons = computed(() => {
  return buttons.value.filter((n: number) => n < pageNum.value)
})

// 是否显示左侧省略号
const leftEllipsis = computed(() => {
  return leftButtons.value.length > 0 && !leftButtons.value.includes(1)
})

// 当前页左侧显示的按钮，如果显示左侧省略号 则需要去除2个按钮用于显示首页和省略号
const displayLeftButtons = computed(() => {
  if (!leftEllipsis.value) {
    return leftButtons.value
  }
  return leftButtons.value.slice(2)
})

// 当前页右侧的所有按钮
const rightButtons = computed(() => {
  return buttons.value.filter((n: number) => n > pageNum.value)
})

// 是否显示右侧省略号
const rightEllipsis = computed(() => {
  return rightButtons.value.length > 0 && !rightButtons.value.includes(maxPageNum.value)
})

// 当前页右侧显示的按钮，如果显示右侧省略号 则需要去除2个按钮用于显示省略号和尾页
const displayRightButtons = computed(() => {
  if (!rightEllipsis.value) {
    return rightButtons.value
  }
  return rightButtons.value.slice(0, -2)
})

const prev = computed(() => {
  return pageNum.value <= 1 ? null : pageNum.value - 1
})

const next = computed(() => {
  return pageNum.value >= maxPageNum.value ? null : pageNum.value + 1
})

function emitAfter() {
  emit('after')
}
</script>

<template>
  <div v-if="total > 0" class="silence-pagination">
    <app-link v-if="prev" :to="link?.(prev ?? 1) ?? '#'" @click="emitAfter">
      <silence-button class="silence-patination-item">
        上一页
      </silence-button>
    </app-link>
    <app-link v-if="leftEllipsis" :to="link?.(1) ?? '#'" @click="emitAfter">
      <silence-button class="silence-patination-item">
        1
      </silence-button>
    </app-link>
    <div v-if="leftEllipsis" class="silence-pagination-ellipsis">
      ···
    </div>
    <app-link v-for="n in displayLeftButtons" :key="n" :to="link?.(n) ?? '#'" @click="emitAfter">
      <silence-button class="silence-patination-item">
        {{ n }}
      </silence-button>
    </app-link>
    <silence-button class="silence-patination-item active" aria-current="page" disabled>
      {{ pageNum }}
    </silence-button>
    <app-link v-for="n in displayRightButtons" :key="n" :to="link?.(n) ?? '#'" @click="emitAfter">
      <silence-button class="silence-patination-item">
        {{ n }}
      </silence-button>
    </app-link>
    <div v-if="rightEllipsis" class="silence-pagination-ellipsis">
      ···
    </div>
    <app-link v-if="rightEllipsis" :to="link?.(maxPageNum) ?? '#'" @click="emitAfter">
      <silence-button class="silence-patination-item">
        {{ maxPageNum }}
      </silence-button>
    </app-link>
    <app-link v-if="next" :to="link?.(next ?? maxPageNum) ?? '#'" @click="emitAfter">
      <silence-button class="silence-patination-item">
        下一页
      </silence-button>
    </app-link>
  </div>
</template>

<style>
.silence-pagination {
  display: flex;
  gap: 8px;
  font-weight: 300;
  font-size: 12px;
  margin-top: 16px;
  justify-content: end;
}

.silence-patination-item {
  cursor: pointer;
}

.silence-patination-item.active {
  border-color: transparent;
  color: var(--theme-color) !important;
  cursor: default;
}

button.silence-patination-item.active:hover {
  border-color: transparent;
}
</style>
