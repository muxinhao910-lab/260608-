"use client";

import { useEffect, useState } from "react";
import { useWebBuilder } from "./WebBuilderProvider";

export function BuilderContextMenu() {
  const builder = useWebBuilder();
  const [menu, setMenu] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    function open(event: MouseEvent) {
      if (!builder.isBuilderOpen || builder.isPreview) return;
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-element-id]") : null;
      if (!target) return;
      event.preventDefault();
      const id = target.dataset.elementId;
      if (!id) return;
      builder.selectElement(id);
      setMenu({ id, x: event.clientX, y: event.clientY });
    }

    function close() {
      setMenu(null);
    }

    window.addEventListener("contextmenu", open);
    window.addEventListener("click", close);
    return () => {
      window.removeEventListener("contextmenu", open);
      window.removeEventListener("click", close);
    };
  }, [builder]);

  if (!menu) return null;

  return (
    <div className="wbv3-context-menu" style={{ left: menu.x, top: menu.y }}>
      <button type="button" onClick={() => builder.duplicateElement(menu.id)}>复制</button>
      <button type="button" onClick={() => builder.deleteElement(menu.id)}>删除</button>
      <button type="button" onClick={() => builder.bringToFront(menu.id)}>置顶</button>
      <button type="button" onClick={() => builder.sendToBack(menu.id)}>置底</button>
      <button type="button" onClick={() => builder.toggleLocked(menu.id)}>锁定</button>
      <button type="button" onClick={() => builder.toggleHidden(menu.id)}>隐藏</button>
    </div>
  );
}
