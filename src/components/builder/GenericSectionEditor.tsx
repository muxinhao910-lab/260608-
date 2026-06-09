"use client";

import type { SectionEditorProps } from "@/types/pageBuilder";

export function GenericSectionEditor({ section, defaultProps, onChange }: SectionEditorProps) {
  const props = section.props;

  function updateField(key: string, value: unknown) {
    onChange({ ...props, [key]: value });
  }

  function updateArrayItem(key: string, index: number, itemKey: string, value: string) {
    const rows = Array.isArray(props[key]) ? [...(props[key] as Record<string, unknown>[])] : [];
    const current = rows[index] || {};
    rows[index] = { ...current, [itemKey]: normalizeArrayValue(itemKey, value) };
    updateField(key, rows);
  }

  function addArrayItem(key: string) {
    const currentRows = Array.isArray(props[key]) ? [...(props[key] as Record<string, unknown>[])] : [];
    const defaultRows = Array.isArray(defaultProps[key]) ? (defaultProps[key] as Record<string, unknown>[]) : [];
    const source = currentRows[0] || defaultRows[0] || { title: "", description: "" };
    const nextItem = Object.fromEntries(Object.keys(source).map((itemKey) => [itemKey, itemKey === "tags" ? [] : ""]));
    updateField(key, [...currentRows, nextItem]);
  }

  function removeArrayItem(key: string, index: number) {
    const currentRows = Array.isArray(props[key]) ? [...(props[key] as Record<string, unknown>[])] : [];
    updateField(
      key,
      currentRows.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  return (
    <div className="builder-editor-fields">
      {Object.entries(props).map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <div className="builder-field-block" key={key}>
              <div className="builder-field-heading">
                <label>{key}</label>
                <button type="button" onClick={() => addArrayItem(key)}>
                  添加一项
                </button>
              </div>
              {value.map((item, index) => (
                <div className="builder-array-item" key={`${key}-${index}`}>
                  <div className="builder-array-title">
                    <strong>#{index + 1}</strong>
                    <button type="button" onClick={() => removeArrayItem(key, index)}>
                      删除
                    </button>
                  </div>
                  {Object.entries(asRecord(item)).map(([itemKey, itemValue]) => (
                    <label key={itemKey}>
                      <span>{itemKey}</span>
                      <textarea
                        rows={itemKey === "description" || itemKey === "content" ? 3 : 1}
                        value={formatEditorValue(itemValue)}
                        onChange={(event) => updateArrayItem(key, index, itemKey, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              ))}
            </div>
          );
        }

        if (typeof value === "string") {
          return (
            <label key={key}>
              <span>{key}</span>
              {key === "subtitle" || key === "content" || key === "description" ? (
                <textarea rows={4} value={value} onChange={(event) => updateField(key, event.target.value)} />
              ) : (
                <input value={value} onChange={(event) => updateField(key, event.target.value)} />
              )}
            </label>
          );
        }

        return null;
      })}
    </div>
  );
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function formatEditorValue(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : String(value ?? "");
}

function normalizeArrayValue(key: string, value: string) {
  if (key === "tags") {
    return value
      .split(/[,\uFF0C]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}
