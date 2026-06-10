"use client";

import { elementRegistry } from "./elementRegistry";
import { useWebBuilder } from "./WebBuilderProvider";
import type { BuilderElement, BuilderElementLayout } from "@/types/webBuilder";

export function InspectorPanel() {
  const builder = useWebBuilder();
  const element = builder.selectedElement;

  if (!element) {
    return (
      <aside className="wbv3-inspector">
        <div className="wbv3-panel-title">
          <p>属性面板</p>
          <h2>未选择元素</h2>
        </div>
        <p className="wbv3-muted">点击左侧组件添加元素，或点击画布中的元素进行编辑。</p>
      </aside>
    );
  }

  const registry = elementRegistry[element.type];

  return (
    <aside className="wbv3-inspector">
      <div className="wbv3-panel-title">
        <p>属性面板</p>
        <h2>{registry.labelZh}</h2>
      </div>

      <section>
        <h3>内容</h3>
        <PropFields element={element} />
      </section>

      <section>
        <h3>位置与尺寸</h3>
        <div className="wbv3-inspector-grid">
          {(["x", "y", "width", "height"] as const).map((key) => (
            <label key={key}>
              <span>{key}</span>
              <input
                type="number"
                value={element.layout[key]}
                onChange={(event) => builder.updateElementLayout(element.id, { [key]: Number(event.target.value) } as Partial<BuilderElementLayout>)}
              />
            </label>
          ))}
        </div>
        <label className="wbv3-check">
          <input type="checkbox" checked={!!element.layout.locked} onChange={() => builder.toggleLocked(element.id)} />
          锁定元素
        </label>
        <label className="wbv3-check">
          <input type="checkbox" checked={!!element.layout.hidden} onChange={() => builder.toggleHidden(element.id)} />
          隐藏元素
        </label>
      </section>

      <section className="wbv3-inspector-actions">
        <button type="button" onClick={() => builder.duplicateElement(element.id)}>复制元素</button>
        <button type="button" onClick={() => builder.deleteElement(element.id)}>删除</button>
      </section>
    </aside>
  );
}

function PropFields({ element }: { element: BuilderElement }) {
  switch (element.type) {
    case "Heading":
      return (
        <>
          <PropField element={element} propKey="text" label="标题文字" kind="textarea" />
          <PropField element={element} propKey="color" label="文字颜色" />
          <PropField element={element} propKey="fontSize" label="字号" kind="number" />
        </>
      );
    case "Text":
      return (
        <>
          <PropField element={element} propKey="text" label="文本内容" kind="textarea" />
          <PropField element={element} propKey="color" label="文字颜色" />
          <PropField element={element} propKey="fontSize" label="字号" kind="number" />
        </>
      );
    case "Button":
      return (
        <>
          <PropField element={element} propKey="text" label="按钮文字" />
          <PropField element={element} propKey="href" label="按钮链接 href" />
          <PropField element={element} propKey="background" label="背景颜色" />
          <PropField element={element} propKey="color" label="文字颜色" />
        </>
      );
    case "Image":
      return (
        <>
          <PropField element={element} propKey="src" label="图片路径" />
          <PropField element={element} propKey="alt" label="替代文字" />
          <PropField element={element} propKey="objectFit" label="填充方式" />
        </>
      );
    case "SearchBox":
      return (
        <>
          <PropField element={element} propKey="placeholder" label="占位文字" />
          <PropField element={element} propKey="buttonText" label="按钮文字" />
        </>
      );
    case "Card":
      return (
        <>
          <PropField element={element} propKey="tag" label="标签" />
          <PropField element={element} propKey="title" label="卡片标题" />
          <PropField element={element} propKey="description" label="卡片描述" kind="textarea" />
        </>
      );
    case "Divider":
      return <PropField element={element} propKey="color" label="线条颜色" />;
    case "Spacer":
      return <PropField element={element} propKey="background" label="辅助背景" />;
    default:
      return null;
  }
}

function PropField({ element, propKey, label, kind = "text" }: { element: BuilderElement; propKey: string; label: string; kind?: "text" | "textarea" | "number" }) {
  const builder = useWebBuilder();
  const value = element.props[propKey];
  const normalized = typeof value === "number" ? value : typeof value === "string" ? value : "";

  return (
    <label>
      <span>{label}</span>
      {kind === "textarea" ? (
        <textarea value={String(normalized)} onChange={(event) => builder.updateElementProps(element.id, { [propKey]: event.target.value })} />
      ) : (
        <input
          type={kind}
          value={normalized}
          onChange={(event) => builder.updateElementProps(element.id, { [propKey]: kind === "number" ? Number(event.target.value) : event.target.value })}
        />
      )}
    </label>
  );
}
