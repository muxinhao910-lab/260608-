"use client";

import { type MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import { type SectorRecord, useSiteDataStore } from "@/lib/cms-store";
import type { SectionComponentProps } from "@/types/pageBuilder";
import { textProp } from "./sectionHelpers";

export function HeroSection({ section }: SectionComponentProps) {
  const { data } = useSiteDataStore();
  const sectors = [...data.sectors].sort((a, b) => a.order - b.order);
  const eyebrow = textProp(section.props, "eyebrow", "INDUSTRIAL INTELLIGENCE");
  const title = textProp(section.props, "title", data.home.title);
  const subtitle = textProp(section.props, "subtitle", data.home.subtitle);
  const primaryButtonText = textProp(section.props, "primaryButtonText", "开始探索");
  const primaryButtonHref = textProp(section.props, "primaryButtonHref", "#search");
  const secondaryButtonText = textProp(section.props, "secondaryButtonText", "机器人产业");
  const secondaryButtonHref = textProp(section.props, "secondaryButtonHref", "/sector/robotics");
  const titleLines = getTitleLines(title);

  function handleSectorClick(event: ReactMouseEvent<HTMLAnchorElement>, sector: SectorRecord) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    startRouteCountdown(sector);
  }

  return (
    <section className="story-pin relative h-screen overflow-hidden bg-[#f8f4ec] text-[#111111]" data-review-id="home-hero">
      <div className="noise-field pointer-events-none absolute inset-0 opacity-70" />
      <div className="doodle-layer pointer-events-none absolute inset-0">
        <span className="scribble scribble-one" />
        <span className="scribble scribble-two" />
        <span className="scribble scribble-three" />
      </div>
      <div className="orange-disc absolute left-[58vw] top-[12vh] h-[34vw] max-h-[460px] min-h-[220px] w-[34vw] min-w-[220px] max-w-[460px] rounded-full bg-[#f36b21]" />
      <div className="story-line absolute left-6 right-6 top-[16vh] h-[3px] bg-current md:left-12 md:right-12" />

      <div className="relative z-10 flex h-full flex-col justify-between px-5 py-5 md:px-10 md:py-8">
        <header className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-normal md:text-xs">
          <span>{eyebrow}</span>
          <nav className="flex flex-wrap justify-end gap-2">
            {sectors.map((sector) => (
              <a
                aria-label={`进入${sector.title}`}
                className="border border-current bg-white/70 px-2 py-1 text-black hover:bg-[#f36b21]"
                href={sector.path}
                key={sector.id}
                onClick={(event) => {
                  handleSectorClick(event, sector);
                }}
              >
                {sector.number} <span className="hidden sm:inline">{shortSectorTitle(sector.title)}</span>
              </a>
            ))}
          </nav>
        </header>

        <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="hero-title select-none font-serif text-[13vw] font-black leading-[.82] tracking-normal md:text-[8.4vw]">
            {titleLines.map((line) => (
              <span className="hero-word block" key={line}>
                {line}
              </span>
            ))}
          </div>

          <div className="relative min-h-[430px] md:min-h-[520px]">
            <Caption className="caption-a" kicker="SCENE 01" title={subtitle}>
              以公司在产业链里的位置、客户、订单、收入占比、毛利率和可信来源为线索，持续追踪长期变量。
            </Caption>
            <Caption className="caption-b opacity-0" kicker="SCENE 02" title="每个板块都是独立入口">
              点击板块进入独立研究展区。首页 Builder 可以继续添加搜索、公司卡片、指标网格和风险提示。
            </Caption>
            <Caption className="caption-c opacity-0" kicker="SCENE 03" title="先看产业结构，再看公司证据">
              机器人页面展示外部结构与内部零部件，后续可按相同模块化方式扩展到其他产业链。
            </Caption>

            <div className="card-stage absolute inset-x-0 bottom-4 grid grid-cols-2 gap-3 md:bottom-0 md:gap-4" data-review-id="home-sector-cards">
              {sectors.map((sector) => (
                <motion.a
                  aria-label={`打开${sector.title}`}
                  className="sector-button min-h-[132px] border-2 border-current bg-white p-4 text-left shadow-[8px_8px_0_#111111] md:min-h-[168px] md:p-5"
                  href={sector.path}
                  key={sector.id}
                  onClick={(event) => {
                    handleSectorClick(event, sector);
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  whileHover={{ y: -8, rotate: -1, scale: 1.02 }}
                >
                  <div className="flex items-start justify-between gap-4 font-mono text-xs">
                    <span>进入板块</span>
                    <span>研究页</span>
                  </div>
                  <h3 className="mt-8 font-serif text-3xl font-black leading-none tracking-normal md:text-5xl">
                    {sector.number}{sector.title}
                  </h3>
                  <p className="mt-3 max-w-[24ch] text-sm leading-snug md:text-base">{sector.summary}</p>
                </motion.a>
              ))}
            </div>

            <div className="radar-poster absolute bottom-8 right-0 w-[min(700px,92vw)] border-2 border-[#111111] bg-[#f36b21] p-5 opacity-0 shadow-[14px_14px_0_rgba(17,17,17,.96)] md:p-8">
              <div className="radar-mark mb-6 h-3 w-24 bg-current" />
              <p className="font-mono text-xs tracking-normal">BUILDER READY</p>
              <h2 className="mt-5 font-serif text-[11vw] font-black leading-[.82] tracking-normal md:text-[72px]">
                可视化添加<br />产业模块<br />直接预览
              </h2>
            </div>
          </div>
        </div>

        <footer className="grid grid-cols-2 items-end gap-5 font-mono text-[11px] tracking-normal md:grid-cols-4 md:text-xs">
          <a href={primaryButtonHref}>{primaryButtonText}</a>
          <a href={secondaryButtonHref}>{secondaryButtonText}</a>
          <span>本地 Builder</span>
          <span className="text-right">不以 K 线为核心</span>
        </footer>
      </div>

      <div className="final-call pointer-events-none absolute inset-x-5 bottom-20 z-20 translate-y-10 opacity-0 md:inset-x-10">
        <div className="flex items-end justify-between gap-8 border-t border-white pt-5">
          <p className="max-w-[34ch] text-lg leading-tight md:text-2xl">满意当前搭建结果后，导出 JSON 发给 Codex 固化到默认首页。</p>
          <p className="hidden font-serif text-[8vw] font-black leading-none md:block">BUILD</p>
        </div>
      </div>
    </section>
  );
}

function Caption({
  className,
  kicker,
  title,
  children
}: {
  className: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`caption ${className}`}>
      <p className="caption-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function getTitleLines(title: string) {
  const clean = title.trim() || "看懂产业，而不是只看K线";
  if (clean.includes("，")) {
    const [first, second] = clean.split("，");
    return [first, second || "不是只看K线", "产业雷达"];
  }
  return [clean, "产业变量", "研究雷达"];
}

function shortSectorTitle(title: string) {
  return title.replace(/板块/g, "").trim();
}

function startRouteCountdown(sector: SectorRecord) {
  if (typeof window === "undefined") {
    return;
  }

  const existingOverlay = document.getElementById("route-countdown-overlay");
  if (existingOverlay) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "route-countdown-overlay";
  overlay.className = "route-countdown-overlay";
  overlay.setAttribute("aria-live", "polite");
  overlay.setAttribute("role", "status");
  overlay.innerHTML = `
    <div class="route-countdown-card">
      <div class="route-countdown-texture"></div>
      <div class="route-countdown-meta">加载研究页 / 新地址</div>
      <div class="route-countdown-copy">
        <p>即将进入</p>
        <h2 data-route-label></h2>
      </div>
      <div class="route-countdown-center" aria-hidden="true">
        <div class="route-sketch">
          <span class="route-sketch-body"></span>
          <span class="route-sketch-eye route-sketch-eye-left"></span>
          <span class="route-sketch-eye route-sketch-eye-right"></span>
          <span class="route-sketch-mouth"></span>
          <span class="route-sketch-arm route-sketch-arm-left"></span>
          <span class="route-sketch-arm route-sketch-arm-right"></span>
        </div>
        <span class="route-countdown-digit" data-route-digit>3</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const label = overlay.querySelector<HTMLElement>("[data-route-label]");
  if (label) {
    label.textContent = `${sector.number}${sector.title}`;
  }

  setTimeout(() => {
    window.location.assign(sector.path);
  }, 900);
}
