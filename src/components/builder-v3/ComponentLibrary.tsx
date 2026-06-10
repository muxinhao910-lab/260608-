"use client";

import { elementRegistry } from "./elementRegistry";
import { useWebBuilder } from "./WebBuilderProvider";
import type { WebBuilderElementType } from "@/types/webBuilder";

export function ComponentLibrary() {
  const builder = useWebBuilder();
  const groups = Object.entries(elementRegistry).reduce<Record<string, Array<[WebBuilderElementType, string]>>>((acc, [type, item]) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push([type as WebBuilderElementType, item.label]);
    return acc;
  }, {});

  return (
    <aside className="wbv3-library">
      <div className="wbv3-panel-title">
        <p>Library</p>
        <h2>基础组件</h2>
      </div>
      {Object.entries(groups).map(([category, items]) => (
        <section key={category}>
          <h3>{category}</h3>
          <div>
            {items.map(([type, label]) => (
              <button
                draggable
                key={type}
                onClick={() => builder.addElement(type)}
                onDragStart={(event) => event.dataTransfer.setData("application/web-builder-element", type)}
                type="button"
              >
                {label}
                <span>{type}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}
