# Web Builder V3 Phase 1

当前阶段只实现首页 `/` 的中文开发者 overlay。

## 进入方式

开发环境打开 `/` 后，点击右下角“开发者模式”。

正常访问 `/` 时显示原首页，Builder 不替换原首页 DOM，只在开发者模式中叠加可编辑元素。

## 已支持组件

- 标题
- 文本
- 按钮
- 图片
- 搜索框
- 卡片
- 分割线
- 间距

## 保存数据

Phase 1 只读取和写入：

```json
{
  "/": {
    "title": "首页",
    "path": "/",
    "elements": []
  }
}
```

localStorage key：

```text
web-builder:pages
```

旧 key 不再读取：

```text
web-builder:home
homepage-builder-sections
homepage-builder-v2-sections
```

工具栏里的“清除旧 Builder 数据”会删除这些旧 key。
