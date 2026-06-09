import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, textProp } from "./sectionHelpers";

export function StockSearchSection({ section }: SectionComponentProps) {
  const title = textProp(section.props, "title", "股票搜索");
  const placeholder = textProp(section.props, "placeholder", "输入股票代码或公司名称");
  const buttonText = textProp(section.props, "buttonText", "搜索");
  const description = textProp(section.props, "description", "");

  return (
    <SectionShell className="home-stock-search" >
      <div id="search" className="home-section-heading">
        <p>SEARCH</p>
        <h2>{title}</h2>
        {description ? <span>{description}</span> : null}
      </div>
      <form className="home-search-box">
        <input aria-label={title} placeholder={placeholder} type="search" />
        <button type="button">{buttonText}</button>
      </form>
    </SectionShell>
  );
}
