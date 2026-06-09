import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, arrayProp, textProp } from "./sectionHelpers";

export function RiskListSection({ section }: SectionComponentProps) {
  const items = arrayProp<{ title?: string; description?: string; level?: string }>(section.props, "items");

  return (
    <SectionShell>
      <div className="home-section-heading">
        <p>RISKS</p>
        <h2>{textProp(section.props, "title", "风险提示")}</h2>
      </div>
      <div className="home-risk-list">
        {items.map((item, index) => (
          <article className="home-glass-card" key={`${item.title}-${index}`}>
            <small>{item.level || "WATCH"}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
