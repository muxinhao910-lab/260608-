import type { ComponentType } from "react";

export type HomeSection = {
  id: string;
  type: HomeSectionType;
  props: Record<string, unknown>;
};

export type HomeSectionType =
  | "hero"
  | "stockSearch"
  | "industryNav"
  | "robotShowcase"
  | "cardGrid"
  | "metricGrid"
  | "companyGrid"
  | "splitImageText"
  | "timeline"
  | "riskList"
  | "cta"
  | "spacer";

export type BuilderDocument = {
  pageId: "home";
  version: 1;
  sections: HomeSection[];
};

export type SectionComponentProps = {
  section: HomeSection;
  index: number;
};

export type SectionEditorProps = {
  section: HomeSection;
  defaultProps: Record<string, unknown>;
  onChange: (props: Record<string, unknown>) => void;
};

export type ModuleRegistryItem = {
  label: string;
  defaultProps: Record<string, unknown>;
  Component: ComponentType<SectionComponentProps>;
  Editor: ComponentType<SectionEditorProps>;
};

export type ModuleRegistry = Record<HomeSectionType, ModuleRegistryItem>;
