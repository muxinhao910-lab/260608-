import type { BuilderElement, BuilderPage, BuilderPages, WebBuilderElementType } from "@/types/webBuilder";
import { elementRegistry } from "./elementRegistry";

export const WEB_BUILDER_PAGES_KEY = "web-builder:pages";
export const LEGACY_BUILDER_KEYS = ["web-builder:home", "homepage-builder-sections", "homepage-builder-v2-sections"] as const;
export const HOME_PATH = "/";

export function createEmptyHomePage(): BuilderPage {
  return {
    title: "首页",
    path: HOME_PATH,
    elements: []
  };
}

export function clonePages(pages: BuilderPages): BuilderPages {
  return JSON.parse(JSON.stringify(pages)) as BuilderPages;
}

export function getStoredPages(): BuilderPages {
  if (typeof window === "undefined") {
    return { [HOME_PATH]: createEmptyHomePage() };
  }

  const stored = window.localStorage.getItem(WEB_BUILDER_PAGES_KEY);
  if (!stored) {
    return { [HOME_PATH]: createEmptyHomePage() };
  }

  try {
    return normalizePages(JSON.parse(stored));
  } catch {
    return { [HOME_PATH]: createEmptyHomePage() };
  }
}

function normalizePages(value: unknown): BuilderPages {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return { [HOME_PATH]: normalizePage(source[HOME_PATH], createEmptyHomePage()) };
}

function normalizePage(value: unknown, fallback: BuilderPage): BuilderPage {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallback;
  }

  const page = value as Partial<BuilderPage>;
  return {
    title: typeof page.title === "string" && page.title.trim() ? page.title : fallback.title,
    path: HOME_PATH,
    elements: Array.isArray(page.elements) ? page.elements.filter(isBuilderElement) : []
  };
}

function isBuilderElement(value: unknown): value is BuilderElement {
  if (!value || typeof value !== "object") return false;
  const element = value as Partial<BuilderElement>;
  if (!element.id || !element.type || !elementRegistry[element.type] || typeof element.props !== "object" || !element.layout) {
    return false;
  }

  element.layout = {
    x: Number(element.layout.x) || 0,
    y: Number(element.layout.y) || 0,
    width: Number(element.layout.width) || 200,
    height: Number(element.layout.height) || 80,
    zIndex: Number(element.layout.zIndex) || 1,
    locked: !!element.layout.locked,
    hidden: !!element.layout.hidden
  };

  return true;
}

export function createDefaultElement(type: WebBuilderElementType, x: number, y: number, currentElements: BuilderElement[]): BuilderElement {
  const item = elementRegistry[type];
  return {
    id: `${type.toLowerCase()}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    props: { ...item.defaultProps },
    layout: {
      x,
      y,
      width: item.defaultLayout.width,
      height: item.defaultLayout.height,
      zIndex: nextZIndex(currentElements)
    }
  };
}

export function nextZIndex(elements: BuilderElement[]) {
  return elements.reduce((max, item) => Math.max(max, item.layout.zIndex || 1), 1) + 1;
}

export function snap(value: number) {
  return Math.round(value / 8) * 8;
}

export function propString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function propNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
