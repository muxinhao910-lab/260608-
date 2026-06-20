"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createHomeEditorModule,
  defaultHomeEditorState,
  getHomeEditorState,
  normalizeHomeEditorState,
  saveHomeEditorState,
  type HomeEditorBackground,
  type HomeEditorModule,
  type HomeEditorModuleType,
  type HomeEditorState,
  type HomeEditorTextAlign,
  type HomeEditorTextSize
} from "@/lib/cms-store";

const moduleLabels: Record<HomeEditorModuleType, string> = {
  text: "Text",
  button: "Button",
  link: "Text link",
  decoration: "Decoration"
};

const activeTools: Array<{ type: HomeEditorModuleType; icon: string; title: string; description: string }> = [
  { type: "text", icon: "T", title: "Text block", description: "Edit copy, size, align, background" },
  { type: "button", icon: "B", title: "Button block", description: "Set button label and safe href" },
  { type: "link", icon: "L", title: "Text link", description: "Set link copy and destination" }
];

const futureTools = [
  { icon: "I", title: "Image / background", description: "Future image block" },
  { icon: "V", title: "Video / motion", description: "Future media background" },
  { icon: "N", title: "Top navigation", description: "Future nav module" },
  { icon: "S", title: "Search module", description: "Future site search" }
];

const panelClass = "border border-white/15 bg-[#050505]/95 text-white shadow-[0_0_80px_rgba(0,0,0,.32)]";
const toolbarButtonClass = "border border-white/15 bg-white/[.05] px-3 py-2 text-left font-mono text-[11px] uppercase tracking-normal text-white transition hover:border-[#f36b21] hover:text-[#f36b21]";
const primaryToolbarButtonClass = "border border-[#f36b21] bg-[#f36b21] px-3 py-2 text-left font-mono text-[11px] uppercase tracking-normal text-black transition hover:bg-white active:translate-y-[1px]";
const inputClass = "w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-[#f36b21]";

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
    setMessage(`${moduleLabels[type]} added`);
  }

  function updateSelectedModule(patch: Record<string, unknown>) {
    if (!selectedModule) {
      return;
    }
    setState((current) => ({
      ...current,
      modules: current.modules.map((module) => (module.id === selectedModule.id ? ({ ...module, ...patch } as HomeEditorModule) : module))
    }));
  }

  function moveSelectedModule(deltaX: number, deltaY: number) {
    if (!selectedModule) {
      return;
    }
    updateSelectedModule({
      position: {
        x: selectedModule.position.x + deltaX,
        y: selectedModule.position.y + deltaY
      }
    });
  }

  function deleteSelectedModule() {
    if (!selectedModule) {
      setMessage("Select a module first");
      return;
    }

    setState((current) => {
      const nextModules = current.modules.filter((module) => module.id !== selectedModule.id);
      setSelectedId(nextModules[0]?.id ?? "");
      return { ...current, modules: nextModules };
    });
    setMessage("Selected module removed. Save to keep this after refresh.");
  }

  function save() {
    if (saveHomeEditorState(state)) {
      setState(normalizeHomeEditorState(state));
      setMessage("Saved locally. Refresh will keep these modules.");
      return;
    }
    setMessage("Save failed. Check browser localStorage permissions.");
  }

  function visitSelectedHref() {
    if (!selectedModule || (selectedModule.type !== "button" && selectedModule.type !== "link")) {
      return;
    }
    const normalized = normalizeHomeEditorState({ pageId: "home", pageType: state.pageType, modules: [selectedModule] });
    const safeModule = normalized.modules[0];
    if (safeModule && (safeModule.type === "button" || safeModule.type === "link")) {
      window.location.assign(safeModule.href);
    }
  }

  return (
    <>
      {isEditing ? (
        <div className="pointer-events-none fixed inset-0 z-[95]">
          <aside className={`pointer-events-auto fixed left-4 right-4 top-4 z-[100] max-h-[30vh] overflow-y-auto p-3 md:bottom-4 md:right-auto md:w-[min(320px,calc(100vw-2rem))] md:p-4 ${panelClass}`}>
            <div className="mb-4 border-b border-white/10 pb-3 md:mb-5 md:pb-4">
              <p className="font-mono text-[11px] uppercase tracking-normal text-[#f36b21]">Home Editor / {state.pageType}</p>
              <h2 className="mt-1 font-serif text-2xl font-black leading-none md:text-3xl">Edit mode</h2>
            </div>

            <div className="grid gap-2 md:gap-3">
              {activeTools.map((tool) => (
                <button className="group grid grid-cols-[40px_1fr] gap-3 border border-white/15 bg-white/[.04] p-3 text-left transition hover:border-[#f36b21] hover:bg-[#f36b21]/10 md:grid-cols-[44px_1fr]" key={tool.type} onClick={() => addModule(tool.type)} type="button">
                  <span className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black font-serif text-lg font-black text-[#f36b21] group-hover:bg-[#f36b21] group-hover:text-black md:h-11 md:w-11 md:text-xl">{tool.icon}</span>
                  <span>
                    <strong className="block text-sm">{tool.title}</strong>
                    <span className="mt-1 block text-xs leading-snug text-white/55">{tool.description}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 md:mt-5 md:pt-4">
              {futureTools.map((tool) => (
                <button className="grid cursor-not-allowed grid-cols-[34px_1fr] gap-3 border border-white/10 bg-white/[.02] p-3 text-left opacity-45 md:grid-cols-[36px_1fr]" disabled key={tool.title} type="button">
                  <span className="flex h-8 w-8 items-center justify-center border border-white/15 font-mono text-xs md:h-9 md:w-9 md:text-sm">{tool.icon}</span>
                  <span>
                    <strong className="block text-xs">{tool.title}</strong>
                    <span className="mt-1 block text-[11px] leading-snug text-white/50">{tool.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <section className={`pointer-events-auto fixed left-4 right-4 top-[calc(30vh+2rem)] bottom-4 z-[100] min-h-[96px] overflow-y-auto p-4 md:bottom-auto md:left-[calc(min(320px,calc(100vw-2rem))+2rem)] md:top-4 ${panelClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-normal text-[#f36b21]">Selected module</p>
                <h3 className="mt-1 text-lg font-semibold">{selectedModule ? moduleLabels[selectedModule.type] : "No module selected"}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={toolbarButtonClass} onClick={deleteSelectedModule} type="button">Delete</button>
                <button className={primaryToolbarButtonClass} onClick={save} type="button">Save</button>
                <button className={toolbarButtonClass} onClick={() => setIsEditing(false)} type="button">Exit</button>
              </div>
            </div>

            {selectedModule ? (
              <ModuleInspector module={selectedModule} moveModule={moveSelectedModule} updateModule={updateSelectedModule} visitHref={visitSelectedHref} />
            ) : (
              <p className="mt-3 text-sm text-white/55">Add a module from the tool panel, then edit its properties here.</p>
            )}

            {message ? <p className="mt-4 border border-[#f36b21]/60 bg-[#f36b21]/10 p-3 text-sm text-[#f36b21]">{message}</p> : null}
          </section>

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
                    onClick={(event) => {
                      event.preventDefault();
                      setSelectedId(module.id);
                      setIsEditing(true);
                    }}
                    style={{ transform: `translate(${module.position.x}px, ${module.position.y}px)` }}
                    type="button"
                  >
                    <span className="mb-2 block font-mono text-[11px] uppercase tracking-normal opacity-70">{moduleLabels[module.type]}</span>
                    <HomeEditorModulePreview module={module} />
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <button
          className="fixed bottom-5 right-5 z-[100] border border-[#f36b21] bg-[#f36b21] px-5 py-3 font-mono text-xs uppercase tracking-normal text-black shadow-[0_0_40px_rgba(243,107,33,.35)] transition hover:bg-white active:translate-y-[1px]"
          onClick={() => setIsEditing(true)}
          type="button"
        >
          Edit page
        </button>
      )}
    </>
  );
}

function ModuleInspector({
  module,
  moveModule,
  updateModule,
  visitHref
}: {
  module: HomeEditorModule;
  moveModule: (deltaX: number, deltaY: number) => void;
  updateModule: (patch: Record<string, unknown>) => void;
  visitHref: () => void;
}) {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
      <div className="grid gap-3">
        {module.type === "text" ? (
          <>
            <label className="grid gap-1 text-xs text-white/60">
              Content
              <textarea className={`${inputClass} min-h-16 resize-y`} onChange={(event) => updateModule({ text: event.target.value })} value={module.text} />
            </label>
            <SegmentedControl<HomeEditorTextSize> label="Size" options={[["large", "Large"], ["medium", "Medium"], ["small", "Small"]]} value={module.size} onChange={(value) => updateModule({ size: value })} />
            <SegmentedControl<HomeEditorTextAlign> label="Align" options={[["left", "Left"], ["center", "Center"], ["right", "Right"]]} value={module.align} onChange={(value) => updateModule({ align: value })} />
            <SegmentedControl<HomeEditorBackground> label="Background" options={[["transparent", "Transparent"], ["white", "White"], ["black", "Black"], ["orange", "Orange"]]} value={module.background} onChange={(value) => updateModule({ background: value })} />
          </>
        ) : null}

        {module.type === "button" ? (
          <>
            <label className="grid gap-1 text-xs text-white/60">
              Button label
              <input className={inputClass} onChange={(event) => updateModule({ label: event.target.value })} value={module.label} />
            </label>
            <HrefField href={module.href} updateModule={updateModule} visitHref={visitHref} />
          </>
        ) : null}

        {module.type === "link" ? (
          <>
            <label className="grid gap-1 text-xs text-white/60">
              Link text
              <input className={inputClass} onChange={(event) => updateModule({ text: event.target.value })} value={module.text} />
            </label>
            <HrefField href={module.href} updateModule={updateModule} visitHref={visitHref} />
          </>
        ) : null}

        {module.type === "decoration" ? (
          <label className="grid gap-1 text-xs text-white/60">
            Label
            <input className={inputClass} onChange={(event) => updateModule({ label: event.target.value })} value={module.label} />
          </label>
        ) : null}
      </div>

      <PositionNudge moveModule={moveModule} x={module.position.x} y={module.position.y} />
    </div>
  );
}

function HrefField({ href, updateModule, visitHref }: { href: string; updateModule: (patch: Record<string, unknown>) => void; visitHref: () => void }) {
  return (
    <div className="grid gap-2">
      <label className="grid gap-1 text-xs text-white/60">
        Safe href
        <input className={inputClass} onChange={(event) => updateModule({ href: event.target.value })} value={href} />
      </label>
      <button className="w-fit border border-white/15 px-3 py-2 font-mono text-[11px] uppercase tracking-normal text-white transition hover:border-[#f36b21] hover:text-[#f36b21]" onClick={visitHref} type="button">
        Visit href
      </button>
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: T) => void;
  options: Array<[T, string]>;
  value: T;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-white/60">{label}</p>
      <div className="flex flex-wrap gap-1">
        {options.map(([option, text]) => (
          <button className={`border px-3 py-2 text-xs transition ${value === option ? "border-[#f36b21] bg-[#f36b21] text-black" : "border-white/15 bg-white/[.04] text-white hover:border-[#f36b21]"}`} key={option} onClick={() => onChange(option)} type="button">
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function PositionNudge({ moveModule, x, y }: { moveModule: (deltaX: number, deltaY: number) => void; x: number; y: number }) {
  return (
    <div className="min-w-[150px]">
      <p className="mb-2 text-xs text-white/60">Position</p>
      <div className="grid grid-cols-3 gap-1">
        <span />
        <button className={toolbarButtonClass} onClick={() => moveModule(0, -8)} type="button">Up</button>
        <span />
        <button className={toolbarButtonClass} onClick={() => moveModule(-8, 0)} type="button">Left</button>
        <div className="border border-white/10 bg-white/[.03] p-2 text-center font-mono text-[10px] text-white/60">
          x {x}<br />y {y}
        </div>
        <button className={toolbarButtonClass} onClick={() => moveModule(8, 0)} type="button">Right</button>
        <span />
        <button className={toolbarButtonClass} onClick={() => moveModule(0, 8)} type="button">Down</button>
        <span />
      </div>
    </div>
  );
}

function HomeEditorModulePreview({ module }: { module: HomeEditorModule }) {
  switch (module.type) {
    case "text":
      return <p className={`${textSizeClass(module.size)} ${textAlignClass(module.align)} ${backgroundClass(module.background)} font-semibold`}>{module.text}</p>;
    case "button":
      return <span className="inline-flex border border-current bg-[#f36b21] px-4 py-2 font-mono text-xs uppercase tracking-normal text-black transition hover:bg-white active:translate-y-[1px]">{module.label} -&gt; {module.href}</span>;
    case "link":
      return <span className="inline-flex font-mono text-sm uppercase tracking-normal underline decoration-[#f36b21] decoration-2 underline-offset-4">{module.text} -&gt; {module.href}</span>;
    case "decoration":
      return (
        <span className="block h-10 w-full bg-[repeating-linear-gradient(135deg,currentColor_0_8px,transparent_8px_16px)] opacity-75">
          <span className="sr-only">{module.label}</span>
        </span>
      );
  }
}

function textSizeClass(size: HomeEditorTextSize) {
  if (size === "large") return "text-3xl";
  if (size === "small") return "text-base";
  return "text-xl";
}

function textAlignClass(align: HomeEditorTextAlign) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function backgroundClass(background: HomeEditorBackground) {
  if (background === "white") return "bg-white px-3 py-2 text-black";
  if (background === "black") return "bg-black px-3 py-2 text-white";
  if (background === "orange") return "bg-[#f36b21] px-3 py-2 text-black";
  return "bg-transparent";
}