import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  lang: 'zh-CN',
  title: '碱式碳酸铜\'s Blog',
  url: 'https://blog.montaro.cn',
  author: {
    avatar: 'https://www.yunyoujun.cn/images/avatar.jpg',
    name: '碱式碳酸铜',
  },
  description: '碱式碳酸铜\'s Blog',
  search: {
    enable: true,
    type: 'fuse',
  },
  frontmatter: {
    toc: false,
  },
  fuse: {
    dataPath: 'valaxy-fuse-list.json',
    /**
     * 设置搜索的文件路径
     */
    pattern: 'pages/**/*.md',
    options: {
      keys: ['title', 'tags', 'categories', 'excerpt', 'content'],
      /**
       * @default 0.6
       * @see https://www.fusejs.io/api/options.html#threshold
       * 设置匹配阈值，越低越精确
       */
      // threshold: 0.6,
      /**
       * @default false
       * @see https://www.fusejs.io/api/options.html#ignoreLocation
       * 忽略位置
       * 这对于搜索文档全文内容有用，若无需全文搜索，则无需设置此项
       */
      ignoreLocation: true,
    },
  },
  license: {
    enabled: true,
    language: 'zh-hans',
  },
  sponsor: {
    enable: true,
    description: 'Buy me a cup of coffee ☕',
    methods: [
      {
        name: '支付宝',
        icon: 'i-ant-design-alipay-outlined',
        url: '/alipay.jpg',
      },
      {
        name: '微信',
        icon: 'i-ant-design-wechat-outlined',
        url: '/wechat.png',
      },
    ],
  },
  comment: {
    enable: true,
  },
})
