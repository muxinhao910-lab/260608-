"use client";

import { useWebBuilder } from "./WebBuilderProvider";

export function BuilderToolbar() {
  const builder = useWebBuilder();

  return (
    <header className="wbv3-toolbar">
      <strong>首页 Builder</strong>
      <button type="button" onClick={builder.save}>保存</button>
      <button type="button" onClick={builder.reset}>重置为原首页</button>
      <button type="button" onClick={builder.clearLegacyData}>清除旧 Builder 数据</button>
      <button type="button" onClick={builder.closeBuilder}>退出开发者模式</button>
      {builder.status ? <span>{builder.status}</span> : null}
      <em>建议在桌面端使用 Builder 模式。</em>
    </header>
  );
}
