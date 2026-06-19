"use client";

import { useEffect, useState } from "react";
import {
  credibilityRules as seedCredibilityRules,
  robotCompanies,
  sourceTypeLabels,
  type ChainSegment,
  type SourceType,
  type ValidationStage
} from "@/lib/radar-data";

export type MarketType = "A股" | "港股" | "美股" | "ETF";

export type SectorRecord = {
  id: string;
  order: number;
  number: string;
  title: string;
  slug: string;
  path: string;
  summary: string;
  status: "active" | "reserved";
};

export type CompanyRecord = {
  id: string;
  stockCode: string;
  stockName: string;
  marketType: MarketType;
  sectorId: string;
  oneLineLogic: string;
  currentStage: ValidationStage;
  chainPosition: string;
  coreMetrics: string[];
  marketFocus: string;
  riskTips: string[];
  relatedCompanies: string[];
  chainSegment: ChainSegment;
  latestInfoFlow: string[];
  mapPoint: {
    part: string;
    x: number;
    y: number;
    z: number;
    labelX: number;
    labelY: number;
  };
  tracking: {
    newCustomers: string;
    newOrders: string;
    robotRevenueShare: string;
    grossMarginChange: string;
    capacityExpansion: string;
    enteredTopCustomerSupplyChain: "已进入" | "验证中" | "未确认";
  };
};

export type InfoCardType = "客户" | "订单" | "收入占比" | "毛利率" | "产能" | "宏观" | "ETF" | "行业价格";

export type InfoCardRecord = {
  id: string;
  companyId: string;
  type: InfoCardType;
  title: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: SourceType;
  credibilityScore: number;
  credibilityNote: string;
  publishedAt: string;
};

export type CredibilityRuleRecord = {
  id: string;
  sourceType: string;
  baseScore: number;
  bonusRule: string;
  penaltyRule: string;
};

export type SiteData = {
  home: {
    title: string;
    subtitle: string;
    intro: string;
  };
  sectors: SectorRecord[];
  companies: CompanyRecord[];
  infoCards: InfoCardRecord[];
  credibilityRules: CredibilityRuleRecord[];
};

export type PageBlock =
  | { id: string; type: "heading"; text: string; level: 1 | 2 | 3 }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "button"; text: string; href: string }
  | { id: string; type: "banner"; title: string; subtitle: string }
  | { id: string; type: "card"; title: string; description: string }
  | { id: string; type: "sector-card"; title: string; description: string; href: string }
  | { id: string; type: "divider" };

export type PageBlockType = PageBlock["type"];

export type HomeEditorPageType = "flow" | "free";

export type HomeEditorModule =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "button"; text: string; href: string }
  | { id: string; type: "decoration"; label: string };

export type HomeEditorModuleType = HomeEditorModule["type"];

export type HomeEditorState = {
  pageId: "home";
  pageType: HomeEditorPageType;
  modules: HomeEditorModule[];
};

const STORE_KEY = "chain-radar-cms-v1";
const PAGE_BUILDER_BLOCKS_KEY = "chain-radar-page-builder-blocks-v1";
const HOME_EDITOR_STATE_KEY = "chain-radar-home-editor-state-v1";

const robotSectorId = "robotics";

