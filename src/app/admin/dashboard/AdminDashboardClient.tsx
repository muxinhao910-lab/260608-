"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createId,
  defaultSiteData,
  isValidUrl,
  type CompanyRecord,
  type CredibilityRuleRecord,
  type InfoCardRecord,
  type InfoCardType,
  type MarketType,
  type SectorRecord,
  type SiteData,
  useSiteDataStore
} from "@/lib/cms-store";
import type { ChainSegment, SourceType, ValidationStage } from "@/lib/radar-data";

type AdminTab = "home" | "sectors" | "companies" | "cards" | "rules";

const tabs: Array<{ id: AdminTab; label: string }> = [
  { id: "home", label: "首页内容" },
  { id: "sectors", label: "产业板块" },
  { id: "companies", label: "公司信息" },
  { id: "cards", label: "信息卡片" },
  { id: "rules", label: "可信度规则" }
];

const marketTypes: MarketType[] = ["A股", "港股", "美股", "ETF"];
const stages: ValidationStage[] = ["送样", "小批量", "定点", "量产"];
const chainSegments: ChainSegment[] = ["关节与减速器", "丝杠与轴承", "电机与执行器", "力传感器", "视觉感知", "精密传动"];
const infoTypes: InfoCardType[] = ["客户", "订单", "收入占比", "毛利率", "产能", "宏观", "ETF", "行业价格"];
const sourceTypes: SourceType[] = ["exchange_report", "ir_record", "interactive_reply", "broker_report", "finance_media", "social_media", "forum_rumor"];

