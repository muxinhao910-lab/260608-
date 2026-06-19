import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const cmsStore = fs.readFileSync(path.join(repoRoot, "src", "lib", "cms-store.ts"), "utf8");
const editor = fs.readFileSync(path.join(repoRoot, "src", "components", "admin", "PageBuilderEditor.tsx"), "utf8");
const homePage = fs.readFileSync(path.join(repoRoot, "src", "app", "page.tsx"), "utf8");

test("builder keeps draft storage separate from published home storage", () => {
  assert.match(cmsStore, /PAGE_BUILDER_BLOCKS_KEY\s*=\s*"chain-radar-page-builder-blocks-v1"/);
  assert.match(cmsStore, /PUBLISHED_HOME_BLOCKS_KEY\s*=\s*"chain-radar-home-published-blocks-v1"/);
  assert.match(cmsStore, /getPublishedHomeBlocks/);
  assert.match(cmsStore, /publishHomeBlocks/);
  assert.match(cmsStore, /savePageBuilderBlocks/);
  assert.match(cmsStore, /resetPageBuilderBlocks/);
});

test("builder exposes a publish-to-home action without replacing draft reset", () => {
  assert.match(editor, /publishHomeBlocks/);
  assert.match(editor, /function publishBlocks/);
  assert.match(editor, /onClick=\{publishBlocks\}/);
  assert.match(editor, />发布到首页</);
  assert.match(editor, /onClick=\{saveBlocks\}/);
  assert.match(editor, /onClick=\{resetBlocks\}/);
});

test("home page renders published builder blocks only from the published store", () => {
  assert.match(homePage, /getPublishedHomeBlocks/);
  assert.match(homePage, /PublishedHomeBlocks/);
  assert.match(homePage, /publishedBlocks/);
  assert.doesNotMatch(homePage, /getPageBuilderBlocks/);
  assert.doesNotMatch(homePage, /PAGE_BUILDER_BLOCKS_KEY/);
});
