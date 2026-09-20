import type { ResolvedValaxyOptions } from 'valaxy'
import type { Plugin } from 'vite'
import type { ThemeConfig } from '../types'

/**
 * Default Config
 */
export const defaultThemeConfig: ThemeConfig = {

  toggleDarkWithCircleTransition: true,

  // 可选主题颜色
  colors: [
    '#0078E7',
    '#fa7298',
    '#42b983',
    '#607d8b',
    '#5e72e4',
    '#ff9700',
    '#ff5722',
    '#009688',
    '#673bb7',
    '#906f61',
  ],
  header: {
    // 头部导航
    navItems: [
      {
        title: '首页',
        url: '/',
      },
      {
        title: '分类',
        url: '/categories',
      },
      {
        title: '标签',
        url: '/tags',
      },
      {
        title: '归档',
        url: '/archives',
      },
    ],
  },
  sidebar: {
    avatar: '/assets/avatar.jpg',
    // 侧边栏作者名称 若未设置 则使用siteConfig.author.name
    author: '碱式碳酸铜',
  },
  footer: {
    copyright: 'Copyright © 2025 XXXXX',
    beian: {
      enable: false,
      icp: '',
      url: 'https://beian.miit.gov.cn/',
    },
    powered: {
      enable: true,
      withSilence: true,
    },
  },
  post: {
    dateFormat: 'YYYY-MM-DD',
  },
  giscus: {
    enable: false,
    repo: '',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
    mapping: 'pathname',
    strict: false,
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: 'top',
    lang: 'zh-CN',
    loading: 'lazy',
  },
}

// write a vite plugin
// https://vitejs.dev/guide/api-plugin.html
export function themePlugin(options: ResolvedValaxyOptions<ThemeConfig>): Plugin {
  const themeConfig = options.config.themeConfig || {}

  return {
    name: 'valaxy-theme-starter',
    transform(code: string, id: string) {
      // 检查是否为theme/styles/vars.css文件
      if (id === `${options.themeRoot}/styles/vars.css`) {
        // 获取主题颜色数组
        const colors = themeConfig.colors || defaultThemeConfig.colors
        // 生成主题颜色CSS变量
        let colorVars = ''
        if (colors && colors.length > 0) {
          colorVars += '\n/* 动态生成的主题颜色变量 */\n'
          colors.forEach((color: string, _: any) => {
            color = color.trim()
            colorVars += `[color="${color}"] {\n  --theme-color: ${color};\n}\n`
          })
        }
        // 将生成的CSS追加到原文件末尾
        return code + colorVars
      }
      return null
    },
  }
}

// /**
//  * generateSafelist by config
//  * @param themeConfig
//  */
// export function generateSafelist(themeConfig: ThemeConfig) {
//   const safelist: string[] = []

//   const footerIcon = themeConfig.footer?.icon?.name
//   if (footerIcon)
//     safelist.push(footerIcon)

//   return safelist
// }
