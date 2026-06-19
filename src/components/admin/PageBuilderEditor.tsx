"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  createPageBlock,
  defaultPageBlocks,
  getPageBuilderBlocks,
  publishHomeBlocks,
  resetPageBuilderBlocks,
  savePageBuilderBlocks,
  type PageBlock,
  type PageBlockType
} from "@/lib/cms-store";

const blockCatalog: Array<{ type: PageBlockType; label: string; description: string }> = [
  { type: "heading", label: "添加标题", description: "H1 / H2 / H3 标题模块" },
  { type: "paragraph", label: "添加段落文字", description: "正文说明文字" },
  { type: "button", label: "添加按钮", description: "带跳转链接的按钮" },
  { type: "banner", label: "添加条幅 Banner", description: "标题和副标题组合" },
  { type: "card", label: "添加信息卡片", description: "标题和描述卡片" },
  { type: "sector-card", label: "添加板块入口卡片", description: "跳转到产业板块" },
  { type: "divider", label: "添加分割线", description: "视觉分隔模块" }
];

const blockLabels: Record<PageBlockType, string> = {
  heading: "标题",
  paragraph: "段落文字",
  button: "按钮",
  banner: "条幅 Banner",
  card: "信息卡片",
  "sector-card": "板块入口卡片",
  divider: "分割线"
};

type BuilderHrefValidationResult =
  | { ok: true; href: string }
  | { ok: false; message: string };

type BuilderSavePreparationResult =
  | { ok: true; blocks: PageBlock[] }
  | { ok: false; blockId: string; message: string };

const unsafeUrlCharacters = /[\u0000-\u001F\u007F\\]/;

export function validateBuilderHrefInput(value: string): BuilderHrefValidationResult {
  const href = value.trim();

  if (!href) {
    return { ok: false, message: "URL 不能为空。" };
  }

  if (unsafeUrlCharacters.test(href)) {
    return { ok: false, message: "URL 不能包含控制字符或反斜杠。" };
  }

  if (href.startsWith("//")) {
    return { ok: false, message: "URL 不能使用协议相对外部地址（//example.com/path）。" };
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return { ok: true, href };
  }

  try {
    const parsed = new URL(href);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return { ok: true, href: parsed.href };
    }
  } catch {
    return { ok: false, message: "URL 必须以 /、#、http:// 或 https:// 开头。" };
  }

  return { ok: false, message: "URL 只允许站内路径、页面锚点、http:// 或 https://。" };
}

export function preparePageBuilderBlocksForSave(blocks: PageBlock[]): BuilderSavePreparationResult {
  const prepared: PageBlock[] = [];

  for (const block of blocks) {
    if (block.type === "button" || block.type === "sector-card") {
      const validation = validateBuilderHrefInput(block.href);

      if (!validation.ok) {
        return { ok: false, blockId: block.id, message: validation.message };
      }

      prepared.push({ ...block, href: validation.href });
      continue;
    }

    prepared.push(block);
  }

  return { ok: true, blocks: prepared };
}

