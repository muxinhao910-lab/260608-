"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createHomeEditorModule,
  defaultHomeEditorState,
  getHomeEditorState,
  saveHomeEditorState,
  type HomeEditorModule,
  type HomeEditorModuleType,
  type HomeEditorState
} from "@/lib/cms-store";

const moduleLabels: Record<HomeEditorModuleType, string> = {
  text: "文字",
  button: "按钮",
  decoration: "装饰块"
};

const toolbarButtonClass = "border border-white/20 bg-white/[.06] px-3 py-2 text-left font-mono text-[11px] uppercase tracking-normal text-white hover:border-[#f36b21] hover:text-[#f36b21]";
const primaryToolbarButtonClass = "border border-[#f36b21] bg-[#f36b21] px-3 py-2 text-left font-mono text-[11px] uppercase tracking-normal text-black hover:bg-white";

export function HomeEditShell() {
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState<HomeEditorState>(defaultHomeEditorState);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = getHomeEditorState();
    setState(stored);
    setSelectedId(stored.modules[0]?.id ?? "");
  }, []);

  const selectedModule = useMemo(
    () => state.modules.find((module) => module.id === selectedId) ?? null,
    [selectedId, state.modules]
  );

  function addModule(type: HomeEditorModuleType) {
    const module = createHomeEditorModule(type);
    setState((current) => ({ ...current, modules: [...current.modules, module] }));
    setSelectedId(module.id);
    setIsEditing(true);
    setMessage(`${moduleLabels[type]}已添加`);
  }

  function deleteSelectedModule() {
    if (!selectedModule) {
      setMessage("请先选中模块");
      return;
    }

    setState((current) => {
      const nextModules = current.modules.filter((module) => module.id !== selectedModule.id);
      setSelectedId(nextModules[0]?.id ?? "");
      return { ...current, modules: nextModules };
    });
    setMessage("已删除选中模块，点击保存后刷新仍会保留");
  }

  function save() {
    if (saveHomeEditorState(state)) {
      setMessage("已保存到本地，刷新首页后仍会保留");
      return;
    }
    setMessage("保存失败，请检查浏览器 localStorage 权限");
  }

  return (
    <>
      {isEditing && state.modules.length > 0 ? (
        <section className="pointer-events-none fixed inset-x-4 bottom-24 z-[80] mx-auto max-w-4xl md:bottom-8">
          <div className="pointer-events-auto grid gap-3">
            {state.modules.map((module) => (
              <button
                aria-pressed={selectedId === module.id}
                className={`border p-4 text-left shadow-[8px_8px_0_rgba(17,17,17,.75)] transition ${
                  selectedId === module.id
                    ? "border-[#f36b21] bg-[#f36b21] text-black"
                    : "border-white/20 bg-black/75 text-white hover:border-[#f36b21]"
                }`}
                key={module.id}
                onClick={() => {
                  setSelectedId(module.id);
                  setIsEditing(true);
                }}
                type="button"
              >
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-normal opacity-70">{moduleLabels[module.type]}</span>
                <HomeEditorModulePreview module={module} />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {isEditing ? (
        <aside className="fixed right-4 top-4 z-[100] w-[min(390px,calc(100vw-2rem))] border border-white/20 bg-[#050505]/95 p-4 text-white shadow-[0_0_80px_rgba(243,107,33,.22)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-normal text-[#f36b21]">Home Editor / {state.pageType}</p>
              <h2 className="mt-1 font-serif text-3xl font-black leading-none">首页编辑模式</h2>
            </div>
            <button className="border border-white/20 px-3 py-2 font-mono text-xs hover:border-[#f36b21]" onClick={() => setIsEditing(false)} type="button">
              退出
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button className={toolbarButtonClass} onClick={() => addModule("text")} type="button">添加文字</button>
            <button className={toolbarButtonClass} onClick={() => addModule("button")} type="button">添加按钮</button>
            <button className={toolbarButtonClass} onClick={() => addModule("decoration")} type="button">添加装饰块</button>
          </div>

          <div className="mt-4 border border-white/15 bg-white/[.04] p-3">
            <p className="font-mono text-[11px] text-white/55">当前选中</p>
            {selectedModule ? (
              <div className="mt-2">
                <strong className="block text-sm">{moduleLabels[selectedModule.type]}</strong>
                <p className="mt-1 text-sm text-white/65">{selectedModule.id}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-white/65">暂无选中模块</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className={toolbarButtonClass} onClick={deleteSelectedModule} type="button">删除选中模块</button>
            <button className={primaryToolbarButtonClass} onClick={save} type="button">保存</button>
          </div>

          {message ? <p className="mt-4 border border-[#f36b21]/60 bg-[#f36b21]/10 p-3 text-sm text-[#f36b21]">{message}</p> : null}
        </aside>
      ) : (
        <button
          className="fixed bottom-5 right-5 z-[100] border border-[#f36b21] bg-[#f36b21] px-5 py-3 font-mono text-xs uppercase tracking-normal text-black shadow-[0_0_40px_rgba(243,107,33,.35)] hover:bg-white"
          onClick={() => setIsEditing(true)}
          type="button"
        >
          进入编辑模式
        </button>
      )}
    </>
  );
}

function HomeEditorModulePreview({ module }: { module: HomeEditorModule }) {
  switch (module.type) {
    case "text":
      return <p className="text-lg font-semibold">{module.text}</p>;
    case "button":
      return <span className="inline-flex border border-current px-4 py-2 font-mono text-xs uppercase tracking-normal">{module.text} -&gt; {module.href}</span>;
    case "decoration":
      return (
        <span className="block h-10 w-full bg-[repeating-linear-gradient(135deg,currentColor_0_8px,transparent_8px_16px)] opacity-75">
          <span className="sr-only">{module.label}</span>
        </span>
      );
  }
}
