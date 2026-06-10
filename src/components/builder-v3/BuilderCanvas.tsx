"use client";

import { ElementWrapper } from "./ElementWrapper";
import { useWebBuilder } from "./WebBuilderProvider";

export function BuilderCanvas() {
  const builder = useWebBuilder();

  return (
    <div className="wbv3-canvas-layer" onMouseDown={() => builder.selectElement(null)}>
      <div className="wbv3-canvas-hint">正在编辑首页叠加层，底下仍是原首页。</div>
      <div className="wbv3-canvas-bounds">
        {builder.page.elements.map((element) => (
          <ElementWrapper element={element} key={element.id} />
        ))}
      </div>
    </div>
  );
}
