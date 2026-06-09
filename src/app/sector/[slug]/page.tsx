"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RobotRadarModel } from "@/components/RobotRadarModel";
import {
  type CompanyRecord,
  type InfoCardRecord,
  useSiteDataStore
} from "@/lib/cms-store";
import { sourceTypeLabels, type ChainSegment } from "@/lib/radar-data";

const stageStyles: Record<CompanyRecord["currentStage"], string> = {
  "送样": "bg-white text-black",
  "小批量": "bg-[#f36b21] text-black",
  "定点": "bg-[#111111] text-white",
  "量产": "bg-[#f36b21] text-black"
};

export default function SectorPage() {
  const params = useParams<{ slug: string }>();
  const { data } = useSiteDataStore();
  const sector = data.sectors.find((item) => item.slug === params.slug) ?? data.sectors[0];
  const sectorCompanies = data.companies.filter((company) => company.sectorId === sector.id);
  const [query, setQuery] = useState("");
  const [activeCode, setActiveCode] = useState(sectorCompanies[0]?.stockCode ?? "");
  const [activeSegment, setActiveSegment] = useState<ChainSegment | "全部">("全部");

  useEffect(() => {
    if (!sectorCompanies.some((company) => company.stockCode === activeCode)) {
      setActiveCode(sectorCompanies[0]?.stockCode ?? "");
    }
  }, [activeCode, sectorCompanies]);

  const activeCompany = sectorCompanies.find((company) => company.stockCode === activeCode) ?? sectorCompanies[0];
  const sectorInfoCards = data.infoCards.filter((card) => sectorCompanies.some((company) => company.id === card.companyId));
  const activeInfoCards = activeCompany ? data.infoCards.filter((card) => card.companyId === activeCompany.id) : [];

  const segments = useMemo(() => Array.from(new Set(sectorCompanies.map((company) => company.chainSegment))), [sectorCompanies]);
  const searchedCompanies = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return sectorCompanies.filter((company) => {
      const matchesQuery =
        !trimmed ||
        company.stockCode.includes(trimmed) ||
        company.stockName.toLowerCase().includes(trimmed);
      const matchesSegment = activeSegment === "全部" || company.chainSegment === activeSegment;
      return matchesQuery && matchesSegment;
    });
  }, [activeSegment, query, sectorCompanies]);

  const groupedCompanies = useMemo(
    () => segments.map((segment) => ({ segment, companies: sectorCompanies.filter((company) => company.chainSegment === segment) })),
    [sectorCompanies, segments]
  );

  useEffect(() => {
    if (searchedCompanies.length === 1) {
      setActiveCode(searchedCompanies[0].stockCode);
    }
  }, [searchedCompanies]);

  if (sector.id !== "robotics") {
    return (
      <main className="min-h-screen bg-[#070707] px-5 py-8 text-white md:px-10">
        <TopBar />
        <section className="mx-auto grid min-h-[78vh] max-w-7xl place-items-center">
          <div className="w-full border-2 border-white/20 bg-white/[.06] p-6 shadow-[0_0_80px_rgba(243,107,33,.18)] md:p-10">
            <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">reserved sector / {sector.path}</p>
            <h1 className="mt-5 font-serif text-[15vw] font-black leading-[.8] tracking-normal md:text-[112px]">
              {sector.number}{sector.title}
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-white/72">{sector.summary}</p>
            <Link className="mt-10 inline-block border border-[#f36b21] px-5 py-3 font-mono text-xs uppercase tracking-normal text-[#f36b21] hover:bg-[#f36b21] hover:text-black" href="/">
              返回首页
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="px-5 py-8 md:px-10">
        <TopBar />
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 border-b border-white/20 pb-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">{sector.number} / {sector.slug}</p>
              <div className="mt-5 h-1 w-full bg-[#f36b21]" />
            </div>
            <div>
              <h1 className="font-serif text-[14vw] font-black leading-[.82] tracking-normal md:text-[108px]">
                机器人产业链雷达
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-white/78 md:text-2xl">
                先用机器人 3D 模型建立直觉。默认是外表面公司占位；鼠标移入模型区域后切换到内部骨骼构造和核心零部件公司。
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.08fr_.92fr]">
            <RobotRadarModel companies={sectorCompanies} activeCode={activeCode} onSelect={setActiveCode} />
            {activeCompany ? <CompanyRadarPage company={activeCompany} infoCards={activeInfoCards} /> : null}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[.78fr_1.22fr]">
            <SearchPanel
              activeCode={activeCode}
              activeSegment={activeSegment}
              companies={searchedCompanies}
              query={query}
              segments={segments}
              setActiveCode={setActiveCode}
              setActiveSegment={setActiveSegment}
              setQuery={setQuery}
            />
            <CategorySection groupedCompanies={groupedCompanies} setActiveCode={setActiveCode} />
          </div>

          <section className="mt-8 grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
            <InfoCard dark title="可信度评分规则" eyebrow="source scoring">
              <div className="grid gap-2">
                {data.credibilityRules.map((rule) => (
                  <div className="flex items-start justify-between gap-4 border-b border-white/12 py-2 font-mono text-xs" key={rule.id}>
                    <span>{rule.sourceType}</span>
                    <strong>{rule.baseScore}</strong>
                  </div>
                ))}
              </div>
            </InfoCard>
            <InfoCard dark title="最新信息卡片流" eyebrow="information cards">
              <div className="grid gap-3">
                {sectorInfoCards.slice(0, 5).map((card) => (
                  <InfoFeedCard card={card} key={card.id} />
                ))}
              </div>
            </InfoCard>
          </section>
        </div>
      </section>
    </main>
  );
}

