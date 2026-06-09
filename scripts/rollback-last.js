const { execFileSync } = require("node:child_process");
const readline = require("node:readline/promises");

function git(args, options = {}) {
  const output = execFileSync("git", args, { encoding: "utf8", stdio: options.stdio || "pipe" });
  return typeof output === "string" ? output.trim() : "";
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "-",
    pad(now.getHours()),
    pad(now.getMinutes())
  ].join("");
}

function latestCheckpointBeforeHead() {
  const tags = git(["tag", "--list", "checkpoint/*", "--sort=-creatordate"])
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  for (const tag of tags) {
    const mergeBase = git(["merge-base", "HEAD", tag]);
    const tagCommit = git(["rev-parse", tag]);
    if (mergeBase === tagCommit && git(["rev-parse", "HEAD"]) !== tagCommit) {
      return tag;
    }
  }

  return tags[0] || "";
}

async function main() {
  try {
    git(["rev-parse", "--is-inside-work-tree"]);
  } catch {
    console.error("当前目录不是 git 仓库。");
    process.exit(1);
  }

  const dirty = git(["status", "--porcelain"]);
  if (dirty) {
    console.error("检测到未提交改动。请先运行 npm run checkpoint 保存，或手动 git stash 后再回退。");
    process.exit(1);
  }

  const checkpoint = latestCheckpointBeforeHead();
  if (!checkpoint) {
    console.error("没有找到 checkpoint/* tag。");
    process.exit(1);
  }

  console.log(`准备安全切回: ${checkpoint}`);
  console.log("这不会删除当前分支代码，也不会执行 git reset --hard。");
  console.log("脚本会从该 checkpoint 创建一个新的查看分支并切过去。");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("请输入 rollback 确认继续：");
  rl.close();

  if (answer.trim() !== "rollback") {
    console.log("已取消。");
    return;
  }

  const safeName = checkpoint.replace(/^checkpoint\//, "").replace(/[^a-zA-Z0-9._-]/g, "-");
  const branch = `rollback/${timestamp()}-${safeName}`;
  git(["switch", "-c", branch, checkpoint], { stdio: "inherit" });
  console.log(`已切换到安全回退分支: ${branch}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
