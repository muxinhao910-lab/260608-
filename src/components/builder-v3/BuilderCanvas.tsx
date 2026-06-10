"use client";

import { ElementWrapper } from "./ElementWrapper";
import { useWebBuilder } from "./WebBuilderProvider";
import { elementRegistry } from "./elementRegistry";
import type { WebBuilderElementType } from "@/types/webBuilder";

export function BuilderCanvas() {
  const builder = useWebBuilder();
  const { canvas, elements } = builder.document;

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/web-builder-element") as WebBuilderElementType;
    if (!elementRegistry[type]) return;
    const rect = event.currentTarget.getBoundingClientRect();
    builder.addElement(type, { x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <div className={`wbv3-canvas-scroll ${builder.isPreview ? "is-preview" : ""}`}>
      <div
        className={`wbv3-canvas ${builder.isBuilderOpen && !builder.isPreview ? "is-editing" : ""}`}
        id="canvas"
        onClick={() => builder.isBuilderOpen && !builder.isPreview ? builder.selectElement(null) : undefined}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        style={{
          width: canvas.width,
          height: canvas.height,
          background: canvas.background
        }}
      >
        {elements.map((element) => (
          <ElementWrapper element={element} key={element.id} />
        ))}
      </div>
    </div>
  );
}
