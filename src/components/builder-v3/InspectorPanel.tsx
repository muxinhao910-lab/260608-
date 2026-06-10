"use client";

import { elementRegistry } from "./elementRegistry";
import { useWebBuilder } from "./WebBuilderProvider";

const styleKeys = ["color", "background", "backgroundColor", "border", "borderRadius", "opacity", "fontSize", "fontWeight", "textAlign", "padding", "margin"];

export function InspectorPanel() {
  const builder = useWebBuilder();
  const element = builder.selectedElement;

  if (!element) {
    return (
      <aside className="wbv3-inspector">
        <div className="wbv3-panel-title">
          <p>Inspector</p>
          <h2>未选中元素</h2>
        </div>
        <p className="wbv3-muted">点击画布中的元素后，可以编辑内容、位置、尺寸、样式和状态。</p>
      </aside>
    );
  }

  const activeElement = element;
  const registryItem = elementRegistry[activeElement.type];

  function updateProp(key: string, value: string) {
    builder.updateElementProps(activeElement.id, { ...activeElement.props, [key]: parseValue(key, value) });
  }

  function updateLayout(key: string, value: string | boolean) {
    builder.updateElementLayout(activeElement.id, { [key]: typeof value === "boolean" ? value : Number(value) || 0 });
  }

  return (
    <aside className="wbv3-inspector">
      <div className="wbv3-panel-title">
        <p>{activeElement.type}</p>
        <h2>{registryItem.label}</h2>
      </div>

      <section>
        <h3>内容</h3>
        <label>
          <span>id</span>
          <input readOnly value={activeElement.id} />
        </label>
        {Object.entries(activeElement.props).map(([key, value]) => (
          <label key={key}>
            <span>{key}</span>
            {Array.isArray(value) || key === "content" || key === "items" || key === "cards" ? (
              <textarea rows={Array.isArray(value) ? 7 : 4} value={formatValue(value)} onChange={(event) => updateProp(key, event.target.value)} />
            ) : (
              <input value={formatValue(value)} onChange={(event) => updateProp(key, event.target.value)} />
            )}
          </label>
        ))}
      </section>

      <section>
        <h3>位置和尺寸</h3>
        <div className="wbv3-inspector-grid">
          {(["x", "y", "width", "height", "zIndex"] as const).map((key) => (
            <label key={key}>
              <span>{key}</span>
              <input type="number" value={activeElement.layout[key]} onChange={(event) => updateLayout(key, event.target.value)} />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h3>样式快捷字段</h3>
        {styleKeys.map((key) => (
          <label key={key}>
            <span>{key}</span>
            <input value={formatValue(activeElement.props[key])} onChange={(event) => updateProp(key, event.target.value)} />
          </label>
        ))}
      </section>

      <section>
        <h3>状态</h3>
        <label className="wbv3-check">
          <input checked={Boolean(activeElement.layout.locked)} type="checkbox" onChange={(event) => updateLayout("locked", event.target.checked)} />
          <span>locked</span>
        </label>
        <label className="wbv3-check">
          <input checked={Boolean(activeElement.layout.hidden)} type="checkbox" onChange={(event) => updateLayout("hidden", event.target.checked)} />
          <span>hidden</span>
        </label>
      </section>

      <section className="wbv3-inspector-actions">
        <button type="button" onClick={() => builder.copyCodexInstruction(activeElement.id)}>复制此元素修改指令</button>
        <button type="button" onClick={() => builder.duplicateElement(activeElement.id)}>复制元素</button>
        <button type="button" onClick={() => builder.bringToFront(activeElement.id)}>置顶</button>
        <button type="button" onClick={() => builder.sendToBack(activeElement.id)}>置底</button>
        <button type="button" onClick={() => builder.deleteElement(activeElement.id)}>删除</button>
      </section>
    </aside>
  );
}

function formatValue(value: unknown) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return JSON.stringify(value, null, 2);
  }
  return String(value ?? "");
}

function parseValue(key: string, value: string) {
  const trimmed = value.trim();
  if ((key === "items" || key === "cards" || key === "options") && (trimmed.startsWith("[") || trimmed.startsWith("{"))) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return value;
    }
  }
  if (key === "opacity") {
    return Number(value);
  }
  return value;
}
