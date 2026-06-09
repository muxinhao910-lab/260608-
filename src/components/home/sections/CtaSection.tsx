import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, textProp } from "./sectionHelpers";

export function CtaSection({ section }: SectionComponentProps) {
  return (
    <SectionShell className="home-cta">
      <p className="home-kicker">NEXT STEP</p>
      <h2>{textProp(section.props, "title", "继续探索产业变量")}</h2>
      <p>{textProp(section.props, "subtitle", "")}</p>
      <a className="home-section-link" href={textProp(section.props, "buttonHref", "#")}>
        {textProp(section.props, "buttonText", "查看")}
      </a>
    </SectionShell>
  );
}
