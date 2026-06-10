"use client";

import type { BuilderElement } from "@/types/webBuilder";
import { propNumber, propString } from "./webBuilderUtils";

export function ElementRenderer({ element }: { element: BuilderElement }) {
  const props = element.props;

  switch (element.type) {
    case "Heading":
      return (
        <h2 className="wbv3-reset" style={{ color: propString(props.color, "#ffffff"), fontSize: propNumber(props.fontSize, 44), fontWeight: propNumber(props.fontWeight, 900) }}>
          {propString(props.text, "新的标题")}
        </h2>
      );
    case "Text":
      return <p className="wbv3-reset wbv3-text" style={{ color: propString(props.color, "rgba(255,255,255,.78)"), fontSize: propNumber(props.fontSize, 18) }}>{propString(props.text, "在这里输入一段说明文字。")}</p>;
    case "Button":
      return <a className="wbv3-button" href={propString(props.href, "#")} style={{ background: propString(props.background, "#f36b21"), color: propString(props.color, "#111111") }}>{propString(props.text, "查看详情")}</a>;
    case "Image": {
      const src = propString(props.src);
      return src ? <img className="wbv3-image" src={src} alt={propString(props.alt, "图片")} style={{ objectFit: propString(props.objectFit, "cover") as "cover" | "contain" }} /> : <div className="wbv3-image-placeholder">请在右侧填写图片路径</div>;
    }
    case "SearchBox":
      return (
        <form className="wbv3-search" onSubmit={(event) => event.preventDefault()}>
          <input placeholder={propString(props.placeholder, "搜索公司、产业或关键词")} readOnly />
          <button type="submit">{propString(props.buttonText, "搜索")}</button>
        </form>
      );
    case "Card":
      return (
        <article className="wbv3-card">
          <span>{propString(props.tag, "模块")}</span>
          <h3>{propString(props.title, "卡片标题")}</h3>
          <p>{propString(props.description, "用一段短文字说明这个模块。")}</p>
        </article>
      );
    case "Divider":
      return <div className="wbv3-divider" style={{ borderTopColor: propString(props.color, "rgba(255,255,255,.32)") }} />;
    case "Spacer":
      return <div className="wbv3-spacer" style={{ background: propString(props.background, "rgba(255,255,255,.05)") }} />;
    default:
      return null;
  }
}
