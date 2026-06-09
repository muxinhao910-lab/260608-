import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, arrayProp, textProp } from "./sectionHelpers";

export function IndustryNavSection({ section }: SectionComponentProps) {
  const items = arrayProp<{ title?: string; description?: string; href?: string; tag?: string }>(section.props, "items");

  return (
    <SectionShell>
      <div className="home-section-heading">
        <p>INDUSTRY</p>
        <h2>{textProp(section.props, "title", "产业链入口")}</h2>
        <span>{textProp(section.props, "subtitle", "")}</span>
      </div>
      <div className="home-card-grid">
        {items.map((item, index) => (
          <a className="home-glass-card" href={item.href || "#"} key={`${item.title}-${index}`}>
            <small>{item.tag || "ENTRY"}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}
