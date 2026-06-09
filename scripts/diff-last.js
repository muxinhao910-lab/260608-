const { execFileSync } = require("node:child_process");

function git(args, options = {}) {
  const output = execFileSync("git", args, { encoding: "utf8", stdio: options.stdio || "pipe" });
  return typeof output === "string" ? output.trim() : "";
}

const tags = git(["tag", "--list", "checkpoint/*", "--sort=-creatordate"])
  .split(/\r?\n/)
  .map((item) => item.trim())
  .filter(Boolean);

if (!tags.length) {
  console.error("没有找到 checkpoint/* tag。");
  process.exit(1);
}

const head = git(["rev-parse", "HEAD"]);
const checkpoint =
  tags.find((tag) => {
    const tagCommit = git(["rev-parse", tag]);
    return tagCommit !== head;
  }) || tags[0];

console.log(`对比当前版本与 ${checkpoint}:`);
git(["diff", "--stat", `${checkpoint}..HEAD`], { stdio: "inherit" });
git(["diff", `${checkpoint}..HEAD`], { stdio: "inherit" });
