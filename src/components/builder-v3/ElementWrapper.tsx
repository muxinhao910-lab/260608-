"use client";

import { Rnd } from "react-rnd";
import { ElementRenderer } from "./ElementRenderer";
import { useWebBuilder } from "./WebBuilderProvider";
import type { BuilderElement } from "@/types/webBuilder";
import { snap } from "./webBuilderUtils";

export function ElementWrapper({ element }: { element: BuilderElement }) {
  const builder = useWebBuilder();
  const selected = builder.selectedId === element.id;

  if (element.layout.hidden) {
    return null;
  }

  return (
    <Rnd
      bounds="parent"
      className={`wbv3-rnd ${selected ? "is-selected" : ""} ${element.layout.locked ? "is-locked" : ""}`}
      disableDragging={element.layout.locked}
      dragGrid={[8, 8]}
      enableResizing={!element.layout.locked}
      onClick={(event: React.MouseEvent) => {
        event.stopPropagation();
        builder.selectElement(element.id);
      }}
      onDragStart={() => builder.selectElement(element.id)}
      onDragStop={(_, data) => {
        builder.updateElementLayout(element.id, { x: snap(data.x), y: snap(data.y) });
      }}
      onResizeStart={() => builder.selectElement(element.id)}
      onResizeStop={(_, __, ref, ___, position) => {
        builder.updateElementLayout(element.id, {
          x: snap(position.x),
          y: snap(position.y),
          width: Math.max(48, snap(ref.offsetWidth)),
          height: Math.max(24, snap(ref.offsetHeight))
        });
      }}
      position={{ x: element.layout.x, y: element.layout.y }}
      resizeGrid={[8, 8]}
      size={{ width: element.layout.width, height: element.layout.height }}
      style={{ zIndex: element.layout.zIndex }}
    >
      <ElementRenderer element={element} />
      {selected ? <span className="wbv3-measure">{element.layout.x}, {element.layout.y} / {element.layout.width} x {element.layout.height}</span> : null}
    </Rnd>
  );
}
