"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type AnnotationKind = "rect" | "circle" | "pin";

type ElementInfo = {
  tag: string;
  id: string;
  className: string;
  ariaLabel: string;
  dataReviewId: string;
  dataReviewPage: string;
  dataComponent: string;
  href: string;
  nearestLandmark: string;
  nearText: string;
};

type PageInfo = {
  pathname: string;
  search: string;
  hash: string;
  path: string;
  url: string;
  title: string;
};

type Annotation = {
  id: string;
  kind: AnnotationKind;
  pageX: number;
  pageY: number;
  width: number;
  height: number;
  note: string;
  scrollXAtCreate: number;
  scrollYAtCreate: number;
  viewportWidth: number;
  viewportHeight: number;
  createdViewportX: number;
  createdViewportY: number;
  pathname: string;
  search: string;
  hash: string;
  path: string;
  url: string;
  title: string;
  element: ElementInfo;
};

type Draft = {
  kind: AnnotationKind;
  startPageX: number;
  startPageY: number;
  pageX: number;
  pageY: number;
  width: number;
  height: number;
};

const STORAGE_PREFIX = "design-review:";
const LEGACY_STORAGE_KEY = "muxinbai-design-review-annotations";

function emptyElementInfo(): ElementInfo {
  return {
    tag: "",
    id: "",
    className: "",
    ariaLabel: "",
    dataReviewId: "",
    dataReviewPage: "",
    dataComponent: "",
    href: "",
    nearestLandmark: "",
    nearText: ""
  };
}

function truncateText(text: string, length = 80) {
  return text.replace(/\s+/g, " ").trim().slice(0, length);
}

function pageStorageKey(path: string) {
  return `${STORAGE_PREFIX}${path || "/"}`;
}

function listReviewKeys() {
  return Object.keys(window.localStorage).filter((key) => key.startsWith(STORAGE_PREFIX));
}

