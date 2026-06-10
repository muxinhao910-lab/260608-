"use client";

import { useEffect } from "react";
import { BuilderCanvas } from "./BuilderCanvas";
import { BuilderContextMenu } from "./BuilderContextMenu";
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
    return (
      <>
        <BuilderCanvas />
        {process.env.NODE_ENV !== "production" ? (
          <a className="wbv3-dev-button" href="/?builder=1" role="button">
            开发者模式
          </a>
        ) : null}
      </>
    );
  }

  if (builder.isPreview) {
    return (
      <div className="wbv3-preview">
        <BuilderCanvas />
        <button className="wbv3-preview-exit" type="button" onClick={builder.togglePreview}>
          退出预览
        </button>
      </div>
    );
  }

  return (
    <div className="wbv3-shell">
      <BuilderToolbar />
      <ComponentLibrary />
      <BuilderCanvas />
      <InspectorPanel />
      <BuilderContextMenu />
    </div>
  );
}
