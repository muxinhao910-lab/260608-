"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import type { CompanyRecord } from "@/lib/cms-store";

type RobotRadarModelProps = {
  companies: CompanyRecord[];
  activeCode: string;
  onSelect: (code: string) => void;
};

type ViewMode = "exterior" | "interior";

type RadarHotspot = {
  id: string;
  label: string;
  description: string;
  view: ViewMode;
  x: number;
  y: number;
  companyCode?: string;
};

const robotImages = {
  exterior: "/images/robot-exterior.png",
  interior: "/images/robot-interior.png"
};

const hotspots: RadarHotspot[] = [
  {
    id: "exterior-shell",
    label: "外部结构",
    description: "皮肤、柔性材料、FPC、连接器、防护件与外壳材料。",
    view: "exterior",
    x: 18,
    y: 20
  },
  {
    id: "interior-stack",
    label: "内部结构",
    description: "AI芯片、视觉模组、电机、减速器、丝杠、电池与热管理。",
    view: "interior",
    x: 77,
    y: 20
  },
  {
    id: "ai-chip",
    label: "AI芯片",
    description: "关注推理芯片、主控板、视觉处理与边缘算力方案。",
    view: "interior",
    x: 17,
    y: 34
  },
  {
    id: "reducer",
    label: "减速器",
    description: "机器人关节的精密传动核心，跟踪客户验证和批量节奏。",
    view: "interior",
    companyCode: "688017",
    x: 78,
    y: 38
  },
  {
    id: "servo",
    label: "伺服电机",
    description: "执行器、空心杯电机和伺服驱动决定动作响应与成本。",
    view: "interior",
    companyCode: "603728",
    x: 80,
    y: 54
  },
  {
    id: "sensor",
    label: "传感器",
    description: "视觉、触觉、力矩和压力传感器决定交互与安全能力。",
    view: "interior",
    companyCode: "603662",
    x: 18,
    y: 58
  },
  {
    id: "fpc",
    label: "FPC连接器",
    description: "柔性连接层、微型连接器与线束总成影响可靠性和装配效率。",
    view: "exterior",
    x: 77,
    y: 72
  }
];

type RobotStageStyle = CSSProperties & {
  "--robot-x": string;
  "--robot-y": string;
  "--robot-hover": string;
  "--robot-scroll": string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function RobotRadarModel({ companies, activeCode, onSelect }: RobotRadarModelProps) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    hover: false,
    scroll: 0,
    reduced: false
  });
  const [view, setView] = useState<ViewMode>("exterior");
  const activeCompany = companies.find((company) => company.stockCode === activeCode) ?? companies[0];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    pointerRef.current.reduced = media.matches;

    const updateScrollProgress = () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }
      const rect = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      pointerRef.current.scroll = clamp((viewportHeight * 0.72 - rect.top) / (viewportHeight + rect.height), 0, 1);
    };

    const onMotionPreferenceChange = () => {
      pointerRef.current.reduced = media.matches;
      updateScrollProgress();
    };

    const tick = () => {
      const root = rootRef.current;
      const state = pointerRef.current;
      if (root) {
        if (!state.reduced) {
          state.currentX += (state.targetX - state.currentX) * 0.1;
          state.currentY += (state.targetY - state.currentY) * 0.1;
        } else {
          state.currentX = 0;
          state.currentY = 0;
        }
        root.style.setProperty("--robot-x", state.currentX.toFixed(4));
        root.style.setProperty("--robot-y", state.currentY.toFixed(4));
        root.style.setProperty("--robot-hover", state.hover ? "1" : "0");
        root.style.setProperty("--robot-scroll", state.scroll.toFixed(4));
      }
      frameRef.current = window.requestAnimationFrame(tick);
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    media.addEventListener("change", onMotionPreferenceChange);
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
      media.removeEventListener("change", onMotionPreferenceChange);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function handlePointerEnter(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }
    pointerRef.current.hover = true;
    setView("interior");
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    const state = pointerRef.current;
    if (event.pointerType !== "mouse" || state.reduced) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    state.targetX = (event.clientX - rect.left) / rect.width - 0.5;
    state.targetY = (event.clientY - rect.top) / rect.height - 0.5;
    state.hover = true;
  }

  function handlePointerLeave() {
    pointerRef.current.hover = false;
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
    setView("exterior");
  }

  function handleHotspotEnter(hotspot: RadarHotspot) {
    setView(hotspot.view);
  }

  function handleHotspotSelect(hotspot: RadarHotspot) {
    if (hotspot.companyCode && companies.some((company) => company.stockCode === hotspot.companyCode)) {
      onSelect(hotspot.companyCode);
    }
    setView(hotspot.view);
  }

  return (
    <section
      className="robot-image-radar relative h-[min(88vh,920px)] min-h-[680px] overflow-hidden border border-white/15 bg-[#050505] text-white shadow-[0_32px_110px_rgba(0,0,0,.42)] xl:sticky xl:top-8"
      data-review-id="robot-analysis-radar-model"
      data-view={view}
      ref={rootRef}
      style={{ "--robot-x": "0", "--robot-y": "0", "--robot-hover": "0", "--robot-scroll": "0" } as RobotStageStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="robot-image-radar-bg" />
      <div className="robot-image-radar-grid" />
      <div className="robot-image-radar-scan" />

      <div className="robot-image-radar-header">
        <p>Robot industry map</p>
        <strong>{view === "interior" ? "Interior structure" : "Exterior structure"}</strong>
      </div>

      <div className="robot-image-radar-media" aria-label="具身智能机器人产业链拆解图">
        <img
          alt="具身智能机器人外部结构产业链拆解图"
          className="robot-radar-image robot-radar-image-exterior"
          draggable={false}
          loading="eager"
          src={robotImages.exterior}
        />
        <img
          alt="具身智能机器人内部机械结构产业链拆解图"
          className="robot-radar-image robot-radar-image-interior"
          draggable={false}
          loading="eager"
          src={robotImages.interior}
        />
      </div>

      <div className="robot-image-radar-hotspots">
        {hotspots.map((hotspot, index) => {
          const company = companies.find((item) => item.stockCode === hotspot.companyCode);
          const active = company?.stockCode === activeCompany?.stockCode || (!hotspot.companyCode && hotspot.view === view);
          return (
            <button
              className={`robot-radar-hotspot ${active ? "is-active" : ""}`}
              key={hotspot.id}
              onClick={() => handleHotspotSelect(hotspot)}
              onFocus={() => handleHotspotEnter(hotspot)}
              onPointerEnter={() => handleHotspotEnter(hotspot)}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transitionDelay: `${index * 35}ms` }}
              type="button"
            >
              <span className="robot-radar-hotspot-dot" />
              <span className="robot-radar-hotspot-line" />
              <span className="robot-radar-hotspot-copy">
                <strong>{hotspot.label}</strong>
                <small>{company ? `${company.stockCode} / ${company.stockName}` : hotspot.description}</small>
              </span>
            </button>
          );
        })}
      </div>

      <div className="robot-image-radar-footer">
        <div>
          <p>Hover stage to reveal</p>
          <h3>{view === "interior" ? activeCompany?.stockName ?? "内部结构" : "外壳到内核"}</h3>
        </div>
        <p>{view === "interior" ? activeCompany?.chainPosition ?? "内部核心零部件与长期跟踪变量。" : "鼠标滑过图谱时，外部结构会平滑揭示内部零部件。滚动时舞台保持稳定，不再被右侧内容拉长。"}</p>
      </div>
    </section>
  );
}
