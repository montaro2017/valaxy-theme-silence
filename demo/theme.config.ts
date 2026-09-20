import type { ThemeConfig } from 'valaxy-theme-silence'

export default {
  colors: [
    '#ff5722',
    '#0078E7',
    '#fa7298',
    '#42b983',
    '#607d8b',
    '#5e72e4',
    '#ff9700',
    '#009688',
    '#673bb7',
    '#906f61',
  ],
  header: {
    title: '碱式碳酸铜的博客',
    navItems: [
      {
        title: '首页',
        url: '/',
      },
      {
        title: 'Github',
        children: [
          {
            title: 'Github',
            url: 'https://github.com/montaro2017',
          },
          {
            title: 'Gitee',
            url: 'https://gitee.com/montaro2017',
          },
        ],
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
    avatar: '/valaxy-theme-silence/assets/avatar.jpg',
    intro: '你所热爱的，就是你的生活',
    tagLimit: 0,
    categoryLimit: 0,
    archiveLimit: 0,
  },
  footer: {
    copyright: 'Copyright © 2025 XXXXX',
    beian: {
      enable: true,
      icp: '苏ICP备xxxxxxxx号',
    },
    powered: {
      enable: true,
    },
  },
  post: {
    toc: {
      serialNumber: true,
    },
  },
  giscus: {
    enable: true,
    repo: 'Montaro2017/valaxy-theme-silence',
    repoId: 'R_kgDOP2aNwQ',
    category: 'Comments',
    categoryId: 'DIC_kwDOP2aNwc4DF-2i',
  },
} as ThemeConfig