export default function AdminDashboardClient() {
  const { data, update, reset } = useSiteDataStore();
  const [tab, setTab] = useState<AdminTab>("home");
  const [message, setMessage] = useState("");

  function save(next: SiteData, text = "已保存") {
    update(next);
    setMessage(text);
    window.setTimeout(() => setMessage(""), 1800);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-6 text-white md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">local cms / supabase ready structure</p>
            <h1 className="mt-2 font-serif text-5xl font-black leading-none md:text-7xl">Admin Panel</h1>
          </div>
          <div className="flex gap-2">
            <a className="border border-white/20 px-4 py-3 font-mono text-xs uppercase tracking-normal hover:border-[#f36b21] hover:text-[#f36b21]" href="/">前台首页</a>
            <a className="border border-white/20 px-4 py-3 font-mono text-xs uppercase tracking-normal hover:border-[#f36b21] hover:text-[#f36b21]" href="/admin/logout">退出</a>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="border-2 border-white/20 bg-white/[.06] p-4">
            <nav className="grid gap-2">
              {tabs.map((item) => (
                <button
                  className={`border px-4 py-3 text-left font-mono text-xs uppercase tracking-normal ${
                    tab === item.id ? "border-[#f36b21] bg-[#f36b21] text-black" : "border-white/16 bg-black/30 text-white hover:border-[#f36b21]"
                  }`}
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <button
              className="mt-6 w-full border border-white/20 px-4 py-3 font-mono text-xs uppercase tracking-normal text-white/70 hover:border-[#f36b21] hover:text-[#f36b21]"
              onClick={() => {
                reset();
                setMessage("已恢复默认 mock data");
              }}
              type="button"
            >
              重置默认数据
            </button>
          </aside>

          <section className="min-h-[720px] border-2 border-white/20 bg-white/[.06] p-5 shadow-[0_0_80px_rgba(243,107,33,.12)] md:p-6">
            {message ? <div className="mb-4 border border-[#f36b21] bg-[#f36b21]/10 p-3 font-mono text-xs text-[#f36b21]">{message}</div> : null}
            {tab === "home" ? <HomeEditor data={data} save={save} /> : null}
            {tab === "sectors" ? <SectorEditor data={data} save={save} /> : null}
            {tab === "companies" ? <CompanyEditor data={data} save={save} /> : null}
            {tab === "cards" ? <InfoCardEditor data={data} save={save} /> : null}
            {tab === "rules" ? <RuleEditor data={data} save={save} /> : null}
          </section>
        </div>
      </div>
    </main>
  );
}

function HomeEditor({ data, save }: { data: SiteData; save: (data: SiteData, text?: string) => void }) {
  const [draft, setDraft] = useState(data.home);
  const [error, setError] = useState("");

  useEffect(() => setDraft(data.home), [data.home]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.subtitle.trim() || !draft.intro.trim()) {
      setError("标题、副标题、介绍文案不能为空。");
      return;
    }
    setError("");
    save({ ...data, home: draft });
  }

  return (
    <AdminForm title="首页内容" onSubmit={submit} error={error}>
      <TextInput label="首页标题" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
      <TextInput label="副标题" value={draft.subtitle} onChange={(value) => setDraft({ ...draft, subtitle: value })} />
      <TextArea label="首页介绍文案" value={draft.intro} onChange={(value) => setDraft({ ...draft, intro: value })} />
    </AdminForm>
  );
}

function SectorEditor({ data, save }: { data: SiteData; save: (data: SiteData, text?: string) => void }) {
  const sorted = [...data.sectors].sort((a, b) => a.order - b.order);
  const [activeId, setActiveId] = useState(sorted[0]?.id ?? "");
  const active = data.sectors.find((sector) => sector.id === activeId) ?? sorted[0];
  const [draft, setDraft] = useState<SectorRecord>(active);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = data.sectors.find((sector) => sector.id === activeId) ?? sorted[0];
    if (next) setDraft(next);
  }, [activeId, data.sectors, sorted]);

  function upsert(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.slug.trim() || !draft.path.trim()) {
      setError("板块标题、slug、path 不能为空。");
      return;
    }
    setError("");
    const exists = data.sectors.some((sector) => sector.id === draft.id);
    const sectors = exists ? data.sectors.map((sector) => (sector.id === draft.id ? draft : sector)) : [...data.sectors, draft];
    save({ ...data, sectors });
    setActiveId(draft.id);
  }

  function add() {
    const id = createId("sector");
    const next: SectorRecord = {
      id,
      order: data.sectors.length + 1,
      number: String(data.sectors.length + 1).padStart(2, "0"),
      title: "新板块",
      slug: id,
      path: `/sector/${id}`,
      summary: "请输入板块说明。",
      status: "reserved"
    };
    setActiveId(id);
    setDraft(next);
  }

  function remove() {
    if (draft.id === "robotics") {
      setError("机器人板块是第一阶段核心板块，暂不允许删除。");
      return;
    }
    save({ ...data, sectors: data.sectors.filter((sector) => sector.id !== draft.id) }, "已删除板块");
  }

  return (
    <div>
      <AdminHeader title="产业板块管理" actionLabel="新增板块" onAction={add} />
      <RecordChooser records={sorted.map((sector) => ({ id: sector.id, label: `${sector.number}${sector.title}` }))} activeId={activeId} setActiveId={setActiveId} />
      <AdminForm title="编辑板块" onSubmit={upsert} error={error} secondary={<button className="admin-danger" onClick={remove} type="button">删除</button>}>
        <TextInput label="排序" value={String(draft.order)} onChange={(value) => setDraft({ ...draft, order: Number(value) || 0 })} />
        <TextInput label="编号" value={draft.number} onChange={(value) => setDraft({ ...draft, number: value })} />
        <TextInput label="标题" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
        <TextInput label="Slug" value={draft.slug} onChange={(value) => setDraft({ ...draft, slug: value, path: `/sector/${value}` })} />
        <TextInput label="路径" value={draft.path} onChange={(value) => setDraft({ ...draft, path: value })} />
        <TextArea label="说明" value={draft.summary} onChange={(value) => setDraft({ ...draft, summary: value })} />
        <SelectInput label="状态" value={draft.status} options={["active", "reserved"]} onChange={(value) => setDraft({ ...draft, status: value as SectorRecord["status"] })} />
      </AdminForm>
    </div>
  );
}

