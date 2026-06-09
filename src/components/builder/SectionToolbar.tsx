"use client";

import { useHomepageBuilder } from "./HomepageBuilderProvider";

export function SectionToolbar({ sectionId }: { sectionId: string }) {
  const builder = useHomepageBuilder();
  if (!builder.isDev || !builder.isBuilderOpen) {
    return null;
  }

  return (
    <div className="builder-section-toolbar">
      <button type="button" onClick={() => builder.editSection(sectionId)}>编辑</button>
      <button type="button" onClick={() => builder.moveSectionById(sectionId, -1)}>上移</button>
      <button type="button" onClick={() => builder.moveSectionById(sectionId, 1)}>下移</button>
      <button type="button" onClick={() => builder.duplicateSectionById(sectionId)}>复制</button>
      <button type="button" onClick={() => builder.deleteSectionById(sectionId)}>删除</button>
    </div>
  );
}
