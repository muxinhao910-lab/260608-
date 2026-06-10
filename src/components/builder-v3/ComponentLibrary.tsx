"use client";

import { elementRegistry } from "./elementRegistry";
import { useWebBuilder } from "./WebBuilderProvider";
import type { WebBuilderElementType } from "@/types/webBuilder";

export function ComponentLibrary() {
  const builder = useWebBuilder();

  return (
    <aside className="wbv3-library">
      <div className="wbv3-panel-title">
        <p>组件库</p>
        <h2>添加元素</h2>
      </div>
      <section>
        <h3>基础组件</h3>
        <div>
          {Object.entries(elementRegistry).map(([type, item]) => (
            <button key={type} onClick={() => builder.addElement(type as WebBuilderElementType)} type="button">
              {item.labelZh}
              <span>{item.description}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
