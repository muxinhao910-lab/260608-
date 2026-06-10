"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultHomeCanvas } from "@/data/defaultHomeCanvas";
import type { BuilderElement, BuilderElementLayout, WebBuilderDocument, WebBuilderElementType } from "@/types/webBuilder";
import {
  WEB_BUILDER_STORAGE_KEY,
  cloneDocument,
  copyInstruction,
  createDefaultElement,
  getStoredDocument,
  nextZIndex,
  parseWebBuilderDocument
} from "./webBuilderUtils";

type WebBuilderContextValue = {
  document: WebBuilderDocument;
  selectedId: string | null;
  selectedElement: BuilderElement | null;
  isBuilderOpen: boolean;
  isPreview: boolean;
  status: string;
  openBuilder: () => void;
  closeBuilder: () => void;
  togglePreview: () => void;
  selectElement: (id: string | null) => void;
  addElement: (type: WebBuilderElementType, position?: { x: number; y: number }) => void;
  updateElement: (id: string, patch: Partial<BuilderElement>) => void;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  updateElementLayout: (id: string, layout: Partial<BuilderElementLayout>) => void;
  duplicateElement: (id: string) => void;
  deleteElement: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  toggleLocked: (id: string) => void;
  toggleHidden: (id: string) => void;
  save: () => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
  exportJson: () => Promise<void>;
  importJson: (raw: string) => void;
  copyCodexInstruction: (id: string) => Promise<void>;
};

const WebBuilderContext = createContext<WebBuilderContextValue | null>(null);
type BuilderElementPatch = Omit<Partial<BuilderElement>, "layout" | "props"> & {
  layout?: Partial<BuilderElementLayout>;
  props?: Record<string, unknown>;
};

export function WebBuilderProvider({ children, initialOpen = false }: { children: ReactNode; initialOpen?: boolean }) {
  const [document, setDocument] = useState<WebBuilderDocument>(() => cloneDocument(defaultHomeCanvas));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(initialOpen);
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState("");
  const [past, setPast] = useState<WebBuilderDocument[]>([]);
  const [future, setFuture] = useState<WebBuilderDocument[]>([]);

  useEffect(() => {
    setDocument(getStoredDocument());
  }, []);

  const selectedElement = useMemo(
    () => document.elements.find((element) => element.id === selectedId) || null,
    [document.elements, selectedId]
  );

  function commit(updater: (current: WebBuilderDocument) => WebBuilderDocument) {
    setDocument((current) => {
      setPast((items) => [...items.slice(-39), cloneDocument(current)]);
      setFuture([]);
      return updater(cloneDocument(current));
    });
  }

  function updateElement(id: string, patch: BuilderElementPatch) {
    commit((current) => ({
      ...current,
      elements: current.elements.map((element) => (element.id === id ? { ...element, ...patch, layout: { ...element.layout, ...patch.layout }, props: { ...element.props, ...patch.props } } : element))
    }));
  }

  const value = useMemo<WebBuilderContextValue>(
    () => ({
      document,
      selectedId,
      selectedElement,
      isBuilderOpen,
      isPreview,
      status,
      openBuilder: () => {
        setIsBuilderOpen(true);
        setIsPreview(false);
      },
      closeBuilder: () => {
        setIsBuilderOpen(false);
        setIsPreview(false);
        setSelectedId(null);
      },
      togglePreview: () => setIsPreview((current) => !current),
      selectElement: setSelectedId,
      addElement: (type, position) => {
        commit((current) => {
          const element = createDefaultElement(type, position?.x ?? current.canvas.width / 2 - 160, position?.y ?? 140, current.elements);
          setSelectedId(element.id);
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
          const copy = cloneDocument({ ...current, elements: [source] }).elements[0];
          copy.id = `${source.id}_copy_${Date.now().toString(16)}`;
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
      bringToFront: (id) => updateElement(id, { layout: { zIndex: nextZIndex(document.elements) } }),
      sendToBack: (id) => updateElement(id, { layout: { zIndex: 1 } }),
      toggleLocked: (id) => {
        const element = document.elements.find((item) => item.id === id);
        if (element) updateElement(id, { layout: { locked: !element.layout.locked } });
      },
      toggleHidden: (id) => {
        const element = document.elements.find((item) => item.id === id);
        if (element) updateElement(id, { layout: { hidden: !element.layout.hidden } });
      },
      save: () => {
        window.localStorage.setItem(WEB_BUILDER_STORAGE_KEY, JSON.stringify(document, null, 2));
        setStatus("已保存到 localStorage。");
      },
      reset: () => {
        if (!window.confirm("确定重置为默认画布吗？")) return;
        window.localStorage.removeItem(WEB_BUILDER_STORAGE_KEY);
        commit(() => cloneDocument(defaultHomeCanvas));
        setSelectedId(null);
        setStatus("已恢复默认画布。");
      },
      undo: () => {
        setPast((items) => {
          const previous = items.at(-1);
          if (!previous) return items;
          setFuture((futureItems) => [cloneDocument(document), ...futureItems]);
          setDocument(previous);
          return items.slice(0, -1);
        });
      },
      redo: () => {
        setFuture((items) => {
          const next = items[0];
          if (!next) return items;
          setPast((pastItems) => [...pastItems, cloneDocument(document)]);
          setDocument(next);
          return items.slice(1);
        });
      },
      exportJson: async () => {
        await navigator.clipboard.writeText(JSON.stringify(document, null, 2));
        setStatus("已复制 Web Builder V3 JSON。");
      },
      importJson: (raw) => {
        commit(() => parseWebBuilderDocument(raw));
        setSelectedId(null);
        setStatus("已导入 JSON，点击保存后写入 localStorage。");
      },
      copyCodexInstruction: async (id) => {
        const element = document.elements.find((item) => item.id === id);
        if (!element) return;
        await navigator.clipboard.writeText(copyInstruction(element));
        setStatus("已复制给 Codex 的修改指令。");
      }
    }),
    [document, isBuilderOpen, isPreview, selectedElement, selectedId, status]
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
