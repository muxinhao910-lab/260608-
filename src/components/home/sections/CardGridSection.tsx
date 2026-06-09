import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, arrayProp, textProp } from "./sectionHelpers";

export function CardGridSection({ section }: SectionComponentProps) {
  const items = arrayProp<{ title?: string; description?: string; tag?: string }>(section.props, "items");

  return (
    <SectionShell>
      <div className="home-section-heading">
        <p>CARDS</p>
        <h2>{textProp(section.props, "title", "卡片组")}</h2>
        <span>{textProp(section.props, "subtitle", "")}</span>
      </div>
      <div className="home-card-grid">
        {items.map((item, index) => (
          <article className="home-glass-card" key={`${item.title}-${index}`}>
            <small>{item.tag || "CARD"}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
