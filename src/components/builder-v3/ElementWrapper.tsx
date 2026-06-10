"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { BuilderElement, ResizeHandle } from "@/types/webBuilder";
import { ElementRenderer } from "./ElementRenderer";
import { useWebBuilder } from "./WebBuilderProvider";
import { GRID_SIZE, snap } from "./webBuilderUtils";

const handles: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

type DragState =
  | { mode: "move"; startX: number; startY: number; x: number; y: number }
  | { mode: "resize"; handle: ResizeHandle; startX: number; startY: number; x: number; y: number; width: number; height: number };

export function ElementWrapper({ element }: { element: BuilderElement }) {
  const builder = useWebBuilder();
  const ref = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const selected = builder.selectedId === element.id;
  const hidden = element.layout.hidden && builder.isBuilderOpen;

  if (element.layout.hidden && !builder.isBuilderOpen) {
    return null;
  }

  function beginMove(event: PointerEvent<HTMLDivElement>) {
    if (!builder.isBuilderOpen || builder.isPreview || element.layout.locked || isResizeHandle(event.target)) {
      return;
    }
    event.preventDefault();
    builder.selectElement(element.id);
    ref.current?.setPointerCapture(event.pointerId);
    setDragState({
      mode: "move",
      startX: event.clientX,
      startY: event.clientY,
      x: element.layout.x,
      y: element.layout.y
    });
  }

  function beginResize(handle: ResizeHandle, event: PointerEvent<HTMLButtonElement>) {
    if (element.layout.locked) return;
    event.preventDefault();
    event.stopPropagation();
    builder.selectElement(element.id);
    ref.current?.setPointerCapture(event.pointerId);
    setDragState({
      mode: "resize",
      handle,
      startX: event.clientX,
      startY: event.clientY,
      x: element.layout.x,
      y: element.layout.y,
      width: element.layout.width,
      height: element.layout.height
    });
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!dragState) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;

    if (dragState.mode === "move") {
      builder.updateElementLayout(element.id, {
        x: snap(dragState.x + dx),
        y: snap(dragState.y + dy)
      });
      return;
    }

    const next = resizeLayout(dragState, dx, dy);
    builder.updateElementLayout(element.id, next);
  }

  function end(event: PointerEvent<HTMLDivElement>) {
    if (dragState) {
      ref.current?.releasePointerCapture(event.pointerId);
      setDragState(null);
    }
  }

  return (
    <div
      className={`wbv3-element-wrapper ${builder.isBuilderOpen && !builder.isPreview ? "is-editable" : ""} ${selected ? "is-selected" : ""} ${hidden ? "is-hidden" : ""} ${element.layout.locked ? "is-locked" : ""}`}
      data-element-id={element.id}
      data-element-type={element.type}
      onClick={(event) => {
        if (builder.isBuilderOpen && !builder.isPreview) {
          event.stopPropagation();
          builder.selectElement(element.id);
        }
      }}
      onPointerDown={beginMove}
      onPointerMove={move}
      onPointerUp={end}
      ref={ref}
      style={{
        left: element.layout.x,
        top: element.layout.y,
        width: element.layout.width,
        height: element.layout.height,
        zIndex: element.layout.zIndex
      }}
    >
      <ElementRenderer element={element} />
      {builder.isBuilderOpen && !builder.isPreview && selected ? (
        <div className="wbv3-resize-handles" aria-hidden="true">
          {handles.map((handle) => (
            <button
              className={`wbv3-resize-handle wbv3-resize-${handle}`}
              key={handle}
              type="button"
              onPointerDown={(event) => beginResize(handle, event)}
            />
          ))}
        </div>
      ) : null}
      {dragState ? (
        <>
          <span className="wbv3-guide wbv3-guide-x" style={{ top: snap(element.layout.y) }} />
          <span className="wbv3-guide wbv3-guide-y" style={{ left: snap(element.layout.x) }} />
          <span className="wbv3-measure">{element.layout.x}, {element.layout.y} / {element.layout.width}×{element.layout.height}</span>
        </>
      ) : null}
      {element.layout.locked ? <span className="wbv3-state-pill">Locked</span> : null}
      {hidden ? <span className="wbv3-state-pill">Hidden</span> : null}
    </div>
  );
}

function isResizeHandle(target: EventTarget) {
  return target instanceof HTMLElement && target.classList.contains("wbv3-resize-handle");
}

function resizeLayout(state: Extract<DragState, { mode: "resize" }>, dx: number, dy: number) {
  let { x, y, width, height } = state;
  const minWidth = GRID_SIZE * 5;
  const minHeight = GRID_SIZE * 4;

  if (state.handle.includes("e")) width += dx;
  if (state.handle.includes("s")) height += dy;
  if (state.handle.includes("w")) {
    x += dx;
    width -= dx;
  }
  if (state.handle.includes("n")) {
    y += dy;
    height -= dy;
  }

  width = Math.max(minWidth, snap(width));
  height = Math.max(minHeight, snap(height));
  return { x: snap(x), y: snap(y), width, height };
}
