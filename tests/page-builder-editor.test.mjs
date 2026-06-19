import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

const repoRoot = path.resolve(import.meta.dirname, "..");
const editorPath = path.join(repoRoot, "src", "components", "admin", "PageBuilderEditor.tsx");
const builderPagePath = path.join(repoRoot, "src", "app", "admin", "builder", "page.tsx");

function loadEditorExports() {
  const source = fs.readFileSync(editorPath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: editorPath
  });

  const module = { exports: {} };
  const sandbox = {
    URL,
    exports: module.exports,
    module,
    require: (id) => {
      if (id === "next/link") {
        return function Link() {
          return null;
        };
      }
      if (id === "react") {
        return {
          useEffect() {},
          useMemo(factory) {
            return factory();
          },
          useState(initialValue) {
            return [typeof initialValue === "function" ? initialValue() : initialValue, () => {}];
          }
        };
      }
      if (id === "react/jsx-runtime") {
        return {
          Fragment: Symbol.for("react.fragment"),
          jsx() {
            return {};
          },
          jsxs() {
            return {};
          }
        };
      }
      if (id === "@/lib/cms-store") {
        return {
          createPageBlock() {
            return { id: "new-block", type: "paragraph", text: "new" };
          },
          defaultPageBlocks: [{ id: "default", type: "paragraph", text: "default" }],
          getPageBuilderBlocks() {
            return [{ id: "default", type: "paragraph", text: "default" }];
          },
          resetPageBuilderBlocks() {
            return [{ id: "default", type: "paragraph", text: "default" }];
          },
          savePageBuilderBlocks() {}
        };
      }
      throw new Error(`Unexpected test import: ${id}`);
    }
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: editorPath });
  return module.exports;
}

test("builder URL validation rejects protocol-relative and unsafe href input", () => {
  const { validateBuilderHrefInput } = loadEditorExports();

  assert.equal(typeof validateBuilderHrefInput, "function");
  assert.equal(validateBuilderHrefInput("//example.com/path").ok, false);
  assert.equal(validateBuilderHrefInput("javascript:alert(1)").ok, false);
  assert.equal(validateBuilderHrefInput("data:text/html,<h1>x</h1>").ok, false);
  assert.equal(validateBuilderHrefInput("").ok, false);
  assert.equal(validateBuilderHrefInput("/sector/robotics").ok, true);
  assert.equal(validateBuilderHrefInput("https://example.com/path").ok, true);
});

test("builder save preparation keeps empty text fields and blocks invalid hrefs", () => {
  const { preparePageBuilderBlocksForSave } = loadEditorExports();

  assert.equal(typeof preparePageBuilderBlocksForSave, "function");

  const emptyCard = { id: "empty-card", type: "card", title: "", description: "" };
  const valid = preparePageBuilderBlocksForSave([
    emptyCard,
    { id: "safe-button", type: "button", text: "", href: " /sector/robotics " }
  ]);

  assert.equal(valid.ok, true);
  assert.deepEqual(valid.blocks[0], emptyCard);
  assert.equal(valid.blocks[1].href, "/sector/robotics");

  const invalid = preparePageBuilderBlocksForSave([
    emptyCard,
    { id: "bad-button", type: "button", text: "外部", href: "//example.com/path" }
  ]);

  assert.equal(invalid.ok, false);
  assert.equal(invalid.blockId, "bad-button");
});

test("admin builder page uses the approved server session guard", () => {
  const source = fs.readFileSync(builderPagePath, "utf8");

  assert.equal(source.includes('"use client"'), false);
  assert.match(source, /from "node:crypto"/);
  assert.match(source, /timingSafeEqual/);
  assert.match(source, /from "next\/headers"/);
  assert.match(source, /from "next\/navigation"/);
  assert.match(source, /chain-radar-admin-session/);
  assert.match(source, /isValidAdminSession/);
  assert.match(source, /redirect\("\/admin\/login"\)/);
  assert.match(source, /PageBuilderEditor/);
  assert.equal(source.includes('ADMIN_SESSION_VALUE = "active"'), false);
});
