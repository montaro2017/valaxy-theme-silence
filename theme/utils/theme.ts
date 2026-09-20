import type { Post } from 'valaxy'

import type { ComputedRef } from 'vue'
import { useHead } from '@unhead/vue'

import { storeToRefs } from 'pinia'

import { useBackToTop, useSiteStore } from 'valaxy'

import { computed } from 'vue'

export function useAllPosts(): ComputedRef<Post[]> {
  return computed(() => {
    const siteStore = useSiteStore()
    const { postList } = storeToRefs(siteStore)
    return postList.value
  })
}

export function scrollToTop() {
  const { backToTop } = useBackToTop()
  backToTop?.()
}

let scrollAnimationFrame: number | undefined

export function smoothScrollToTop() {
  if (typeof window === 'undefined')
    return

  if (scrollAnimationFrame)
    window.cancelAnimationFrame(scrollAnimationFrame)

  const start = window.scrollY || document.documentElement.scrollTop
  if (start <= 0)
    return

  const duration = 500
  const startTime = window.performance.now()

  function scrollStep(currentTime: number) {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const easedProgress = 1 - (1 - progress) ** 3
    window.scrollTo(0, Math.round(start * (1 - easedProgress)))

    if (progress < 1)
      scrollAnimationFrame = window.requestAnimationFrame(scrollStep)
    else
      scrollAnimationFrame = undefined
  }

  scrollAnimationFrame = window.requestAnimationFrame(scrollStep)
}

export function useHighlight(selector: string | HTMLElement, option: {
  className: string
  duration?: number
}) {
  const { className, duration = 1000 } = option
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector
  if (!el)
    return
  el.classList.add(className)
  setTimeout(() => {
    el.classList.remove(className)
  }, duration)
}

export function setTitle(title: ComputedRef<string> | string) {
  useHead({
    title,
  })
}
