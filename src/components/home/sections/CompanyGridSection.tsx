import type { SectionComponentProps } from "@/types/pageBuilder";
import { SectionShell, arrayProp, stringList, textProp } from "./sectionHelpers";

export function CompanyGridSection({ section }: SectionComponentProps) {
  const companies = arrayProp<{ name?: string; code?: string; market?: string; description?: string; tags?: unknown }>(section.props, "companies");

  return (
    <SectionShell>
      <div className="home-section-heading">
        <p>COMPANIES</p>
        <h2>{textProp(section.props, "title", "公司卡片")}</h2>
        <span>{textProp(section.props, "subtitle", "")}</span>
      </div>
      <div className="home-card-grid">
        {companies.map((company, index) => (
          <article className="home-glass-card" key={`${company.code}-${index}`}>
            <small>{company.market || "MARKET"} / {company.code}</small>
            <h3>{company.name}</h3>
            <p>{company.description}</p>
            <div className="home-tag-row">
              {stringList(company.tags).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
