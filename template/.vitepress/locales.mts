import type { DefaultTheme } from 'vitepress'

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  root: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonAriaLabel: '搜索文档',
        buttonText: '搜索文档',
      },
      modal: {
        errorScreen: {
          helpText: '你可能需要检查你的网络连接',
          titleText: '无法获取结果',
        },
        footer: {
          closeText: '关闭',
          navigateText: '切换',
          searchByText: '搜索提供者',
          selectText: '选择',
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          reportMissingResultsLinkText: '点击反馈',
          reportMissingResultsText: '你认为该查询应该有结果？',
          suggestedQueryText: '你可以尝试查询',
        },
        searchBox: {
          cancelButtonAriaLabel: '取消',
          cancelButtonText: '取消',
          resetButtonAriaLabel: '清除查询条件',
          resetButtonTitle: '清除查询条件',
        },
        startScreen: {
          favoriteSearchesTitle: '收藏',
          noRecentSearchesText: '没有搜索历史',
          recentSearchesTitle: '搜索历史',
          removeFavoriteSearchButtonTitle: '从收藏中移除',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          saveRecentSearchButtonTitle: '保存至搜索历史',
        },
      },
    },
  },
}

export const themeConfig: Partial<DefaultTheme.Config> = {
  darkModeSwitchLabel: '主题',
  darkModeSwitchTitle: '切换到深色模式',
  lightModeSwitchTitle: '切换到浅色模式',
  docFooter: {
    next: '下一页',
    prev: '上一页',
  },
  outline: {
    level: [2, 3],
    label: '页面导航',
  },
  returnToTopLabel: '回到顶部',
  sidebarMenuLabel: '菜单',
  // lastUpdated: {
  //   formatOptions: {
  //     dateStyle: 'short',
  //     timeStyle: 'medium',
  //   },
  //   text: '最后更新于',
  // },
}
