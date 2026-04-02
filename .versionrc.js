module.exports = {
  types: [
    {
      type: 'feat',
      section: '新增',
      hidden: false
    },
    {
      type: 'fix',
      section: '修复',
      hidden: false
    },
    {
      type: 'docs',
      section: '文档',
      hidden: false
    },
    {
      type: 'chore',
      section: '构建',
      hidden: false
    },
    {
      type: 'refactor',
      section: '重构',
      hidden: false
    },
    {
      type: 'test',
      section: '测试',
      hidden: false
    },
    {
      type: 'style',
      section: '样式',
      hidden: false
    },
    {
      type: 'perf',
      section: '性能',
      hidden: false
    }
  ],
  commitUrlFormat: 'https://github.com/WinnerNew/nest-social-api/commit/{{hash}}',
  compareUrlFormat: 'https://github.com/WinnerNew/nest-social-api/compare/{{previousTag}}...{{currentTag}}',
  header: '更新日志',
  footer: '## 版本说明\n\n### 版本格式\n- **主版本号**：不兼容的 API 修改\n- **次版本号**：向下兼容的功能性新增\n- **修订号**：向下兼容的问题修正\n\n### 变更类型\n- `新增`：新功能\n- `变更`：现有功能的变更\n- `弃用`：即将移除的功能\n- `移除`：已移除的功能\n- `修复`：bug 修复\n- `安全`：安全相关的修复',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}'
};