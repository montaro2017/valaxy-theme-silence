export namespace SilenceTheme {
  export type Config = ThemeConfig
}

/**
 * Theme Config
 */
export interface ThemeConfig {
  colors: string[]

  toggleDarkWithCircleTransition?: boolean

  header?: Partial<{
    title: string
    navItems: NavItemWithChildren[]
  }>

  sidebar?: {
    avatar: string
    author?: string
    intro?: string
    tagLimit?: number
    categoryLimit?: number
    archiveLimit?: number
    friends?: {
      title: string
      url: string
    }[]
  }
  /**
   * footer
   */
  footer?: Partial<{
    copyright: string
    beian: {
      enable: boolean
      icp: string
      url?: string
    }
    powered: {
      enable: boolean
      withSilence?: boolean
    }
  }>

  post?: Partial<{
    toc?: {
      serialNumber?: boolean
    }
    dateFormat?: string
  }>

  /**
   * GitHub Discussions powered comments.
   * Generate repository and category IDs at https://giscus.app/zh-CN.
   */
  giscus?: Partial<{
    enable: boolean
    repo: string
    repoId: string
    category: string
    categoryId: string
    mapping: 'pathname' | 'url' | 'title' | 'og:title'
    strict: boolean
    reactionsEnabled: boolean
    emitMetadata: boolean
    inputPosition: 'top' | 'bottom'
    lang: string
    loading: 'lazy' | 'eager'
  }>

}

export interface NavItem {
  title: string
  url?: string
  target?: string
}

export type NavItemWithChildren = NavItem & {
  children?: NavItem[]
}
