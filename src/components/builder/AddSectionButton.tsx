"use client";

import { useHomepageBuilder } from "./HomepageBuilderProvider";

export function AddSectionButton({ insertIndex }: { insertIndex: number }) {
  const builder = useHomepageBuilder();
  if (!builder.isDev || !builder.isBuilderOpen) {
    return null;
  }
  return (
    <div className="builder-add-row">
      <button type="button" onClick={() => builder.openPicker(insertIndex)}>
        + 添加模块
      </button>
    </div>
  );
}
