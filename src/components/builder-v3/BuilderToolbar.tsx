"use client";

import { useState } from "react";
import { ImportExportDialog } from "./ImportExportDialog";
import { useWebBuilder } from "./WebBuilderProvider";

export function BuilderToolbar() {
  const builder = useWebBuilder();
  const [dialog, setDialog] = useState<"import" | "export" | null>(null);

  return (
    <>
      <header className="wbv3-toolbar">
        <strong>Web Builder V3</strong>
        <button type="button" onClick={builder.save}>保存</button>
        <button type="button" onClick={builder.undo}>撤销</button>
        <button type="button" onClick={builder.redo}>重做</button>
        <button type="button" onClick={builder.togglePreview}>{builder.isPreview ? "退出预览" : "预览"}</button>
        <button type="button" onClick={() => setDialog("export")}>导出 JSON</button>
        <button type="button" onClick={() => setDialog("import")}>导入 JSON</button>
        <button type="button" onClick={builder.reset}>重置</button>
        <button type="button" onClick={builder.closeBuilder}>退出开发者模式</button>
        {builder.status ? <span>{builder.status}</span> : null}
      </header>
      {dialog ? <ImportExportDialog mode={dialog} onClose={() => setDialog(null)} /> : null}
    </>
  );
}
