"use client";

import { useState } from "react";
import { useHomepageBuilder } from "./HomepageBuilderProvider";

export function BuilderToolbar() {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importValue, setImportValue] = useState("");
  const builder = useHomepageBuilder();

  function confirmImport() {
    try {
      builder.importSections(importValue);
      setImportValue("");
      setIsImportOpen(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "导入失败。");
    }
  }

  return (
    <>
      <aside className="builder-toolbar">
        <div>
          <strong>Homepage Builder</strong>
          <span>建议在桌面端使用 Builder 模式。</span>
        </div>
        <button type="button" onClick={builder.closeBuilder}>退出 Builder</button>
        <button type="button" onClick={() => builder.openPicker(builder.sections.length)}>添加模块</button>
        <button type="button" onClick={builder.saveSections}>保存</button>
        <button type="button" onClick={() => void builder.exportSections()}>导出 JSON</button>
        <button type="button" onClick={() => setIsImportOpen(true)}>导入 JSON</button>
        <button type="button" onClick={builder.resetToDefault}>重置为默认首页</button>
        <button type="button" onClick={builder.clearLocalChanges}>清空本地修改</button>
        {builder.statusMessage ? <p className="builder-status">{builder.statusMessage}</p> : null}
      </aside>
      {isImportOpen ? (
        <div className="builder-modal-backdrop">
          <div className="builder-modal">
            <h2>导入首页 JSON</h2>
            <textarea
              placeholder='粘贴 {"pageId":"home","version":1,"sections":[...]}'
              value={importValue}
              onChange={(event) => setImportValue(event.target.value)}
            />
            <div className="builder-modal-actions">
              <button type="button" onClick={() => setIsImportOpen(false)}>取消</button>
              <button type="button" onClick={confirmImport}>确认导入</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
