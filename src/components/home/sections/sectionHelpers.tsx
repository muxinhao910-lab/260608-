import type { ReactNode } from "react";

export function SectionShell({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`home-section-shell ${className}`}>{children}</div>;
}

export function textProp(props: Record<string, unknown>, key: string, fallback = "") {
  const value = props[key];
  return typeof value === "string" ? value : fallback;
}

export function arrayProp<T extends Record<string, unknown>>(props: Record<string, unknown>, key: string): T[] {
  const value = props[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

export function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}
