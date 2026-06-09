# Codex 工作规则

以后 Codex 修改这个项目时必须遵守以下规则。

1. 每次做视觉或结构性大改之前，先创建 checkpoint。
2. 每次只改一个明确目标，不顺手重构无关代码。
3. 改完必须告诉用户：
   - 改了哪些文件
   - 为什么这么改
   - 如何预览
   - 如何回退
4. 如果用户说“不满意，退回上一版”，优先使用 Git 回退，不手动猜测恢复。
5. 如果用户说“保留这个版本，再试一个方向”，先新建 checkpoint，必要时新建分支。
6. 所有视觉改动尽量模块化，方便局部撤销。
7. 不在 `main` 上直接做大改。新功能默认在 `feature/design-iteration` 上完成。
8. 如果工作区有未提交改动，先提醒用户保存、checkpoint 或 stash，再做可能影响回退的操作。
9. 禁止默认执行 `git reset --hard`、`git clean -fd` 等破坏性命令。除非用户明确说“确认强制回退”。
10. 每次交付前尽量运行 `npm run build`，并说明验证结果。

## Agent Skill 调用规则

每次执行任务前，Codex 必须先说明：
- 本次是否使用 skill。
- 使用哪个 skill。
- 为什么使用该 skill。
- 为什么不使用其他相关 skill。
- 本次只修改哪些范围。

项目级 skills 优先从 `.codex/skills` 查找和使用，避免污染全局环境。当前项目已安装：
- `frontend-design`
- `react-best-practices`
- `web-design-guidelines`
- `web-design-engineer`

具体调用规则：
- 做首页视觉、鼠标动效、黑色高级风格、3D 交互时，优先使用 `frontend-design`；如果需要更强的视觉工程判断，可同时参考 `web-design-engineer`。
- 做 React / Next.js 页面和组件时，使用 `react-best-practices`。如果后续安装了 `next-best-practices`，涉及 Next.js 路由、RSC 边界、数据获取、页面架构时也必须使用它。
- 做 Page Builder、模块编辑器、属性面板时，优先使用 `building-components`；如果该 skill 未安装，必须先说明缺失，并只做最小范围实现。
- 做 UI 审查、可访问性、界面一致性、交互问题检查时，使用 `web-design-guidelines`。
- 每次大视觉修改前后，优先使用 `before-and-after` 做截图对比；如果该 skill 未安装，必须说明缺失，并用当前可用的截图/浏览器检查替代。
- 不允许因为使用 design skill 就重构整个项目。
- 不允许把子页面问题改到主页，必须以 Design Review Overlay 的【目标页面】为准。
- 修改前必须创建 checkpoint。
