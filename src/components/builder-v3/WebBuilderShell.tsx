"use client";

import { useEffect } from "react";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderToolbar } from "./BuilderToolbar";
import { ComponentLibrary } from "./ComponentLibrary";
import { InspectorPanel } from "./InspectorPanel";
import { useWebBuilder } from "./WebBuilderProvider";

export function WebBuilderShell() {
  const builder = useWebBuilder();

  useEffect(() => {
    document.documentElement.dataset.wbv3Hydrated = "true";
  }, []);

  if (!builder.isBuilderOpen) {
    return process.env.NODE_ENV !== "production" ? (
      <button className="wbv3-dev-button" type="button" onClick={builder.openBuilder}>
        开发者模式
      </button>
    ) : null;
  }

  return (
    <div className="wbv3-shell">
      <BuilderToolbar />
      <ComponentLibrary />
      <BuilderCanvas />
      <InspectorPanel />
    </div>
  );
}