function CompanyEditor({ data, save }: { data: SiteData; save: (data: SiteData, text?: string) => void }) {
  const [activeId, setActiveId] = useState(data.companies[0]?.id ?? "");
  const active = data.companies.find((company) => company.id === activeId) ?? data.companies[0];
  const [draft, setDraft] = useState<CompanyRecord>(active);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = data.companies.find((company) => company.id === activeId) ?? data.companies[0];
    if (next) setDraft(next);
  }, [activeId, data.companies]);

  function upsert(event: FormEvent) {
    event.preventDefault();
    if (!draft.stockCode.trim() || !draft.stockName.trim() || !draft.oneLineLogic.trim()) {
      setError("股票代码、股票名称、一句话投资逻辑不能为空。");
      return;
    }
    setError("");
    const exists = data.companies.some((company) => company.id === draft.id);
    const companies = exists ? data.companies.map((company) => (company.id === draft.id ? draft : company)) : [...data.companies, draft];
    save({ ...data, companies });
    setActiveId(draft.id);
  }

  function add() {
    const id = createId("company");
    const base = defaultSiteData.companies[0];
    const next: CompanyRecord = {
      ...base,
      id,
      stockCode: "",
      stockName: "新公司",
      oneLineLogic: "请输入一句话投资逻辑。",
      relatedCompanies: [],
      coreMetrics: [],
      riskTips: [],
      latestInfoFlow: []
    };
    setActiveId(id);
    setDraft(next);
  }

  function remove() {
    save({ ...data, companies: data.companies.filter((company) => company.id !== draft.id), infoCards: data.infoCards.filter((card) => card.companyId !== draft.id) }, "已删除公司");
  }

  return (
    <div>
      <AdminHeader title="公司信息管理" actionLabel="新增公司" onAction={add} />
      <RecordChooser records={data.companies.map((company) => ({ id: company.id, label: `${company.stockCode || "未填代码"} ${company.stockName}` }))} activeId={activeId} setActiveId={setActiveId} />
      <AdminForm title="编辑公司" onSubmit={upsert} error={error} secondary={<button className="admin-danger" onClick={remove} type="button">删除</button>}>
        <TextInput label="股票代码" value={draft.stockCode} onChange={(value) => setDraft({ ...draft, stockCode: value })} />
        <TextInput label="股票名称" value={draft.stockName} onChange={(value) => setDraft({ ...draft, stockName: value })} />
        <SelectInput label="市场类型" value={draft.marketType} options={marketTypes} onChange={(value) => setDraft({ ...draft, marketType: value as MarketType })} />
        <SelectInput label="所属产业板块" value={draft.sectorId} options={data.sectors.map((sector) => sector.id)} labels={Object.fromEntries(data.sectors.map((sector) => [sector.id, sector.title]))} onChange={(value) => setDraft({ ...draft, sectorId: value })} />
        <TextArea label="一句话投资逻辑" value={draft.oneLineLogic} onChange={(value) => setDraft({ ...draft, oneLineLogic: value })} />
        <SelectInput label="当前阶段" value={draft.currentStage} options={stages} onChange={(value) => setDraft({ ...draft, currentStage: value as ValidationStage })} />
        <SelectInput label="产业链环节" value={draft.chainSegment} options={chainSegments} onChange={(value) => setDraft({ ...draft, chainSegment: value as ChainSegment })} />
        <TextArea label="产业链位置" value={draft.chainPosition} onChange={(value) => setDraft({ ...draft, chainPosition: value })} />
        <TextArea label="核心观察指标（每行一个）" value={draft.coreMetrics.join("\n")} onChange={(value) => setDraft({ ...draft, coreMetrics: lines(value) })} />
        <TextArea label="风险提示（每行一个）" value={draft.riskTips.join("\n")} onChange={(value) => setDraft({ ...draft, riskTips: lines(value) })} />
        <TextArea label="关联公司（每行一个）" value={draft.relatedCompanies.join("\n")} onChange={(value) => setDraft({ ...draft, relatedCompanies: lines(value) })} />
      </AdminForm>
    </div>
  );
}