export const defaultSiteData: SiteData = {
  home: {
    title: "产业链投资研究雷达",
    subtitle: "未来科技展览馆式产业链研究系统",
    intro: "不以 K 线为核心，先看产业链位置、长期跟踪指标、信息来源和可信度。第一阶段聚焦机器人板块，后续接入光模块、半导体和 AI。"
  },
  sectors: [
    {
      id: "robotics",
      order: 1,
      number: "01",
      title: "机器人板块",
      slug: "robotics",
      path: "/sector/robotics",
      summary: "进入 3D 机器人产业链雷达，查看公司在机器人不同部位中的位置。",
      status: "active"
    },
    {
      id: "semiconductor",
      order: 2,
      number: "02",
      title: "半导体板块",
      slug: "semiconductor",
      path: "/sector/semiconductor",
      summary: "设备、材料、先进封装与国产替代链条，下一阶段接入。",
      status: "reserved"
    },
    {
      id: "ai",
      order: 3,
      number: "03",
      title: "AI板块",
      slug: "ai",
      path: "/sector/ai",
      summary: "算力、模型、应用与数据基础设施，后续扩展。",
      status: "reserved"
    },
    {
      id: "optical-module",
      order: 4,
      number: "04",
      title: "光模块板块",
      slug: "optical-module",
      path: "/sector/optical-module",
      summary: "光芯片、光器件、光模块、交换机链条，后续扩展为光通信研究雷达。",
      status: "reserved"
    }
  ],
  companies: robotCompanies.map((company) => ({
    id: company.code,
    stockCode: company.code,
    stockName: company.name,
    marketType: company.code.startsWith("6") || company.code.startsWith("0") ? "A股" : "A股",
    sectorId: robotSectorId,
    oneLineLogic: company.oneLineLogic,
    currentStage: company.tracking.validationStage,
    chainPosition: company.chainPosition,
    coreMetrics: company.longTermMetrics,
    marketFocus: company.marketFocus,
    riskTips: company.riskTips,
    relatedCompanies: robotCompanies.filter((peer) => peer.chainSegment === company.chainSegment && peer.code !== company.code).map((peer) => peer.name),
    chainSegment: company.chainSegment,
    latestInfoFlow: company.latestInfoFlow,
    mapPoint: company.mapPoint,
    tracking: {
      newCustomers: company.tracking.newCustomers,
      newOrders: company.tracking.newOrders,
      robotRevenueShare: company.tracking.robotRevenueShare,
      grossMarginChange: company.tracking.grossMarginChange,
      capacityExpansion: company.tracking.capacityExpansion,
      enteredTopCustomerSupplyChain: company.tracking.enteredTopCustomerSupplyChain
    }
  })),
  infoCards: robotCompanies.flatMap((company) =>
    company.sources.map((source, index) => ({
      id: `${company.code}-${index + 1}`,
      companyId: company.code,
      type: index === 0 ? "宏观" : "客户",
      title: `${company.shortName} 信息源 ${index + 1}`,
      body: "第一版先使用官方信息入口和 mock tracking 字段。无法确认的新增客户、订单和收入占比不写成事实，等待公告、年报、季报、IR 或互动平台确认。",
      sourceName: source.label,
      sourceUrl: source.url,
      sourceType: source.type,
      credibilityScore: source.credibility,
      credibilityNote: `${sourceTypeLabels[source.type]} 默认可信度区间内，后续接入真实内容后按披露粒度重新打分。`,
      publishedAt: "2026-06-08"
    }))
  ),
  credibilityRules: seedCredibilityRules.map((rule, index) => ({
    id: `rule-${index + 1}`,
    sourceType: rule.type,
    baseScore: Number(rule.range.split("-")[0]),
    bonusRule: "信息包含明确公司主体、业务口径、时间、数量或财务指标时加分。",
    penaltyRule: "信息无法追溯原文、只来自二手转述、缺少时间或主体时扣分。"
  }))
};

export const defaultPageBlocks: PageBlock[] = [
  {
    id: "builder-default-banner",
    type: "banner",
    title: "个人网站视觉编辑器",
    subtitle: "从左侧添加组件，在中间预览，并在右侧编辑属性。"
  },
  {
    id: "builder-default-heading",
    type: "heading",
    text: "产业链研究首页草稿",
    level: 1
  },
  {
    id: "builder-default-paragraph",
    type: "paragraph",
    text: "这里保存的是 Builder 独立草稿，本轮不会覆盖正式首页。"
  }
];

function cloneDefault(): SiteData {
  return JSON.parse(JSON.stringify(defaultSiteData)) as SiteData;
}

export function getSiteData(): SiteData {
  if (typeof window === "undefined") {
    return cloneDefault();
  }
  if (!window.localStorage) {
    return cloneDefault();
  }
  const raw = window.localStorage.getItem(STORE_KEY);
  if (!raw) {
    const seeded = cloneDefault();
    window.localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as SiteData;
  } catch {
    const seeded = cloneDefault();
    window.localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveSiteData(data: SiteData) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("chain-radar-data-change"));
}

export function resetSiteData() {
  saveSiteData(cloneDefault());
}

export function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function cloneDefaultPageBlocks(): PageBlock[] {
  return JSON.parse(JSON.stringify(defaultPageBlocks)) as PageBlock[];
}

function normalizePageBlock(value: unknown): PageBlock | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const block = value as Partial<PageBlock>;
  if (typeof block.id !== "string" || typeof block.type !== "string") {
    return null;
  }

  switch (block.type) {
    case "heading": {
      const level = block.level === 1 || block.level === 2 || block.level === 3 ? block.level : 2;
      return { id: block.id, type: "heading", text: typeof block.text === "string" ? block.text : "新标题", level };
    }
    case "paragraph":
      return { id: block.id, type: "paragraph", text: typeof block.text === "string" ? block.text : "新段落文字" };
    case "button":
      return {
        id: block.id,
        type: "button",
        text: typeof block.text === "string" ? block.text : "查看详情",
        href: typeof block.href === "string" ? block.href : "#"
      };
    case "banner":
      return {
        id: block.id,
        type: "banner",
        title: typeof block.title === "string" ? block.title : "条幅标题",
        subtitle: typeof block.subtitle === "string" ? block.subtitle : "条幅副标题"
      };
    case "card":
      return {
        id: block.id,
        type: "card",
        title: typeof block.title === "string" ? block.title : "信息卡片",
        description: typeof block.description === "string" ? block.description : "卡片描述"
      };
    case "sector-card":
      return {
        id: block.id,
        type: "sector-card",
        title: typeof block.title === "string" ? block.title : "板块入口",
        description: typeof block.description === "string" ? block.description : "板块说明",
        href: typeof block.href === "string" ? block.href : "/sector/robotics"
      };
    case "divider":
      return { id: block.id, type: "divider" };
    default:
      return null;
  }
}

