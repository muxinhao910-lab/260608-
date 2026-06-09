"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type AnnotationKind = "rect" | "circle" | "pin";

type Annotation = {
  id: string;
  kind: AnnotationKind;
  x: number;
  y: number;
  width: number;
  height: number;
  note: string;
  path: string;
  scrollX: number;
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
};

type Draft = {
  kind: AnnotationKind;
  startX: number;
  startY: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const STORAGE_KEY = "muxinbai-design-review-annotations";

export function DesignReviewOverlay() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<AnnotationKind>("rect");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const layerRef = useRef<HTMLDivElement>(null);

  const visibleAnnotations = useMemo(() => {
    if (!mounted || typeof window === "undefined") {
      return [];
    }
    return annotations.filter((item) => item.path === window.location.pathname);
  }, [annotations, mounted]);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAnnotations(JSON.parse(raw));
      }
    } catch {
      setAnnotations([]);
    }
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
  }, [annotations, mounted]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setActive((value) => !value);
      }
      if (event.key === "Escape") {
        setActive(false);
        setDraft(null);
      }
      if (event.key === "Delete" && selectedId) {
        setAnnotations((items) => items.filter((item) => item.id !== selectedId));
        setSelectedId("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  if (!mounted || process.env.NODE_ENV === "production") {
    return null;
  }

  function viewportSnapshot() {
    return {
      path: window.location.pathname,
      scrollX: Math.round(window.scrollX),
      scrollY: Math.round(window.scrollY),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  }

  function createAnnotation(kind: AnnotationKind, x: number, y: number, width: number, height: number, note: string) {
    const snapshot = viewportSnapshot();
    const annotation: Annotation = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind,
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      note,
      ...snapshot
    };
    setAnnotations((items) => [...items, annotation]);
    setSelectedId(annotation.id);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!active || event.button !== 0 || event.target !== layerRef.current) {
      return;
    }

    if (mode === "pin") {
      const note = window.prompt("这处有什么问题？", "");
      if (note === null) {
        return;
      }
      createAnnotation("pin", event.clientX, event.clientY, 0, 0, note.trim());
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setDraft({
      kind: mode,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      width: 0,
      height: 0
    });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draft) {
      return;
    }

    const x = Math.min(draft.startX, event.clientX);
    const y = Math.min(draft.startY, event.clientY);
    const width = Math.abs(event.clientX - draft.startX);
    const height = Math.abs(event.clientY - draft.startY);
    setDraft({ ...draft, x, y, width, height });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draft) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    const finalDraft = draft;
    setDraft(null);

    if (finalDraft.width < 8 || finalDraft.height < 8) {
      return;
    }

    const note = window.prompt("这个圈选区域有什么问题？", "");
    if (note === null) {
      return;
    }
    createAnnotation(finalDraft.kind, finalDraft.x, finalDraft.y, finalDraft.width, finalDraft.height, note.trim());
  }

  async function copyFeedback() {
    const snapshot = viewportSnapshot();
    const lines = [
      "【页面路径】",
      snapshot.path,
      "",
      "【屏幕尺寸】",
      `${snapshot.viewportWidth}x${snapshot.viewportHeight}`,
      "",
      "【滚动位置】",
      `scrollX=${snapshot.scrollX}, scrollY=${snapshot.scrollY}`,
      ""
    ];

    visibleAnnotations.forEach((item, index) => {
      lines.push(`【标注 ${index + 1}】`);
      lines.push(`类型：${item.kind}`);
      lines.push(`位置：x=${item.x}, y=${item.y}, w=${item.width}, h=${item.height}`);
      lines.push(`标注时滚动：scrollX=${item.scrollX}, scrollY=${item.scrollY}`);
      lines.push(`问题：${item.note || "未填写"}`);
      lines.push("");
    });

    lines.push("【期望】");
    lines.push("保留当前整体结构，只修改我圈选的区域，不要改动其他模块。");

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1400);
    } catch {
      setCopyState("failed");
    }
  }

  function clearCurrentPage() {
    const ok = window.confirm("删除当前页面的全部标注？");
    if (!ok) {
      return;
    }
    const path = window.location.pathname;
    setAnnotations((items) => items.filter((item) => item.path !== path));
    setSelectedId("");
  }

  return (
    <>
      <button className="design-review-toggle" type="button" onClick={() => setActive((value) => !value)}>
        标注反馈
      </button>

      {active ? (
        <div className="design-review-panel" aria-label="设计标注工具">
          <div className="design-review-panel-row">
            {(["rect", "circle", "pin"] as AnnotationKind[]).map((item) => (
              <button
                className={mode === item ? "is-active" : ""}
                key={item}
                type="button"
                onClick={() => setMode(item)}
              >
                {item === "rect" ? "矩形" : item === "circle" ? "圆圈" : "Pin"}
              </button>
            ))}
          </div>
          <div className="design-review-panel-row">
            <button type="button" onClick={copyFeedback}>
              {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制给 Codex"}
            </button>
            <button type="button" onClick={clearCurrentPage}>
              清空本页
            </button>
            <button type="button" onClick={() => setActive(false)}>
              退出
            </button>
          </div>
          <p>Alt + A 开关，Esc 退出，Delete 删除选中标注。</p>
        </div>
      ) : null}

      {active ? (
        <div
          className="design-review-layer"
          ref={layerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {visibleAnnotations.map((item, index) => (
            <button
              className={`design-annotation design-annotation-${item.kind} ${selectedId === item.id ? "is-selected" : ""}`}
              key={item.id}
              style={{
                left: item.kind === "pin" ? item.x - 14 : item.x,
                top: item.kind === "pin" ? item.y - 14 : item.y,
                width: item.kind === "pin" ? 28 : item.width,
                height: item.kind === "pin" ? 28 : item.height
              }}
              title={item.note}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedId(item.id);
              }}
              onDoubleClick={(event) => {
                event.stopPropagation();
                const note = window.prompt("修改标注内容：", item.note);
                if (note !== null) {
                  setAnnotations((items) => items.map((entry) => (entry.id === item.id ? { ...entry, note } : entry)));
                }
              }}
            >
              <span>{index + 1}</span>
            </button>
          ))}

          {draft ? (
            <div
              className={`design-annotation design-annotation-${draft.kind} is-draft`}
              style={{ left: draft.x, top: draft.y, width: draft.width, height: draft.height }}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}
