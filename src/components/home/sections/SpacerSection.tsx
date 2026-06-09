import type { SectionComponentProps } from "@/types/pageBuilder";
import { textProp } from "./sectionHelpers";

export function SpacerSection({ section }: SectionComponentProps) {
  const size = textProp(section.props, "size", "medium");
  return <div aria-hidden="true" className={`home-spacer home-spacer-${size}`} />;
}
