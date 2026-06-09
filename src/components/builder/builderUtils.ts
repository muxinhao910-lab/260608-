import type { BuilderDocument, HomeSection, HomeSectionType } from "@/types/pageBuilder";

export const HOME_BUILDER_STORAGE_KEY = "homepage-builder-sections";

export function cloneSections(sections: HomeSection[]) {
  return JSON.parse(JSON.stringify(sections)) as HomeSection[];
}

export function createSectionId(type: HomeSectionType) {
  return `${type}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function createDefaultSection(type: HomeSectionType, defaultProps: Record<string, unknown>): HomeSection {
  return {
    id: createSectionId(type),
    type,
    props: JSON.parse(JSON.stringify(defaultProps)) as Record<string, unknown>
  };
}

export function insertSection(sections: HomeSection[], section: HomeSection, insertIndex: number) {
  const next = cloneSections(sections);
  const safeIndex = Math.max(0, Math.min(insertIndex, next.length));
  next.splice(safeIndex, 0, section);
  return next;
}

export function moveSection(sections: HomeSection[], sectionId: string, direction: -1 | 1) {
  const next = cloneSections(sections);
  const index = next.findIndex((section) => section.id === sectionId);
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= next.length) {
    return next;
  }
  const [section] = next.splice(index, 1);
  next.splice(targetIndex, 0, section);
  return next;
}

export function duplicateSection(sections: HomeSection[], sectionId: string) {
  const next = cloneSections(sections);
  const index = next.findIndex((section) => section.id === sectionId);
  if (index < 0) {
    return next;
  }
  const copy = cloneSections([next[index]])[0];
  copy.id = createSectionId(copy.type);
  next.splice(index + 1, 0, copy);
  return next;
}

export function removeSection(sections: HomeSection[], sectionId: string) {
  return cloneSections(sections).filter((section) => section.id !== sectionId);
}

export function toBuilderDocument(sections: HomeSection[]): BuilderDocument {
  return {
    pageId: "home",
    version: 1,
    sections: cloneSections(sections)
  };
}

export function parseBuilderDocument(raw: string): HomeSection[] {
  const parsed = JSON.parse(raw) as BuilderDocument | HomeSection[];
  const sections = Array.isArray(parsed) ? parsed : parsed.sections;
  if (!Array.isArray(sections)) {
    throw new Error("JSON 中没有 sections 数组。");
  }
  return sections.map((section, index) => {
    if (!section || typeof section !== "object" || typeof section.type !== "string") {
      throw new Error(`第 ${index + 1} 个模块缺少 type。`);
    }
    return {
      id: typeof section.id === "string" ? section.id : createSectionId(section.type as HomeSectionType),
      type: section.type as HomeSectionType,
      props: section.props && typeof section.props === "object" ? section.props : {}
    };
  });
}