export function getPageBuilderBlocks(): PageBlock[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return cloneDefaultPageBlocks();
  }

  const raw = window.localStorage.getItem(PAGE_BUILDER_BLOCKS_KEY);
  if (!raw) {
    return cloneDefaultPageBlocks();
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return cloneDefaultPageBlocks();
    }
    const blocks = parsed.map(normalizePageBlock).filter((block): block is PageBlock => Boolean(block));
    return blocks.length ? blocks : cloneDefaultPageBlocks();
  } catch {
    return cloneDefaultPageBlocks();
  }
}

export function savePageBuilderBlocks(blocks: PageBlock[]) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  window.localStorage.setItem(PAGE_BUILDER_BLOCKS_KEY, JSON.stringify(blocks));
}

export function resetPageBuilderBlocks() {
  const blocks = cloneDefaultPageBlocks();
  savePageBuilderBlocks(blocks);
  return blocks;
}

export function createPageBlock(type: PageBlockType): PageBlock {
  const id = createId(`builder-${type}`);
  switch (type) {
    case "heading":
      return { id, type, text: "新标题", level: 2 };
    case "paragraph":
      return { id, type, text: "这里输入段落文字。" };
    case "button":
      return { id, type, text: "查看详情", href: "/" };
    case "banner":
      return { id, type, title: "条幅标题", subtitle: "这里输入条幅副标题。" };
    case "card":
      return { id, type, title: "信息卡片", description: "这里输入信息卡片描述。" };
    case "sector-card":
      return { id, type, title: "板块入口卡片", description: "点击进入对应产业板块。", href: "/sector/robotics" };
    case "divider":
      return { id, type };
  }
}

export const defaultHomeEditorState: HomeEditorState = {
  pageId: "home",
  pageType: "flow",
  modules: []
};

function cloneDefaultHomeEditorState(): HomeEditorState {
  return JSON.parse(JSON.stringify(defaultHomeEditorState)) as HomeEditorState;
}

function normalizeHomeEditorModule(value: unknown): HomeEditorModule | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const module = value as Partial<HomeEditorModule>;
  if (typeof module.id !== "string" || typeof module.type !== "string") {
    return null;
  }

  switch (module.type) {
    case "text":
      return { id: module.id, type: "text", text: typeof module.text === "string" ? module.text : "新文字模块" };
    case "button":
      return {
        id: module.id,
        type: "button",
        text: typeof module.text === "string" ? module.text : "按钮",
        href: typeof module.href === "string" ? module.href : "/"
      };
    case "decoration":
      return { id: module.id, type: "decoration", label: typeof module.label === "string" ? module.label : "装饰块" };
    default:
      return null;
  }
}

export function normalizeHomeEditorState(value: unknown): HomeEditorState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return cloneDefaultHomeEditorState();
  }

  const state = value as Partial<HomeEditorState>;
  const modules = Array.isArray(state.modules)
    ? state.modules.map(normalizeHomeEditorModule).filter((module): module is HomeEditorModule => Boolean(module))
    : [];

  return {
    pageId: "home",
    pageType: state.pageType === "free" ? "free" : "flow",
    modules
  };
}

export function getHomeEditorState(): HomeEditorState {
  if (typeof window === "undefined" || !window.localStorage) {
    return cloneDefaultHomeEditorState();
  }

  const raw = window.localStorage.getItem(HOME_EDITOR_STATE_KEY);
  if (!raw) {
    return cloneDefaultHomeEditorState();
  }

  try {
    return normalizeHomeEditorState(JSON.parse(raw));
  } catch {
    return cloneDefaultHomeEditorState();
  }
}

export function saveHomeEditorState(state: HomeEditorState) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  window.localStorage.setItem(HOME_EDITOR_STATE_KEY, JSON.stringify(normalizeHomeEditorState(state)));
}

export function createHomeEditorModule(type: HomeEditorModuleType): HomeEditorModule {
  const id = createId(`home-${type}`);
  switch (type) {
    case "text":
      return { id, type, text: "新文字模块" };
    case "button":
      return { id, type, text: "新按钮", href: "/" };
    case "decoration":
      return { id, type, label: "装饰块" };
  }
}

export function useSiteDataStore() {
  const [data, setData] = useState<SiteData>(() => getSiteData());

  useEffect(() => {
    const sync = () => setData(getSiteData());
    window.addEventListener("storage", sync);
    window.addEventListener("chain-radar-data-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("chain-radar-data-change", sync);
    };
  }, []);

  function update(next: SiteData) {
    saveSiteData(next);
    setData(next);
  }

  return { data, update, reset: resetSiteData };
}
