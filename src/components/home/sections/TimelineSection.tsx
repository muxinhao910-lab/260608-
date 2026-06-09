import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, arrayProp, textProp } from "./sectionHelpers";

export function TimelineSection({ section }: SectionComponentProps) {
  const items = arrayProp<{ date?: string; title?: string; description?: string }>(section.props, "items");

  return (
    <SectionShell>
      <div className="home-section-heading">
        <p>TIMELINE</p>
        <h2>{textProp(section.props, "title", "产业事件时间线")}</h2>
      </div>
      <div className="home-timeline">
        {items.map((item, index) => (
          <article key={`${item.date}-${index}`}>
            <time>{item.date}</time>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