export function PageBuilderEditor() {
  const [blocks, setBlocks] = useState<PageBlock[]>(defaultPageBlocks);
  const [selectedId, setSelectedId] = useState(defaultPageBlocks[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = getPageBuilderBlocks();
    setBlocks(stored);
    setSelectedId(stored[0]?.id ?? "");
    setFieldErrors({});
  }, []);

  const selectedBlock = useMemo(() => blocks.find((block) => block.id === selectedId) ?? null, [blocks, selectedId]);

  function addBlock(type: PageBlockType) {
    const block = createPageBlock(type);
    setBlocks((current) => [...current, block]);
    setSelectedId(block.id);
    setMessage(`${blockLabels[type]}已添加`);
  }

  function updateBlock(id: string, patch: Record<string, string | number>) {
    setBlocks((current) => current.map((block) => (block.id === id ? ({ ...block, ...patch } as PageBlock) : block)));
    setFieldErrors((current) => {
      if (!current[id]) {
        return current;
      }
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function saveBlocks() {
    const prepared = preparePageBuilderBlocksForSave(blocks);

    if (!prepared.ok) {
      setSelectedId(prepared.blockId);
      setFieldErrors({ [prepared.blockId]: prepared.message });
      setMessage(`保存失败：${prepared.message}`);
      return;
    }

    try {
      savePageBuilderBlocks(prepared.blocks);
      setBlocks(prepared.blocks);
      setFieldErrors({});
      setMessage("草稿已保存。首页不会变化，除非点击发布到首页。");
    } catch {
      setMessage("保存失败：localStorage 写入失败，请检查浏览器存储权限后重试。");
    }
  }

  function publishBlocks() {
    const prepared = preparePageBuilderBlocksForSave(blocks);

    if (!prepared.ok) {
      setSelectedId(prepared.blockId);
      setFieldErrors({ [prepared.blockId]: prepared.message });
      setMessage(`发布失败：${prepared.message}`);
      return;
    }

    try {
      savePageBuilderBlocks(prepared.blocks);
      publishHomeBlocks(prepared.blocks);
      setBlocks(prepared.blocks);
      setFieldErrors({});
      setMessage("已发布到首页。刷新首页后仍会显示当前发布版本。");
    } catch {
      setMessage("发布失败：localStorage 写入失败，请检查浏览器存储权限后重试。");
    }
  }

  function resetBlocks() {
    if (!window.confirm("确定重置 Builder 页面吗？这会恢复默认模块。")) {
      return;
    }
    try {
      const next = resetPageBuilderBlocks();
      setBlocks(next);
      setSelectedId(next[0]?.id ?? "");
      setFieldErrors({});
      setMessage("草稿已重置。已发布首页不会变化，除非再次点击发布到首页。");
    } catch {
      setMessage("保存失败：localStorage 写入失败，重置未完成。");
    }
  }

  return (
    <main className="page-builder-admin">
      <header className="page-builder-header">
        <div>
          <p>WEB BUILDER</p>
          <h1>网站组件编辑器</h1>
          <p className="page-builder-muted">当前编辑内容是 Builder 草稿；保存草稿不会影响首页，发布到首页后才会改变正式首页。</p>
        </div>
        <div className="page-builder-actions">
          {message ? <span>{message}</span> : null}
          <button type="button" onClick={saveBlocks}>保存草稿</button>
          <button type="button" onClick={publishBlocks}>发布到首页</button>
          <button type="button" onClick={resetBlocks}>重置草稿</button>
          <Link href="/">返回首页</Link>
        </div>
      </header>

      <section className="page-builder-grid">
        <aside className="page-builder-library" aria-label="组件库">
          <div className="page-builder-panel-title">
            <p>组件库</p>
            <h2>添加模块</h2>
          </div>
          <div className="page-builder-add-list">
            {blockCatalog.map((item) => (
              <button type="button" key={item.type} onClick={() => addBlock(item.type)}>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="page-builder-preview" aria-label="页面预览区">
          <div className="page-builder-panel-title">
            <p>页面预览区</p>
            <h2>当前模块列表</h2>
          </div>
          <div className="page-builder-canvas">
            {blocks.map((block, index) => (
              <button
                type="button"
                className={`page-builder-block ${selectedId === block.id ? "is-selected" : ""}`}
                key={block.id}
                onClick={() => setSelectedId(block.id)}
              >
                <span className="page-builder-block-index">{String(index + 1).padStart(2, "0")} / {blockLabels[block.type]}</span>
                <BlockPreview block={block} />
              </button>
            ))}
          </div>
        </section>

        <aside className="page-builder-inspector" aria-label="属性编辑区">
          <div className="page-builder-panel-title">
            <p>属性编辑区</p>
            <h2>{selectedBlock ? blockLabels[selectedBlock.type] : "未选择模块"}</h2>
          </div>
          {selectedBlock ? (
            <BlockInspector block={selectedBlock} hrefError={fieldErrors[selectedBlock.id] ?? ""} updateBlock={updateBlock} />
          ) : (
            <p className="page-builder-muted">请先添加或选择一个模块。</p>
          )}
        </aside>
      </section>
    </main>
  );
}

function BlockPreview({ block }: { block: PageBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = `h${block.level}` as "h1" | "h2" | "h3";
      return <Tag>{block.text}</Tag>;
    }
    case "paragraph":
      return <p>{block.text}</p>;
    case "button":
      return <span className="page-builder-button-preview">{block.text} {"->"} {block.href}</span>;
    case "banner":
      return (
        <div className="page-builder-banner-preview">
          <h3>{block.title}</h3>
          <p>{block.subtitle}</p>
        </div>
      );
    case "card":
      return (
        <article className="page-builder-card-preview">
          <h3>{block.title}</h3>
          <p>{block.description}</p>
        </article>
      );
    case "sector-card":
      return (
        <article className="page-builder-card-preview page-builder-sector-preview">
          <h3>{block.title}</h3>
          <p>{block.description}</p>
          <small>{block.href}</small>
        </article>
      );
    case "divider":
      return <hr />;
  }
}

function BlockInspector({
  block,
  hrefError,
  updateBlock
}: {
  block: PageBlock;
  hrefError: string;
  updateBlock: (id: string, patch: Record<string, string | number>) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="page-builder-fields">
          <TextArea label="文案" value={block.text} onChange={(value) => updateBlock(block.id, { text: value })} />
          <label>
            <span>字号级别</span>
            <select value={block.level} onChange={(event) => updateBlock(block.id, { level: Number(event.target.value) })}>
              <option value={1}>h1</option>
              <option value={2}>h2</option>
              <option value={3}>h3</option>
            </select>
          </label>
        </div>
      );
    case "paragraph":
      return <TextArea label="文案" value={block.text} onChange={(value) => updateBlock(block.id, { text: value })} />;
    case "button":
      return (
        <div className="page-builder-fields">
          <TextInput label="按钮文字" value={block.text} onChange={(value) => updateBlock(block.id, { text: value })} />
          <TextInput label="跳转链接" value={block.href} onChange={(value) => updateBlock(block.id, { href: value })} />
          {hrefError ? <p className="page-builder-muted" role="alert">{hrefError}</p> : null}
        </div>
      );
    case "banner":
      return (
        <div className="page-builder-fields">
          <TextInput label="标题" value={block.title} onChange={(value) => updateBlock(block.id, { title: value })} />
          <TextArea label="副标题" value={block.subtitle} onChange={(value) => updateBlock(block.id, { subtitle: value })} />
        </div>
      );
    case "card":
      return (
        <div className="page-builder-fields">
          <TextInput label="标题" value={block.title} onChange={(value) => updateBlock(block.id, { title: value })} />
          <TextArea label="描述" value={block.description} onChange={(value) => updateBlock(block.id, { description: value })} />
        </div>
      );
    case "sector-card":
      return (
        <div className="page-builder-fields">
          <TextInput label="标题" value={block.title} onChange={(value) => updateBlock(block.id, { title: value })} />
          <TextArea label="描述" value={block.description} onChange={(value) => updateBlock(block.id, { description: value })} />
          <TextInput label="href" value={block.href} onChange={(value) => updateBlock(block.id, { href: value })} />
          {hrefError ? <p className="page-builder-muted" role="alert">{hrefError}</p> : null}
        </div>
      );
    case "divider":
      return <p className="page-builder-muted">分割线没有可编辑字段。</p>;
  }
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
