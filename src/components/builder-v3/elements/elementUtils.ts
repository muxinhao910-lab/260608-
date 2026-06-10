import type { CSSProperties } from "react";
import type { BuilderElement } from "@/types/webBuilder";

export function propText(element: BuilderElement, key: string, fallback = "") {
  const value = element.props[key];
  return typeof value === "string" ? value : fallback;
}

export function propNumber(element: BuilderElement, key: string, fallback = 0) {
  const value = element.props[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || fallback;
  return fallback;
}

export function propArray<T extends Record<string, unknown>>(element: BuilderElement, key: string): T[] {
  const value = element.props[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

export function textStyle(element: BuilderElement): CSSProperties {
  return {
    color: propText(element, "color", "#ffffff"),
    fontSize: propText(element, "fontSize", "18px"),
    fontWeight: propText(element, "fontWeight", "400"),
    lineHeight: propText(element, "lineHeight", "1.35"),
    textAlign: propText(element, "textAlign", "left") as CSSProperties["textAlign"]
  };
}

export function boxStyle(element: BuilderElement): CSSProperties {
  return {
    color: propText(element, "color", "#ffffff"),
    background: propText(element, "background", propText(element, "backgroundColor", "transparent")),
    border: propText(element, "border", "0"),
    borderRadius: propText(element, "borderRadius", "0"),
    opacity: propNumber(element, "opacity", 1),
    padding: propText(element, "padding", "0"),
    margin: propText(element, "margin", "0")
  };
}
