"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BuilderElement, BuilderElementLayout, BuilderPage, BuilderPages, WebBuilderElementType } from "@/types/webBuilder";
import {
  HOME_PATH,
  LEGACY_BUILDER_KEYS,
  WEB_BUILDER_PAGES_KEY,
  clonePages,
  createDefaultElement,
  createEmptyHomePage,
  getStoredPages,
  nextZIndex,
  snap
} from "./webBuilderUtils";
import { elementRegistry } from "./elementRegistry";

type BuilderElementPatch = Omit<Partial<BuilderElement>, "layout" | "props"> & {
  layout?: Partial<BuilderElementLayout>;
  props?: Record<string, unknown>;
};

type WebBuilderContextValue = {
  page: BuilderPage;
  selectedId: string | null;
  selectedElement: BuilderElement | null;
  isBuilderOpen: boolean;
  status: string;
  openBuilder: () => void;
  closeBuilder: () => void;
  selectElement: (id: string | null) => void;
  addElement: (type: WebBuilderElementType) => void;
  updateElement: (id: string, patch: BuilderElementPatch) => void;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  updateElementLayout: (id: string, layout: Partial<BuilderElementLayout>) => void;
  duplicateElement: (id: string) => void;
  deleteElement: (id: string) => void;
  toggleLocked: (id: string) => void;
  toggleHidden: (id: string) => void;
  save: () => void;
  reset: () => void;
  clearLegacyData: () => void;
};

const WebBuilderContext = createContext<WebBuilderContextValue | null>(null);

export function WebBuilderProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<BuilderPages>(() => ({ [HOME_PATH]: createEmptyHomePage() }));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setPages(getStoredPages());
    if (new URLSearchParams(window.location.search).get("builder") === "1") {
      setIsBuilderOpen(true);
      setStatus("开发者模式已打开。");
    }
  }, []);

  const page = pages[HOME_PATH] || createEmptyHomePage();
  const selectedElement = useMemo(() => page.elements.find((element) => element.id === selectedId) || null, [page.elements, selectedId]);

  function commit(updater: (current: BuilderPage) => BuilderPage) {
    setPages((current) => {
      const next = clonePages(current);
      next[HOME_PATH] = updater(next[HOME_PATH] || createEmptyHomePage());
      return next;
    });
  }

  function updateElement(id: string, patch: BuilderElementPatch) {
    commit((current) => ({
      ...current,
      elements: current.elements.map((element) =>
        element.id === id
          ? {
              ...element,
              ...patch,
              layout: { ...element.layout, ...patch.layout },
              props: { ...element.props, ...patch.props }
            }
          : element
      )
    }));
  }

  const value = useMemo<WebBuilderContextValue>(
    () => ({
      page,
      selectedId,
      selectedElement,
      isBuilderOpen,
      status,
      openBuilder: () => {
        setIsBuilderOpen(true);
        setStatus("开发者模式已打开。");
      },
      closeBuilder: () => {
        setIsBuilderOpen(false);
        setSelectedId(null);
      },
      selectElement: setSelectedId,
      addElement: (type) => {
        commit((current) => {
          const element = createDefaultElement(type, 0, 0, current.elements);
          const canvasWidth = Math.max(320, window.innerWidth - 296 - 336);
          const canvasHeight = Math.max(240, window.innerHeight - 78 - 18);
          element.layout.x = snap(Math.max(16, canvasWidth / 2 - element.layout.width / 2));
          element.layout.y = snap(Math.max(16, canvasHeight / 2 - element.layout.height / 2));
          setSelectedId(element.id);
          setStatus(`${elementRegistry[type].labelZh} 已添加。`);
          return { ...current, elements: [...current.elements, element] };
        });
      },
      updateElement,
      updateElementProps: (id, props) => updateElement(id, { props }),
      updateElementLayout: (id, layout) => updateElement(id, { layout }),
      duplicateElement: (id) => {
        commit((current) => {
          const source = current.elements.find((element) => element.id === id);
          if (!source) return current;
          const copy: BuilderElement = JSON.parse(JSON.stringify(source)) as BuilderElement;
          copy.id = `${source.id}-copy-${Date.now().toString(36)}`;
          copy.layout.x += 32;
          copy.layout.y += 32;
          copy.layout.zIndex = nextZIndex(current.elements);
          setSelectedId(copy.id);
          return { ...current, elements: [...current.elements, copy] };
        });
      },
      deleteElement: (id) => {
        if (!window.confirm("确定删除这个元素吗？")) return;
        commit((current) => ({ ...current, elements: current.elements.filter((element) => element.id !== id) }));
        setSelectedId((current) => (current === id ? null : current));
      },
      toggleLocked: (id) => {
        const element = page.elements.find((item) => item.id === id);
        if (element) updateElement(id, { layout: { locked: !element.layout.locked } });
      },
      toggleHidden: (id) => {
        const element = page.elements.find((item) => item.id === id);
        if (element) updateElement(id, { layout: { hidden: !element.layout.hidden } });
      },
      save: () => {
        window.localStorage.setItem(WEB_BUILDER_PAGES_KEY, JSON.stringify({ [HOME_PATH]: page }, null, 2));
        setStatus("已保存到 localStorage。");
      },
      reset: () => {
        if (!window.confirm("确定重置 Builder 吗？这会清空首页叠加元素，原首页会保持不变。")) return;
        window.localStorage.removeItem(WEB_BUILDER_PAGES_KEY);
        setPages({ [HOME_PATH]: createEmptyHomePage() });
        setSelectedId(null);
        setStatus("已重置，当前显示原首页。");
      },
      clearLegacyData: () => {
        LEGACY_BUILDER_KEYS.forEach((key) => window.localStorage.removeItem(key));
        setStatus(`已清除旧 Builder 数据：${LEGACY_BUILDER_KEYS.join("、")}`);
      }
    }),
    [isBuilderOpen, page, selectedElement, selectedId, status]
  );

  return <WebBuilderContext.Provider value={value}>{children}</WebBuilderContext.Provider>;
}

export function useWebBuilder() {
  const context = useContext(WebBuilderContext);
  if (!context) {
    throw new Error("useWebBuilder must be used inside WebBuilderProvider.");
  }
  return context;
}
