import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const cmsStore = fs.readFileSync(path.join(repoRoot, "src", "lib", "cms-store.ts"), "utf8");
const homePage = fs.readFileSync(path.join(repoRoot, "src", "app", "page.tsx"), "utf8");
const homeEditShell = fs.readFileSync(path.join(repoRoot, "src", "components", "site-editor", "HomeEditShell.tsx"), "utf8");

test("home editor keeps a page type and localStorage-backed module state", () => {
  assert.match(cmsStore, /type HomeEditorPageType = "flow" \| "free"/);
  assert.match(cmsStore, /type HomeEditorState/);
  assert.match(cmsStore, /pageId: "home"/);
  assert.match(cmsStore, /pageType: "flow"/);
  assert.match(cmsStore, /HOME_EDITOR_STATE_KEY\s*=\s*"chain-radar-home-editor-state-v1"/);
  assert.match(cmsStore, /getHomeEditorState/);
  assert.match(cmsStore, /saveHomeEditorState/);
});

test("home editor supports the Phase 1A module types", () => {
  assert.match(cmsStore, /type: "text"/);
  assert.match(cmsStore, /type: "button"/);
  assert.match(cmsStore, /type: "decoration"/);
  assert.match(cmsStore, /createHomeEditorModule/);
});

test("home editor shell exposes edit mode actions", () => {
  assert.match(homeEditShell, /进入编辑模式/);
  assert.match(homeEditShell, /添加文字/);
  assert.match(homeEditShell, /添加按钮/);
  assert.match(homeEditShell, /添加装饰块/);
  assert.match(homeEditShell, /删除选中模块/);
  assert.match(homeEditShell, /保存/);
  assert.match(homeEditShell, /saveHomeEditorState\(state\)/);
});

test("home page mounts the home editor shell without replacing the existing page", () => {
  assert.match(homePage, /HomeEditShell/);
  assert.match(homePage, /<HomeEditShell \/>/);
  assert.match(homePage, /story-pin/);
});