function TopBar() {
  return (
    <div className="mb-8 flex items-center justify-between font-mono text-xs uppercase tracking-normal text-white/58">
      <Link className="hover:text-[#f36b21]" href="/">CHAIN RADAR</Link>
      <Link className="hover:text-[#f36b21]" href="/admin/dashboard">ADMIN</Link>
    </div>
  );
}

function CompanyRadarPage({ company, infoCards }: { company: CompanyRecord; infoCards: InfoCardRecord[] }) {
  return (
    <section className="min-h-[760px] border-2 border-white/20 bg-white/[.06] p-5 shadow-[0_0_80px_rgba(243,107,33,.14)] backdrop-blur-xl md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/15 pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">company radar page</p>
          <h2 className="mt-2 font-serif text-5xl font-black leading-none md:text-7xl">{company.stockName}</h2>
          <p className="mt-3 font-mono text-sm text-white/66">{company.stockCode} / {company.chainSegment} / {company.mapPoint.part}</p>
        </div>
        <span className={`border border-white/25 px-3 py-2 font-mono text-xs ${stageStyles[company.currentStage]}`}>{company.currentStage}</span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <InfoCard dark eyebrow="一句话投资逻辑" title={company.oneLineLogic} />
        <InfoCard dark eyebrow="所属产业链位置" title={company.chainPosition} />
        <InfoCard dark eyebrow="当前市场关注点" title={company.marketFocus} />
        <InfoCard dark eyebrow="风险提示" title={company.riskTips.join(" / ")} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <InfoCard dark eyebrow="长期跟踪指标" title="统一指标池">
          <List items={company.coreMetrics} />
        </InfoCard>
        <InfoCard dark eyebrow="最新信息流" title="来自后台信息卡片">
          <List items={infoCards.map((card) => `${card.type}：${card.title}`).slice(0, 4)} />
        </InfoCard>
      </div>

      <TrackingPanel company={company} />

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {infoCards.slice(0, 4).map((card) => (
          <InfoFeedCard card={card} key={card.id} />
        ))}
      </div>
    </section>
  );
}

