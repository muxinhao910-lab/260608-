# Web Page Builder V3

Web Builder V3 是首页 `/` 的通用网页可视化搭建器。它不是股票、机器人或产业链业务模块库，而是基础网页组件库，类似低配版 Webflow / Framer / Elementor。

## 进入 Builder V3

开发环境打开首页：

```text
http://127.0.0.1:3000/
```

右下角点击 `开发者模式`。

生产环境通过 `process.env.NODE_ENV !== "production"` 隐藏开发者按钮和 Builder UI。

## 添加基础模块

进入 Builder 后，左侧是基础组件库。第一版支持：

- 布局：Section, Container, Row, Column, Grid, Spacer, Divider
- 文字：Heading, Text, RichText, Badge
- 媒体：Image, Icon, BackgroundLayer
- 按钮和链接：Button, Link, IconButton
- 表单：Input, SearchBox, Select
- 导航：Navbar, NavItem, HamburgerMenu, Breadcrumb
- 内容：Card, CardGrid, List, Accordion, Timeline
- 高级视觉：HeroBanner, GlassPanel, Marquee

点击组件会添加到画布中。也可以从左侧拖到画布，放在哪里就添加在哪里。

## 拖动和缩放

点击画布里的元素选中它。选中后会出现蓝色边框和 8 个 resize handles。

- 拖动元素主体：改变 `layout.x` 和 `layout.y`
- 拖动边角或边缘 handle：改变 `layout.width` 和 `layout.height`
- 拖动和缩放会吸附 8px 网格
- 右侧 Inspector 可以精确编辑 x、y、width、height、zIndex

## 右侧 Inspector

选中元素后，右侧面板可以编辑：

- 内容：text、title、description、href、image src、placeholder、items/cards 数组
- 位置和尺寸：x、y、width、height、zIndex
- 样式：color、background、border、borderRadius、opacity、fontSize、fontWeight、textAlign、padding、margin
- 状态：locked、hidden

修改后画布会立即更新。

## 工具栏

顶部工具栏包含：

- 保存
- 撤销
- 重做
- 预览 / 退出预览
- 导出 JSON
- 导入 JSON
- 重置
- 退出开发者模式

## 保存方式

第一版使用 localStorage，不接数据库。

```text
localStorage key: web-builder:home
```

保存结构：

```json
{
  "pageId": "home",
  "version": 3,
  "canvas": {
    "width": 1440,
    "height": 3000,
    "background": "#050505"
  },
  "elements": []
}
```

点击 `保存` 后写入 localStorage。刷新页面后会优先读取 `web-builder:home`；没有本地配置时使用 `src/data/defaultHomeCanvas.ts`。

## 导入和导出 JSON

点击 `导出 JSON` 可以复制完整 V3 配置。

点击 `导入 JSON` 粘贴完整配置，可以恢复画布、元素、内容和 layout。导入后需要点击 `保存` 才会写入 localStorage。

## 预览模式

点击 `预览` 后会隐藏网格、边框、resize handle、左侧组件库和右侧 Inspector，只看最终网页效果。

点击右下角 `退出预览` 回到编辑状态。

## 生成给 Codex 的修改指令

选中元素后，右侧 Inspector 点击 `复制此元素修改指令`，会复制结构化文本：

```text
【目标页面】
home /

【目标元素】
id: element_xxx
type: Heading
text: 当前文字

【当前位置】
x=120, y=340, width=680, height=90, zIndex=3

【我想修改】
请在这里写我的需求：

【要求】
只修改这一个元素，不要修改其他页面或其他元素。
```

以后把这段发给 Codex，Codex 就能明确知道要改哪一个元素。

## 后台子路由

后台新增持久化 layout：

```text
src/app/admin/layout.tsx
```

`/admin/dashboard`、`/admin/builder`、`/admin/pages`、`/admin/components` 切换时，后台左侧菜单和顶部栏会保持存在。内部导航使用 Next.js `Link`，不再依赖普通 `<a href>` 做后台子路由切换。

## 固化到代码

满意当前首页后：

1. 点击 `导出 JSON`
2. 把 JSON 发给 Codex
3. 要求 Codex 把 JSON 固化进 `src/data/defaultHomeCanvas.ts`
4. 运行 `npm run build` 验证

## 回退

如果不满意，可以回退到 checkpoint：

```text
checkpoint/20260610-0758-before-change
```

优先让 Codex 使用项目回退脚本或 Git revert，不要手动猜测恢复文件。