function InfoCardEditor({ data, save }: { data: SiteData; save: (data: SiteData, text?: string) => void }) {
  const [activeId, setActiveId] = useState(data.infoCards[0]?.id ?? "");
  const active = data.infoCards.find((card) => card.id === activeId) ?? data.infoCards[0];
  const [draft, setDraft] = useState<InfoCardRecord>(active);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = data.infoCards.find((card) => card.id === activeId) ?? data.infoCards[0];
    if (next) setDraft(next);
  }, [activeId, data.infoCards]);

  function upsert(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.companyId.trim()) {
      setError("信息标题和关联公司不能为空。");
      return;
    }
    if (!isValidUrl(draft.sourceUrl)) {
      setError("来源链接必须是有效 http/https URL。");
      return;
    }
    if (draft.credibilityScore < 0 || draft.credibilityScore > 100) {
      setError("可信度分数必须在 0-100 之间。");
      return;
    }
    setError("");
    const exists = data.infoCards.some((card) => card.id === draft.id);
    const infoCards = exists ? data.infoCards.map((card) => (card.id === draft.id ? draft : card)) : [...data.infoCards, draft];
    save({ ...data, infoCards });
    setActiveId(draft.id);
  }

  function add() {
    const id = createId("card");
    const next: InfoCardRecord = {
      id,
      companyId: data.companies[0]?.id ?? "",
      type: "客户",
      title: "新信息卡片",
      body: "请输入信息正文。",
      sourceName: "来源名称",
      sourceUrl: "https://www.sse.com.cn/",
      sourceType: "exchange_report",
      credibilityScore: 95,
      credibilityNote: "官方披露入口，等待接入真实原文后复核。",
      publishedAt: new Date().toISOString().slice(0, 10)
    };
    setActiveId(id);
    setDraft(next);
  }

  function remove() {
    save({ ...data, infoCards: data.infoCards.filter((card) => card.id !== draft.id) }, "已删除信息卡片");
  }

  return (
    <div>
      <AdminHeader title="信息卡片管理" actionLabel="新增卡片" onAction={add} />
      <RecordChooser records={data.infoCards.map((card) => ({ id: card.id, label: `${card.type} / ${card.title}` }))} activeId={activeId} setActiveId={setActiveId} />
      <AdminForm title="编辑信息卡片" onSubmit={upsert} error={error} secondary={<button className="admin-danger" onClick={remove} type="button">删除</button>}>
        <SelectInput label="关联公司" value={draft.companyId} options={data.companies.map((company) => company.id)} labels={Object.fromEntries(data.companies.map((company) => [company.id, `${company.stockCode} ${company.stockName}`]))} onChange={(value) => setDraft({ ...draft, companyId: value })} />
        <SelectInput label="信息类型" value={draft.type} options={infoTypes} onChange={(value) => setDraft({ ...draft, type: value as InfoCardType })} />
        <TextInput label="信息标题" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
        <TextArea label="信息正文" value={draft.body} onChange={(value) => setDraft({ ...draft, body: value })} />
        <TextInput label="来源名称" value={draft.sourceName} onChange={(value) => setDraft({ ...draft, sourceName: value })} />
        <TextInput label="来源链接" value={draft.sourceUrl} onChange={(value) => setDraft({ ...draft, sourceUrl: value })} />
        <SelectInput label="来源类型" value={draft.sourceType} options={sourceTypes} onChange={(value) => setDraft({ ...draft, sourceType: value as SourceType })} />
        <TextInput label="可信度分数" value={String(draft.credibilityScore)} onChange={(value) => setDraft({ ...draft, credibilityScore: Number(value) || 0 })} />
        <TextArea label="可信度说明" value={draft.credibilityNote} onChange={(value) => setDraft({ ...draft, credibilityNote: value })} />
        <TextInput label="发布时间" value={draft.publishedAt} onChange={(value) => setDraft({ ...draft, publishedAt: value })} />
      </AdminForm>
    </div>
  );
}

