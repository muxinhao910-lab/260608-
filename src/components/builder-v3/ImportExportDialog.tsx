"use client";

import { useState } from "react";
import { useWebBuilder } from "./WebBuilderProvider";

export function ImportExportDialog({ mode, onClose }: { mode: "import" | "export"; onClose: () => void }) {
  const builder = useWebBuilder();
  const [value, setValue] = useState(mode === "export" ? JSON.stringify(builder.document, null, 2) : "");

  function confirm() {
    if (mode === "import") {
      try {
        builder.importJson(value);
        onClose();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "导入失败。");
      }
      return;
    }
    void navigator.clipboard.writeText(value);
    onClose();
  }

  return (
    <div className="wbv3-dialog-backdrop">
      <div className="wbv3-dialog">
        <div className="wbv3-dialog-title">
          <h2>{mode === "import" ? "导入 JSON" : "导出 JSON"}</h2>
          <button type="button" onClick={onClose}>关闭</button>
        </div>
        <textarea value={value} onChange={(event) => setValue(event.target.value)} />
        <div className="wbv3-dialog-actions">
          <button type="button" onClick={onClose}>取消</button>
          <button type="button" onClick={confirm}>{mode === "import" ? "确认导入" : "复制 JSON"}</button>
        </div>
      </div>
    </div>
  );
}
