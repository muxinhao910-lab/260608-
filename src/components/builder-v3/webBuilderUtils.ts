import { defaultHomeCanvas } from "@/data/defaultHomeCanvas";
import { elementRegistry } from "./elementRegistry";
import type { BuilderElement, WebBuilderDocument, WebBuilderElementType } from "@/types/webBuilder";

export const WEB_BUILDER_STORAGE_KEY = "web-builder:home";
export const GRID_SIZE = 8;

export function cloneDocument(document: WebBuilderDocument): WebBuilderDocument {
  return JSON.parse(JSON.stringify(document)) as WebBuilderDocument;
}

export function createElementId(type: WebBuilderElementType) {
  return `element_${type.toLowerCase()}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
}

export function snap(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function nextZIndex(elements: BuilderElement[]) {
  return elements.reduce((max, element) => Math.max(max, element.layout.zIndex), 0) + 1;
}

export function createDefaultElement(type: WebBuilderElementType, x = 100, y = 100, elements: BuilderElement[] = []): BuilderElement {
  const registryItem = elementRegistry[type];
  return {
    id: createElementId(type),
    type,
    props: JSON.parse(JSON.stringify(registryItem.defaultProps)) as Record<string, unknown>,
    layout: {
      x: snap(x),
      y: snap(y),
      width: registryItem.defaultLayout.width,
      height: registryItem.defaultLayout.height,
      zIndex: nextZIndex(elements),
      locked: false,
      hidden: false
    }
  };
}

export function parseWebBuilderDocument(raw: string): WebBuilderDocument {
  const parsed = JSON.parse(raw) as WebBuilderDocument;
  if (parsed.pageId !== "home" || parsed.version !== 3 || !parsed.canvas || !Array.isArray(parsed.elements)) {
    throw new Error("JSON 必须是 Web Builder V3 的 home 配置。");
  }
  return {
    pageId: "home",
    version: 3,
    canvas: {
      width: Number(parsed.canvas.width) || defaultHomeCanvas.canvas.width,
      height: Number(parsed.canvas.height) || defaultHomeCanvas.canvas.height,
      background: String(parsed.canvas.background || defaultHomeCanvas.canvas.background)
    },
    elements: parsed.elements
      .filter((element) => elementRegistry[element.type])
      .map((element) => ({
        id: typeof element.id === "string" ? element.id : createElementId(element.type),
        type: element.type,
        props: element.props && typeof element.props === "object" ? element.props : {},
        layout: {
          x: Number(element.layout?.x) || 0,
          y: Number(element.layout?.y) || 0,
          width: Number(element.layout?.width) || elementRegistry[element.type].defaultLayout.width,
          height: Number(element.layout?.height) || elementRegistry[element.type].defaultLayout.height,
          zIndex: Number(element.layout?.zIndex) || 1,
          locked: Boolean(element.layout?.locked),
          hidden: Boolean(element.layout?.hidden)
        }
      }))
  };
}

export function getStoredDocument(): WebBuilderDocument {
  if (typeof window === "undefined") {
    return cloneDocument(defaultHomeCanvas);
  }
  const raw = window.localStorage.getItem(WEB_BUILDER_STORAGE_KEY);
  if (!raw) {
    return cloneDocument(defaultHomeCanvas);
  }
  try {
    return parseWebBuilderDocument(raw);
  } catch {
    return cloneDocument(defaultHomeCanvas);
  }
}

export function copyInstruction(element: BuilderElement) {
  const text =
    typeof element.props.text === "string"
      ? element.props.text
      : typeof element.props.title === "string"
        ? element.props.title
        : typeof element.props.description === "string"
          ? element.props.description
          : "";

  return `【目标页面】
home /

【目标元素】
id: ${element.id}
type: ${element.type}
text: ${text}

【当前位置】
x=${element.layout.x}, y=${element.layout.y}, width=${element.layout.width}, height=${element.layout.height}, zIndex=${element.layout.zIndex}

【我想修改】
请在这里写我的需求：

【要求】
只修改这一个元素，不要修改其他页面或其他元素。`;
}