function RuleEditor({ data, save }: { data: SiteData; save: (data: SiteData, text?: string) => void }) {
  const [activeId, setActiveId] = useState(data.credibilityRules[0]?.id ?? "");
  const active = data.credibilityRules.find((rule) => rule.id === activeId) ?? data.credibilityRules[0];
  const [draft, setDraft] = useState<CredibilityRuleRecord>(active);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = data.credibilityRules.find((rule) => rule.id === activeId) ?? data.credibilityRules[0];
    if (next) setDraft(next);
  }, [activeId, data.credibilityRules]);

  function upsert(event: FormEvent) {
    event.preventDefault();
    if (!draft.sourceType.trim()) {
      setError("来源类型不能为空。");
      return;
    }
    if (draft.baseScore < 0 || draft.baseScore > 100) {
      setError("默认基础分必须在 0-100 之间。");
      return;
    }
    setError("");
    const exists = data.credibilityRules.some((rule) => rule.id === draft.id);
    const credibilityRules = exists ? data.credibilityRules.map((rule) => (rule.id === draft.id ? draft : rule)) : [...data.credibilityRules, draft];
    save({ ...data, credibilityRules });
    setActiveId(draft.id);
  }

  function add() {
    const id = createId("rule");
    const next: CredibilityRuleRecord = { id, sourceType: "新来源类型", baseScore: 70, bonusRule: "请输入加分规则。", penaltyRule: "请输入扣分规则。" };
    setActiveId(id);
    setDraft(next);
  }

  function remove() {
    save({ ...data, credibilityRules: data.credibilityRules.filter((rule) => rule.id !== draft.id) }, "已删除规则");
  }

  return (
    <div>
      <AdminHeader title="可信度评分规则" actionLabel="新增规则" onAction={add} />
      <RecordChooser records={data.credibilityRules.map((rule) => ({ id: rule.id, label: `${rule.sourceType} / ${rule.baseScore}` }))} activeId={activeId} setActiveId={setActiveId} />
      <AdminForm title="编辑规则" onSubmit={upsert} error={error} secondary={<button className="admin-danger" onClick={remove} type="button">删除</button>}>
        <TextInput label="来源类型" value={draft.sourceType} onChange={(value) => setDraft({ ...draft, sourceType: value })} />
        <TextInput label="默认基础分" value={String(draft.baseScore)} onChange={(value) => setDraft({ ...draft, baseScore: Number(value) || 0 })} />
        <TextArea label="加分规则" value={draft.bonusRule} onChange={(value) => setDraft({ ...draft, bonusRule: value })} />
        <TextArea label="扣分规则" value={draft.penaltyRule} onChange={(value) => setDraft({ ...draft, penaltyRule: value })} />
      </AdminForm>
    </div>
  );
}

function AdminHeader({ title, actionLabel, onAction }: { title: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-serif text-4xl font-black leading-none">{title}</h2>
      <button className="border border-[#f36b21] bg-[#f36b21] px-4 py-3 font-mono text-xs uppercase tracking-normal text-black hover:bg-white" onClick={onAction} type="button">
        {actionLabel}
      </button>
    </div>
  );
}

function RecordChooser({ records, activeId, setActiveId }: { records: Array<{ id: string; label: string }>; activeId: string; setActiveId: (id: string) => void }) {
  return (
    <div className="mb-5 flex gap-2 overflow-auto pb-2">
      {records.map((record) => (
        <button
          className={`shrink-0 border px-3 py-2 font-mono text-xs ${record.id === activeId ? "border-[#f36b21] bg-[#f36b21] text-black" : "border-white/16 bg-black/30 text-white"}`}
          key={record.id}
          onClick={() => setActiveId(record.id)}
          type="button"
        >
          {record.label}
        </button>
      ))}
    </div>
  );
}

function AdminForm({ title, children, onSubmit, error, secondary }: { title: string; children: React.ReactNode; onSubmit: (event: FormEvent) => void; error: string; secondary?: React.ReactNode }) {
  return (
    <form className="border border-white/16 bg-black/35 p-4" onSubmit={onSubmit}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-3xl font-black leading-none">{title}</h3>
        <div className="flex gap-2">
          {secondary}
          <button className="border border-[#f36b21] bg-[#f36b21] px-4 py-3 font-mono text-xs uppercase tracking-normal text-black hover:bg-white" type="submit">保存</button>
        </div>
      </div>
      {error ? <p className="mb-4 border border-[#f36b21] bg-[#f36b21]/10 p-3 text-sm text-[#f36b21]">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </form>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-mono text-xs text-white/55">{label}</span>
      <input className="mt-2 w-full border border-white/20 bg-black/50 px-3 py-3 outline-none focus:border-[#f36b21]" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="font-mono text-xs text-white/55">{label}</span>
      <textarea className="mt-2 min-h-28 w-full border border-white/20 bg-black/50 px-3 py-3 outline-none focus:border-[#f36b21]" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectInput({ label, value, options, labels, onChange }: { label: string; value: string; options: string[]; labels?: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="font-mono text-xs text-white/55">{label}</span>
      <select className="mt-2 w-full border border-white/20 bg-black/50 px-3 py-3 outline-none focus:border-[#f36b21]" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option className="bg-black" key={option} value={option}>{labels?.[option] ?? option}</option>
        ))}
      </select>
    </label>
  );
}

function lines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

