# Homepage Visual Builder

这个 Builder 只服务首页 `/`，用于在开发环境里像搭积木一样添加、编辑、移动、复制和删除首页模块。

## 如何进入 Builder 模式

启动开发服务器后打开首页 `/`。页面右下角会出现 `开发者` 按钮。点击后进入 Builder 模式。

Builder UI 使用 `process.env.NODE_ENV !== "production"` 控制，生产环境不会显示开发者按钮和 Builder 工具栏。

## 如何添加模块

进入 Builder 模式后，首页第一个模块前、每两个模块之间、最后一个模块后都会出现 `+ 添加模块`。

点击某个 `+ 添加模块` 后会打开模块选择弹窗。选择模块类型后，新模块会插入到刚才点击的位置。插入逻辑使用明确的 `insertIndex`，不会靠鼠标坐标猜位置。

当前支持的模块：

- 首屏 Hero
- 股票搜索
- 产业链入口
- 机器人展示
- 卡片组
- 指标网格
- 公司网格
- 左右图文
- 时间线
- 风险提示
- CTA
- 空白间距

## 如何编辑模块

每个模块右上角都有模块工具条：

- 编辑
- 上移
- 下移
- 复制
- 删除

点击 `编辑` 后，右侧会打开属性编辑面板。第一版使用简单 input / textarea，可以修改标题、副标题、按钮文字、按钮链接、图片路径，以及卡片、公司、指标、时间线和风险列表等数组内容。

数组字段支持添加一项、删除一项，并编辑每一项里的标题、描述和其他文本字段。`tags` 字段用英文逗号或中文逗号分隔后保存为数组。

## 如何移动、复制、删除模块

在模块右上角工具条中：

- `上移` 会把模块在 `sections` 数组中向前移动一位。
- `下移` 会把模块在 `sections` 数组中向后移动一位。
- `复制` 会复制当前模块，并生成新的 id。
- `删除` 会先弹出确认框，确认后才删除。

## 如何保存

点击 Builder 工具栏里的 `保存`。

保存位置：

```text
localStorage key: homepage-builder-sections
```

刷新页面后，如果 localStorage 里存在这个 key，首页会优先使用保存过的 sections 渲染；否则使用 `defaultHomeSections`。

## 如何导出 JSON

点击 Builder 工具栏里的 `导出 JSON`。当前首页配置会复制到剪贴板，格式类似：

```json
{
  "pageId": "home",
  "version": 1,
  "sections": []
}
```

## 如何导入 JSON

点击 Builder 工具栏里的 `导入 JSON`，粘贴导出的 JSON，然后确认导入。首页会立即按导入的 sections 渲染。

## 如何重置

点击 `重置为默认首页` 会清除 `homepage-builder-sections`，并把当前页面恢复成代码里的 `defaultHomeSections`。

点击 `清空本地修改` 会移除 localStorage 里的 Builder 配置；刷新后也会回到默认首页。

## 如何把满意版本固化到代码

第一版 Builder 先保存到 localStorage。若你满意当前首页搭建结果：

1. 在 Builder 工具栏点击 `导出 JSON`。
2. 把复制出来的 JSON 发给 Codex。
3. 要求 Codex 把 JSON 里的 `sections` 固化进 `src/data/defaultHomeSections.ts`。
4. Codex 固化后再运行 `npm run build` 验证。

这样首页默认版本就不再依赖你的浏览器 localStorage。
