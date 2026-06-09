# 版本回退与对比工作流

这个项目使用 Git 保存可回退版本。稳定版本放在 `main`，设计迭代放在 `feature/design-iteration`。

## 保存当前版本

运行：

```bash
npm run checkpoint
```

它会自动执行 `git add -A`，创建一次 checkpoint commit，并打一个同名 tag：

```text
checkpoint/YYYYMMDD-HHMM-before-change
```

建议每次视觉大改、结构大改、接新数据源之前都先运行一次。

## 查看历史版本

运行：

```bash
npm run history
```

它会显示最近 20 次提交和 checkpoint tag。

也可以只看 checkpoint：

```bash
git tag --list "checkpoint/*" --sort=-creatordate
```

## 退回上一个版本

运行：

```bash
npm run rollback:last
```

这个命令是安全回退：它不会执行 `git reset --hard`，不会静默删除代码。它会先检查是否有未提交改动；如果有，会要求你先保存或 stash。确认后，它会从最近的 checkpoint 创建一个 `rollback/...` 分支并切过去，用来查看旧版本。

## 退回指定版本

先查看 checkpoint：

```bash
git tag --list "checkpoint/*" --sort=-creatordate
```

然后创建一个查看分支：

```bash
git switch -c rollback/my-review checkpoint/20260609-1232-before-change
```

如果只是临时查看，不要在这个分支上继续开发。确认要基于旧版本重做时，再新建清晰命名的 feature 分支。

## 对比两个版本差异

对比当前版本和最近 checkpoint：

```bash
npm run diff:last
```

对比任意两个版本：

```bash
git diff checkpoint/A..checkpoint/B
```

查看文件列表变化：

```bash
git diff --stat checkpoint/A..checkpoint/B
```

## 只撤销最近一次修改

安全做法是创建一个反向提交：

```bash
git revert HEAD
```

这会保留历史，并生成一个“撤销上一 commit”的新 commit。

不建议直接使用：

```bash
git reset --hard HEAD~1
```

除非你明确知道它会丢弃工作区代码，并且已经说“确认强制回退”。

## 保留当前代码但临时切回旧版本查看

如果当前有未提交改动，先保存：

```bash
npm run checkpoint
```

然后切到旧版本查看：

```bash
git switch -c review/old-home checkpoint/20260609-1232-before-change
```

看完回到设计迭代分支：

```bash
git switch feature/design-iteration
```

## 分支约定

- `main`：稳定版本，不能直接做大改。
- `feature/design-iteration`：设计和页面迭代分支。
- `rollback/*`：安全查看旧版本的临时分支。
- `checkpoint/*`：可回退点 tag。