function TrackingPanel({ company }: { company: CompanyRecord }) {
  const metrics = [
    ["新增客户", company.tracking.newCustomers],
    ["新增订单", company.tracking.newOrders],
    ["机器人收入占比", company.tracking.robotRevenueShare],
    ["毛利率变化", company.tracking.grossMarginChange],
    ["产能扩张", company.tracking.capacityExpansion],
    ["客户验证阶段", company.currentStage],
    ["是否进入头部客户供应链", company.tracking.enteredTopCustomerSupplyChain]
  ];

  return (
    <section className="mt-5 border-2 border-[#f36b21] bg-black/50 p-4">
      <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">unified tracking metrics</p>
      <h3 className="mt-2 font-serif text-3xl font-black leading-none">机器人公司统一追踪指标</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {metrics.map(([label, value]) => (
          <div className="border border-white/15 bg-white/[.04] p-3" key={label}>
            <p className="font-mono text-[11px] uppercase tracking-normal text-white/45">{label}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/86">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SearchPanel({
  query,
  setQuery,
  activeSegment,
  setActiveSegment,
  companies,
  activeCode,
  setActiveCode,
  segments
}: {
  query: string;
  setQuery: (value: string) => void;
  activeSegment: ChainSegment | "全部";
  setActiveSegment: (value: ChainSegment | "全部") => void;
  companies: CompanyRecord[];
  activeCode: string;
  setActiveCode: (value: string) => void;
  segments: ChainSegment[];
}) {
  return (
    <section className="border-2 border-white/20 bg-white/[.06] p-5 backdrop-blur-xl">
      <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">search by code / name</p>
      <h2 className="mt-2 font-serif text-4xl font-black leading-none md:text-6xl">股票池搜索</h2>
      <label className="mt-6 block">
        <span className="font-mono text-xs uppercase tracking-normal text-white/55">股票代码 / 名称</span>
        <input
          className="mt-2 w-full border-2 border-white/20 bg-black/50 px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/32 focus:border-[#f36b21] focus:shadow-[0_0_28px_rgba(243,107,33,.36)]"
          placeholder="输入 688017 或 绿的谐波"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="mt-5 flex flex-wrap gap-2">
        {(["全部", ...segments] as Array<ChainSegment | "全部">).map((segment) => (
          <button
            className={`border px-3 py-2 font-mono text-xs transition ${
              activeSegment === segment ? "border-[#f36b21] bg-[#f36b21] text-black" : "border-white/20 bg-white/[.04] text-white hover:border-[#f36b21]"
            }`}
            key={segment}
            onClick={() => setActiveSegment(segment)}
            type="button"
          >
            {segment}
          </button>
        ))}
      </div>
      <div className="mt-5 grid max-h-[510px] gap-3 overflow-auto pr-1">
        {companies.map((company) => (
          <button
            className={`border p-3 text-left transition ${
              activeCode === company.stockCode ? "border-[#f36b21] bg-[#f36b21] text-black" : "border-white/16 bg-white/[.04] text-white hover:border-[#f36b21]"
            }`}
            key={company.stockCode}
            onClick={() => setActiveCode(company.stockCode)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs">{company.stockCode}</p>
                <h3 className="mt-1 font-serif text-3xl font-black leading-none">{company.stockName}</h3>
              </div>
              <span className={`border border-current px-2 py-1 font-mono text-xs ${stageStyles[company.currentStage]}`}>{company.currentStage}</span>
            </div>
            <p className="mt-3 text-sm leading-snug opacity-75">{company.chainSegment} / {company.mapPoint.part}</p>
          </button>
        ))}
        {companies.length === 0 ? <div className="border border-dashed border-white/28 p-5 text-sm text-white/70">没有匹配结果。请尝试股票代码或公司简称。</div> : null}
      </div>
    </section>
  );
}

function CategorySection({
  groupedCompanies,
  setActiveCode
}: {
  groupedCompanies: Array<{ segment: ChainSegment; companies: CompanyRecord[] }>;
  setActiveCode: (value: string) => void;
}) {
  return (
    <section className="border-2 border-white/20 bg-white/[.06] p-5 backdrop-blur-xl">
      <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">industry chain category page</p>
      <h2 className="mt-2 font-serif text-4xl font-black leading-none md:text-6xl">产业链分类页</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {groupedCompanies.map((group) => (
          <div className="border border-white/16 bg-black/35 p-4" key={group.segment}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-3xl font-black leading-none">{group.segment}</h3>
              <span className="font-mono text-xs text-[#f36b21]">{group.companies.length} 家</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.companies.map((company) => (
                <button
                  className="border border-white/18 bg-white/[.04] px-3 py-2 font-mono text-xs text-white hover:border-[#f36b21] hover:text-[#f36b21]"
                  key={company.stockCode}
                  onClick={() => setActiveCode(company.stockCode)}
                  type="button"
                >
                  {company.stockCode} {company.stockName}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoCard({
  eyebrow,
  title,
  children,
  dark = false
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <article className={`border-2 p-4 ${dark ? "border-white/16 bg-white/[.045]" : "border-black bg-white"}`}>
      <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">{eyebrow}</p>
      <h3 className="mt-3 text-lg font-semibold leading-snug md:text-xl">{title}</h3>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}

function InfoFeedCard({ card }: { card: InfoCardRecord }) {
  return (
    <article className="border border-white/16 bg-black/28 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">{card.type} / {card.publishedAt}</p>
          <h3 className="mt-2 text-lg font-semibold leading-tight">{card.title}</h3>
        </div>
        <div className="border border-[#f36b21] bg-[#f36b21] px-2 py-1 font-mono text-xs text-black">{card.credibilityScore}</div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/72">{card.body}</p>
      <a className="mt-3 block break-all text-xs text-white/62 underline decoration-[#f36b21] underline-offset-4" href={card.sourceUrl} target="_blank" rel="noreferrer">
        {sourceTypeLabels[card.sourceType]} / {card.sourceName}
      </a>
    </article>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 text-sm leading-relaxed text-white/78">
      {items.length ? items.map((item) => <li className="border-l-2 border-[#f36b21] pl-3" key={item}>{item}</li>) : <li className="text-white/45">暂无数据</li>}
    </ul>
  );
}