export function DesignReviewOverlay() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [hash, setHash] = useState("");
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<AnnotationKind>("rect");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [documentSize, setDocumentSize] = useState({ width: 0, height: 0 });
  const layerRef = useRef<HTMLDivElement>(null);

  const pageInfo = useMemo<PageInfo>(() => {
    if (!mounted || typeof window === "undefined") {
      return {
        pathname,
        search: search ? `?${search}` : "",
        hash,
        path: `${pathname}${search ? `?${search}` : ""}${hash}`,
        url: "",
        title: ""
      };
    }

    return {
      pathname,
      search: window.location.search,
      hash,
      path: `${pathname}${window.location.search}${window.location.hash}`,
      url: window.location.href,
      title: document.title
    };
  }, [hash, mounted, pathname, search]);

  const storageKey = useMemo(() => pageStorageKey(pageInfo.path), [pageInfo.path]);

  const updateDocumentSize = useCallback(() => {
    if (typeof document === "undefined") {
      return;
    }
    const element = document.documentElement;
    setDocumentSize({
      width: Math.max(element.scrollWidth, element.clientWidth),
      height: Math.max(element.scrollHeight, element.clientHeight)
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    setHash(window.location.hash);
    updateDocumentSize();
  }, [updateDocumentSize]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      setAnnotations(raw ? JSON.parse(raw) : []);
      setSelectedId("");
      setDraft(null);
    } catch {
      setAnnotations([]);
    }
  }, [mounted, storageKey]);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(annotations));
  }, [annotations, mounted, storageKey]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const onResizeOrScroll = () => updateDocumentSize();
    window.addEventListener("resize", onResizeOrScroll);
    window.addEventListener("scroll", onResizeOrScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResizeOrScroll);
      window.removeEventListener("scroll", onResizeOrScroll);
    };
  }, [mounted, updateDocumentSize]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.altKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setActive((value) => !value);
        updateDocumentSize();
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
  }, [selectedId, updateDocumentSize]);

  if (!mounted || process.env.NODE_ENV === "production") {
    return null;
  }

  function viewportSnapshot() {
    return {
      scrollXAtCreate: Math.round(window.scrollX),
      scrollYAtCreate: Math.round(window.scrollY),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  }

  function findTargetElement(clientX: number, clientY: number) {
    const elements = document.elementsFromPoint(clientX, clientY);
    return (
      elements.find((element) => {
        const htmlElement = element as HTMLElement;
        return !htmlElement.closest(".design-review-panel, .design-review-toggle, .design-review-layer, .design-annotation");
      }) || null
    );
  }

  function getElementInfo(clientX: number, clientY: number): ElementInfo {
    const target = findTargetElement(clientX, clientY) as HTMLElement | null;
    if (!target) {
      return emptyElementInfo();
    }

    const landmark = target.closest<HTMLElement>("[data-review-id], [data-review-page], section, main, article, aside, header, footer");
    const link = target.closest<HTMLAnchorElement>("a[href]");
    const className = typeof target.className === "string" ? target.className : "";

    return {
      tag: target.tagName.toLowerCase(),
      id: target.id || "",
      className: truncateText(className, 120),
      ariaLabel: target.getAttribute("aria-label") || "",
      dataReviewId: target.getAttribute("data-review-id") || landmark?.getAttribute("data-review-id") || "",
      dataReviewPage: target.getAttribute("data-review-page") || landmark?.getAttribute("data-review-page") || "",
      dataComponent: target.getAttribute("data-component") || landmark?.getAttribute("data-component") || "",
      href: link?.href || "",
      nearestLandmark: landmark
        ? [
            landmark.tagName.toLowerCase(),
            landmark.getAttribute("data-review-page") ? `data-review-page=${landmark.getAttribute("data-review-page")}` : "",
            landmark.getAttribute("data-review-id") ? `data-review-id=${landmark.getAttribute("data-review-id")}` : "",
            landmark.id ? `id=${landmark.id}` : ""
          ]
            .filter(Boolean)
            .join(" ")
        : "",
      nearText: truncateText(target.textContent || landmark?.textContent || "")
    };
  }

  function createAnnotation(
    kind: AnnotationKind,
    pageX: number,
    pageY: number,
    width: number,
    height: number,
    note: string,
    clientX: number,
    clientY: number
  ) {
    const snapshot = viewportSnapshot();
    const annotation: Annotation = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind,
      pageX: Math.round(pageX),
      pageY: Math.round(pageY),
      width: Math.round(width),
      height: Math.round(height),
      note,
      createdViewportX: Math.round(clientX),
      createdViewportY: Math.round(clientY),
      ...snapshot,
      ...pageInfo,
      element: getElementInfo(clientX, clientY)
    };
    setAnnotations((items) => [...items, annotation]);
    setSelectedId(annotation.id);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!active || event.button !== 0 || event.target !== layerRef.current) {
      return;
    }

    const pageX = event.clientX + window.scrollX;
    const pageY = event.clientY + window.scrollY;

    if (mode === "pin") {
      const note = window.prompt("这处有什么问题？", "");
      if (note === null) {
        return;
      }
      createAnnotation("pin", pageX, pageY, 0, 0, note.trim(), event.clientX, event.clientY);
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    setDraft({
      kind: mode,
      startPageX: pageX,
      startPageY: pageY,
      pageX,
      pageY,
      width: 0,
      height: 0
    });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draft) {
      return;
    }

    const currentPageX = event.clientX + window.scrollX;
    const currentPageY = event.clientY + window.scrollY;
    const pageX = Math.min(draft.startPageX, currentPageX);
    const pageY = Math.min(draft.startPageY, currentPageY);
    const width = Math.abs(currentPageX - draft.startPageX);
    const height = Math.abs(currentPageY - draft.startPageY);
    setDraft({ ...draft, pageX, pageY, width, height });
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

    const centerClientX = finalDraft.pageX + finalDraft.width / 2 - window.scrollX;
    const centerClientY = finalDraft.pageY + finalDraft.height / 2 - window.scrollY;
    createAnnotation(finalDraft.kind, finalDraft.pageX, finalDraft.pageY, finalDraft.width, finalDraft.height, note.trim(), centerClientX, centerClientY);
  }

  function annotationLines(item: Annotation, index: number) {
    const viewportX = item.pageX - item.scrollXAtCreate;
    const viewportY = item.pageY - item.scrollYAtCreate;
    return [
      `【标注 ${index + 1}】`,
      `类型：${item.kind}`,
      `页面坐标：x=${item.pageX}, y=${item.pageY}, w=${item.width}, h=${item.height}`,
      `视口坐标：x=${viewportX}, y=${viewportY}, w=${item.width}, h=${item.height}`,
      `标注时滚动：scrollX=${item.scrollXAtCreate}, scrollY=${item.scrollYAtCreate}`,
      "关联元素：",
      `tag: ${item.element.tag || "未识别"}`,
      `id: ${item.element.id || "无"}`,
      `class: ${item.element.className || "无"}`,
      `aria-label: ${item.element.ariaLabel || "无"}`,
      `data-review-page: ${item.element.dataReviewPage || "无"}`,
      `data-review-id: ${item.element.dataReviewId || "无"}`,
      `data-component: ${item.element.dataComponent || "无"}`,
      `href: ${item.element.href || "无"}`,
      `nearest: ${item.element.nearestLandmark || "无"}`,
      `nearText: ${item.element.nearText || "无"}`,
      `问题：${item.note || "未填写"}`,
      ""
    ];
  }

  function pageHeaderLines(info: PageInfo, annotationList: Annotation[]) {
    return [
      "【目标页面】",
      info.path,
      "",
      "【完整 URL】",
      info.url,
      "",
      "【页面标题】",
      info.title,
      "",
      "【视口尺寸】",
      `${window.innerWidth}x${window.innerHeight}`,
      "",
      "【当前滚动位置】",
      `scrollX=${Math.round(window.scrollX)}, scrollY=${Math.round(window.scrollY)}`,
      "",
      "【重要要求】",
      "请只修改这个页面对应的组件或路由，不要修改主页 /，除非标注目标页面就是 /。",
      "",
      ...annotationList.flatMap(annotationLines),
      "【期望】",
      "保留当前整体结构，只修改我圈选的区域，不要改动其他模块。",
      ""
    ];
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1400);
    } catch {
      setCopyState("failed");
    }
  }

  async function copyCurrentPageFeedback() {
    await copyText(pageHeaderLines(pageInfo, annotations).join("\n"));
  }

  async function copyAllPagesFeedback() {
    const lines: string[] = [];
    for (const key of listReviewKeys()) {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        continue;
      }
      const pageAnnotations = JSON.parse(raw) as Annotation[];
      if (!pageAnnotations.length) {
        continue;
      }
      const first = pageAnnotations[0];
      lines.push(...pageHeaderLines({ pathname: first.pathname, search: first.search, hash: first.hash, path: first.path, url: first.url, title: first.title }, pageAnnotations));
      lines.push("---", "");
    }
    await copyText(lines.join("\n"));
  }

  function clearCurrentPage() {
    const ok = window.confirm(`删除当前页面标注？\n${pageInfo.path}`);
    if (!ok) {
      return;
    }
    window.localStorage.removeItem(storageKey);
    setAnnotations([]);
    setSelectedId("");
  }

  function clearAllPages() {
    const ok = window.confirm("确认删除全部页面的标注？这个操作会清空所有 design-review:* 数据。");
    if (!ok) {
      return;
    }
    listReviewKeys().forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    setAnnotations([]);
    setSelectedId("");
  }

  return (
    <>
      <button className="design-review-toggle" type="button" onClick={() => setActive((value) => !value)}>
        标注反馈
      </button>

      {active ? (
        <div className="design-review-panel" aria-label="设计标注工具">
          <p className="design-review-current-page">当前页面：{pageInfo.path}</p>
          <div className="design-review-panel-row">
            {(["rect", "circle", "pin"] as AnnotationKind[]).map((item) => (
              <button className={mode === item ? "is-active" : ""} key={item} type="button" onClick={() => setMode(item)}>
                {item === "rect" ? "矩形" : item === "circle" ? "圆圈" : "Pin"}
              </button>
            ))}
          </div>
          <div className="design-review-panel-row">
            <button type="button" onClick={copyCurrentPageFeedback}>
              {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制当前页面反馈"}
            </button>
            <button type="button" onClick={copyAllPagesFeedback}>
              复制全部页面反馈
            </button>
          </div>
          <div className="design-review-panel-row">
            <button type="button" onClick={clearCurrentPage}>
              清除当前页面标注
            </button>
            <button type="button" onClick={clearAllPages}>
              清除全部页面标注
            </button>
            <button type="button" onClick={() => setActive(false)}>
              退出
            </button>
          </div>
          <p>Alt + A 开关，Esc 退出，Delete 删除选中标注。标注使用页面坐标，滚动时会贴住原内容。</p>
        </div>
      ) : null}

      {active ? (
        <div
          className="design-review-layer"
          ref={layerRef}
          style={{ width: documentSize.width, height: documentSize.height }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {annotations.map((item, index) => (
            <button
              className={`design-annotation design-annotation-${item.kind} ${selectedId === item.id ? "is-selected" : ""}`}
              key={item.id}
              style={{
                left: item.kind === "pin" ? item.pageX - 14 : item.pageX,
                top: item.kind === "pin" ? item.pageY - 14 : item.pageY,
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
              style={{ left: draft.pageX, top: draft.pageY, width: draft.width, height: draft.height }}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}
