import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
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

function createTestAdminSession(secret) {
  const issuedAt = String(Date.now());
  const nonce = "test-nonce";
  const payload = `${issuedAt}.${nonce}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function loadBuilderPage({ sessionValue, env = {} } = {}) {
  const source = fs.readFileSync(builderPagePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: builderPagePath
  });

  const module = { exports: {} };
  const sandbox = {
    Buffer,
    exports: module.exports,
    module,
    process: { env },
    require: (id) => {
      if (id === "node:crypto") {
        return { createHmac, timingSafeEqual: (left, right) => left.equals(right) };
      }
      if (id === "next/headers") {
        return {
          async cookies() {
            return {
              get(name) {
                return name === "chain-radar-admin-session" && sessionValue ? { value: sessionValue } : undefined;
              }
            };
          }
        };
      }
      if (id === "next/navigation") {
        return {
          redirect(target) {
            const error = new Error(`redirect:${target}`);
            error.target = target;
            throw error;
          }
        };
      }
      if (id === "@/components/admin/PageBuilderEditor") {
        return {
          PageBuilderEditor() {
            return "page-builder-editor-rendered";
          }
        };
      }
      if (id === "react/jsx-runtime") {
        return {
          jsx(type) {
            return { type };
          }
        };
      }
      throw new Error(`Unexpected builder page import: ${id}`);
    }
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: builderPagePath });
  return module.exports.default;
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

test("admin builder page redirects without the signed server session cookie", async () => {
  const AdminBuilderPage = loadBuilderPage({ env: { CHAIN_RADAR_ADMIN_SESSION_SECRET: "test-secret" } });

  await assert.rejects(() => AdminBuilderPage(), { target: "/admin/login" });
});

test("admin builder page renders only with a valid signed server session cookie", async () => {
  const secret = "test-secret";
  const AdminBuilderPage = loadBuilderPage({
    env: { CHAIN_RADAR_ADMIN_SESSION_SECRET: secret },
    sessionValue: createTestAdminSession(secret)
  });

  const rendered = await AdminBuilderPage();

  assert.equal(rendered.type(), "page-builder-editor-rendered");
});
