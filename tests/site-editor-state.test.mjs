import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

const repoRoot = path.resolve(import.meta.dirname, "..");
const cmsStorePath = path.join(repoRoot, "src", "lib", "cms-store.ts");
const homePagePath = path.join(repoRoot, "src", "app", "page.tsx");
const homeEditShellPath = path.join(repoRoot, "src", "components", "site-editor", "HomeEditShell.tsx");

function loadCmsStore({ localStorage } = {}) {
  const source = fs.readFileSync(cmsStorePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: cmsStorePath
  });

  const module = { exports: {} };
  const sandbox = {
    CustomEvent: class CustomEvent {},
    URL,
    exports: module.exports,
    module,
    window: localStorage
      ? {
          dispatchEvent() {},
          localStorage
        }
      : undefined,
    require: (id) => {
      if (id === "react") {
        return {
          useEffect() {},
          useState(initialValue) {
            return [typeof initialValue === "function" ? initialValue() : initialValue, () => {}];
          }
        };
      }
      if (id === "@/lib/radar-data") {
        return {
          credibilityRules: [],
          robotCompanies: [],
          sourceTypeLabels: {}
        };
      }
      throw new Error(`Unexpected cms-store import: ${id}`);
    }
  };

  vm.runInNewContext(compiled.outputText, sandbox, { filename: cmsStorePath });
  return module.exports;
}

function createLocalStorage(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    snapshot() {
      return Object.fromEntries(store);
    }
  };
}

test("home editor normalizes unsafe button hrefs from untrusted localStorage", () => {
  const { normalizeHomeEditorState } = loadCmsStore();
  const dangerousHrefs = [
    "javascript:alert(1)",
    "data:text/html,<h1>x</h1>",
    "vbscript:msgbox(1)",
    "//example.com/path",
    "/\\evil",
    "\\\\example.com\\share",
    "http:\\\\example.com\\x",
    "/safe\u0000path"
  ];

  for (const href of dangerousHrefs) {
    const state = normalizeHomeEditorState({
      pageType: "free",
      modules: [{ id: "button-1", type: "button", text: "Open", href }]
    });

    assert.equal(state.modules[0].href, "/");
  }
});

test("home editor restores only normalized modules from localStorage", () => {
  const localStorage = createLocalStorage({
    "chain-radar-home-editor-state-v1": JSON.stringify({
      pageType: "free",
      modules: [
        { id: "text-1", type: "text", text: "Saved text" },
        { id: "button-1", type: "button", text: "Unsafe", href: "javascript:alert(1)" },
        { id: "button-2", type: "button", text: "Safe", href: "/sector/robotics" },
        { id: "bad-1", type: "unknown", text: "Drop me" }
      ]
    })
  });
  const { getHomeEditorState } = loadCmsStore({ localStorage });

  const restored = getHomeEditorState();

  assert.equal(restored.pageId, "home");
  assert.equal(restored.pageType, "free");
  assert.equal(
    JSON.stringify(restored.modules.map((module) => [module.id, module.type, module.type === "button" ? module.href : undefined])),
    JSON.stringify([
      ["text-1", "text", undefined],
      ["button-1", "button", "/"],
      ["button-2", "button", "/sector/robotics"]
    ])
  );
});

test("home editor saves and restores editable text module properties", () => {
  const { normalizeHomeEditorState } = loadCmsStore();

  const state = normalizeHomeEditorState({
    pageType: "flow",
    modules: [
      {
        id: "text-rich",
        type: "text",
        text: "Editable headline",
        align: "center",
        size: "large",
        background: "transparent",
        position: { x: 24, y: -12 }
      }
    ]
  });

  assert.equal(JSON.stringify(state.modules[0]), JSON.stringify({
    id: "text-rich",
    type: "text",
    text: "Editable headline",
    align: "center",
    size: "large",
    background: "transparent",
    position: { x: 24, y: -12 }
  }));
});

