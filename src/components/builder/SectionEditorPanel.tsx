"use client";

import { moduleRegistry } from "@/components/home/sectionRegistry";
import type { HomeSection } from "@/types/pageBuilder";
import { useHomepageBuilder } from "./HomepageBuilderProvider";

export function SectionEditorPanel({ section }: { section: HomeSection }) {
  const builder = useHomepageBuilder();
  const registryItem = moduleRegistry[section.type];
  const Editor = registryItem.Editor;

  return (
    <aside className="builder-editor-panel">
      <div className="builder-editor-title">
        <div>
          <p>{section.type}</p>
          <h2>{registryItem.label}</h2>
        </div>
        <button type="button" onClick={() => builder.editSection("")}>关闭</button>
      </div>
      <label>
        <span>section id</span>
        <input readOnly value={section.id} />
      </label>
      <Editor
        defaultProps={registryItem.defaultProps}
        section={section}
        onChange={(props) => builder.updateSectionProps(section.id, props)}
      />
      <div className="builder-editor-help">
        满意当前首页后，点击“导出 JSON”，把 JSON 发给 Codex，让 Codex 固化进 defaultHomeSections。
      </div>
    </aside>
  );
}
