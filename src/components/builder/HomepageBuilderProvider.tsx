"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultHomeSections } from "@/data/defaultHomeSections";
import { moduleRegistry } from "@/components/home/sectionRegistry";
import type { HomeSection, HomeSectionType } from "@/types/pageBuilder";
import {
  HOME_BUILDER_STORAGE_KEY,
  cloneSections,
  createDefaultSection,
  duplicateSection,
  insertSection,
  moveSection,
  parseBuilderDocument,
  removeSection,
  toBuilderDocument
} from "./builderUtils";
import { BuilderToolbar } from "./BuilderToolbar";
import { ModulePicker } from "./ModulePicker";
import { SectionEditorPanel } from "./SectionEditorPanel";

type BuilderContextValue = {
  isDev: boolean;
  isBuilderOpen: boolean;
  sections: HomeSection[];
  selectedSectionId: string | null;
  openBuilder: () => void;
  closeBuilder: () => void;
  openPicker: (insertIndex: number) => void;
  addSection: (type: HomeSectionType) => void;
  editSection: (sectionId: string) => void;
  updateSectionProps: (sectionId: string, props: Record<string, unknown>) => void;
  moveSectionById: (sectionId: string, direction: -1 | 1) => void;
  duplicateSectionById: (sectionId: string) => void;
  deleteSectionById: (sectionId: string) => void;
  saveSections: () => void;
  exportSections: () => Promise<void>;
  importSections: (raw: string) => void;
  resetToDefault: () => void;
  clearLocalChanges: () => void;
  statusMessage: string;
};

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function HomepageBuilderProvider({ children }: { children: ReactNode }) {
  const isDev = process.env.NODE_ENV !== "production";
  const [sections, setSections] = useState<HomeSection[]>(() => cloneSections(defaultHomeSections));
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem(HOME_BUILDER_STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      setSections(parseBuilderDocument(raw));
    } catch {
      setSections(cloneSections(defaultHomeSections));
    }
  }, []);

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId) || null,
    [sections, selectedSectionId]
  );

  function prepareBuilderDom() {
    if (typeof window === "undefined") {
      return;
    }
    window.dispatchEvent(new CustomEvent("homepage-builder-before-open"));
  }

  const value = useMemo<BuilderContextValue>(
    () => ({
      isDev,
      isBuilderOpen,
      sections,
      selectedSectionId,
      statusMessage,
      openBuilder: () => {
        prepareBuilderDom();
        setIsBuilderOpen(true);
      },
      closeBuilder: () => {
        setIsBuilderOpen(false);
        setSelectedSectionId(null);
        setInsertIndex(null);
      },
      openPicker: (nextInsertIndex: number) => setInsertIndex(nextInsertIndex),
      addSection: (type: HomeSectionType) => {
        if (insertIndex === null) {
          return;
        }
        const registryItem = moduleRegistry[type];
        const newSection = createDefaultSection(type, registryItem.defaultProps);
        setSections((current) => insertSection(current, newSection, insertIndex));
        setSelectedSectionId(newSection.id);
        setInsertIndex(null);
      },
      editSection: (sectionId: string) => setSelectedSectionId(sectionId),
      updateSectionProps: (sectionId: string, props: Record<string, unknown>) => {
        setSections((current) =>
          current.map((section) => (section.id === sectionId ? { ...section, props } : section))
        );
      },
      moveSectionById: (sectionId: string, direction: -1 | 1) => {
        setSections((current) => moveSection(current, sectionId, direction));
      },
      duplicateSectionById: (sectionId: string) => {
        setSections((current) => duplicateSection(current, sectionId));
      },
      deleteSectionById: (sectionId: string) => {
        if (!window.confirm("确定删除这个模块吗？")) {
          return;
        }
        setSections((current) => removeSection(current, sectionId));
        setSelectedSectionId((current) => (current === sectionId ? null : current));
      },
      saveSections: () => {
        window.localStorage.setItem(HOME_BUILDER_STORAGE_KEY, JSON.stringify(toBuilderDocument(sections), null, 2));
        setStatusMessage("已保存到 localStorage。");
      },
      exportSections: async () => {
        const payload = JSON.stringify(toBuilderDocument(sections), null, 2);
        await navigator.clipboard.writeText(payload);
        setStatusMessage("已复制当前首页 JSON 到剪贴板。");
      },
      importSections: (raw: string) => {
        const nextSections = parseBuilderDocument(raw);
        setSections(nextSections);
        setSelectedSectionId(null);
        setStatusMessage("已导入 JSON，点击保存后会写入 localStorage。");
      },
      resetToDefault: () => {
        if (!window.confirm("确定恢复默认首页吗？这会清除本地 Builder 配置。")) {
          return;
        }
        window.localStorage.removeItem(HOME_BUILDER_STORAGE_KEY);
        setSections(cloneSections(defaultHomeSections));
        setSelectedSectionId(null);
        setStatusMessage("已恢复默认首页。");
      },
      clearLocalChanges: () => {
        window.localStorage.removeItem(HOME_BUILDER_STORAGE_KEY);
        setStatusMessage("已清空本地修改。刷新后会使用默认首页。");
      }
    }),
    [insertIndex, isBuilderOpen, isDev, sections, selectedSectionId, statusMessage]
  );

  return (
    <BuilderContext.Provider value={value}>
      {children}
      {isDev && !isBuilderOpen ? (
        <button
          className="builder-dev-button"
          type="button"
          onClick={() => {
            prepareBuilderDom();
            setIsBuilderOpen(true);
          }}
        >
          开发者
        </button>
      ) : null}
      {isDev && isBuilderOpen ? <BuilderToolbar /> : null}
      {isDev && isBuilderOpen && insertIndex !== null ? (
        <ModulePicker insertIndex={insertIndex} onClose={() => setInsertIndex(null)} />
      ) : null}
      {isDev && isBuilderOpen && selectedSection ? <SectionEditorPanel section={selectedSection} /> : null}
    </BuilderContext.Provider>
  );
}

export function useHomepageBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useHomepageBuilder must be used inside HomepageBuilderProvider.");
  }
  return context;
}
