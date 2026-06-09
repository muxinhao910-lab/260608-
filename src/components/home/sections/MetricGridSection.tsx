import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, arrayProp, textProp } from "./sectionHelpers";

export function MetricGridSection({ section }: SectionComponentProps) {
  const items = arrayProp<{ label?: string; value?: string; description?: string }>(section.props, "items");

  return (
    <SectionShell>
      <div className="home-section-heading">
        <p>METRICS</p>
        <h2>{textProp(section.props, "title", "关键指标")}</h2>
        <span>{textProp(section.props, "subtitle", "")}</span>
      </div>
      <div className="home-metric-grid">
        {items.map((item, index) => (
          <article className="home-glass-card" key={`${item.label}-${index}`}>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