test("home editor restores button label and safe href while rejecting unsafe hrefs", () => {
  const { normalizeHomeEditorState } = loadCmsStore();

  const state = normalizeHomeEditorState({
    modules: [
      { id: "safe-button", type: "button", label: "Open robotics", href: "/sector/robotics" },
      { id: "unsafe-button", type: "button", text: "Legacy label", href: "data:text/html,<h1>x</h1>" }
    ]
  });

  assert.equal(JSON.stringify(state.modules), JSON.stringify([
    { id: "safe-button", type: "button", label: "Open robotics", href: "/sector/robotics", position: { x: 0, y: 0 } },
    { id: "unsafe-button", type: "button", label: "Legacy label", href: "/", position: { x: 0, y: 0 } }
  ]));
});

test("home editor saves and restores text link modules with safe hrefs", () => {
  const { normalizeHomeEditorState } = loadCmsStore();

  const state = normalizeHomeEditorState({
    modules: [
      { id: "safe-link", type: "link", text: "Robot page", href: "/sector/robotics", position: { x: -8, y: 16 } },
      { id: "unsafe-link", type: "link", label: "Bad link", href: "javascript:alert(1)" }
    ]
  });

  assert.equal(JSON.stringify(state.modules), JSON.stringify([
    { id: "safe-link", type: "link", text: "Robot page", href: "/sector/robotics", position: { x: -8, y: 16 } },
    { id: "unsafe-link", type: "link", text: "Bad link", href: "/", position: { x: 0, y: 0 } }
  ]));
});

test("home editor keeps legacy Phase 1A state compatible", () => {
  const { normalizeHomeEditorState } = loadCmsStore();

  const state = normalizeHomeEditorState({
    pageType: "free",
    modules: [
      { id: "old-text", type: "text", text: "Old text" },
      { id: "old-button", type: "button", text: "Old button", href: "/sector/robotics" },
      { id: "old-decoration", type: "decoration", label: "Old decor" }
    ]
  });

  assert.equal(JSON.stringify(state.modules), JSON.stringify([
    {
      id: "old-text",
      type: "text",
      text: "Old text",
      align: "left",
      size: "medium",
      background: "transparent",
      position: { x: 0, y: 0 }
    },
    { id: "old-button", type: "button", label: "Old button", href: "/sector/robotics", position: { x: 0, y: 0 } },
    { id: "old-decoration", type: "decoration", label: "Old decor", position: { x: 0, y: 0 } }
  ]));
});

test("home editor save handles localStorage write failures without throwing", () => {
  const localStorage = {
    setItem() {
      throw new Error("quota exceeded");
    }
  };
  const { saveHomeEditorState } = loadCmsStore({ localStorage });

  let result;
  assert.doesNotThrow(() => {
    result = saveHomeEditorState({
      pageId: "home",
      pageType: "flow",
      modules: [{ id: "button-1", type: "button", text: "Unsafe", href: "javascript:alert(1)" }]
    });
  });
  assert.equal(result, false);
});

test("home page keeps the original animation mount and only adds the edit shell", () => {
  const homePage = fs.readFileSync(homePagePath, "utf8");

  assert.match(homePage, /useGSAP/);
  assert.match(homePage, /scrollTrigger/);
  assert.match(homePage, /className="story-pin/);
  assert.match(homePage, /<HomeEditShell \/>/);
});

test("home edit shell does not render saved module overlay until edit mode is active", () => {
  const homeEditShell = fs.readFileSync(homeEditShellPath, "utf8");

  assert.match(homeEditShell, /isEditing && state\.modules\.length > 0/);
  assert.ok(homeEditShell.indexOf("isEditing && state.modules.length > 0") < homeEditShell.indexOf("fixed inset-x-4 bottom-24"));
});

test("home edit shell keeps the inspector usable on narrow screens", () => {
  const homeEditShell = fs.readFileSync(homeEditShellPath, "utf8");

  assert.match(homeEditShell, /right-4 top-4[\s\S]*md:bottom-4[\s\S]*md:right-auto[\s\S]*md:w-\[min\(320px,calc\(100vw-2rem\)\)\]/);
  assert.match(homeEditShell, /left-4 right-4 top-\[calc\(30vh\+2rem\)\][\s\S]*bottom-4[\s\S]*overflow-y-auto[\s\S]*md:left-\[calc\(min\(320px,calc\(100vw-2rem\)\)\+2rem\)\]/);
});
