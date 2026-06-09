const { execFileSync } = require("node:child_process");

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

function hasChanges() {
  return git(["status", "--porcelain"]).length > 0;
}

try {
  git(["rev-parse", "--is-inside-work-tree"]);
} catch {
  console.error("当前目录不是 git 仓库，请先运行 git init。");
  process.exit(1);
}

const name = `checkpoint/${timestamp()}-before-change`;

if (hasChanges()) {
  git(["add", "-A"], { stdio: "inherit" });
  git(["commit", "-m", name], { stdio: "inherit" });
} else {
  console.log("当前没有未提交改动，将只在 HEAD 上创建 checkpoint tag。");
}

try {
  git(["tag", name], { stdio: "inherit" });
  console.log(`已创建 checkpoint: ${name}`);
} catch {
  console.error(`创建 tag 失败，可能已存在同名 checkpoint: ${name}`);
  process.exit(1);
}
