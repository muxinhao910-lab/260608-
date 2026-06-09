"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import type { SectorRecord } from "@/lib/cms-store";

type ImageMode = "exterior" | "interior";

const hotspots = [
  ["外部结构", "外壳、柔性材料和防护件决定量产后的耐用性。", "15%", "20%", "18deg"],
  ["内部结构", "电机、线束、电池与热管理决定整机稳定性。", "77%", "20%", "158deg"],
  ["AI芯片", "负责视觉识别、本地推理和运动规划。", "15%", "49%", "-8deg"],
  ["减速器", "机器人关节精度、扭矩和寿命的核心环节。", "78%", "48%", "182deg"],
  ["伺服电机", "驱动执行器完成精准动作，关注客户认证。", "73%", "72%", "212deg"],
  ["传感器", "触觉、视觉和压力数据让机器人理解环境。", "20%", "73%", "-34deg"],
  ["FPC连接器", "高密度柔性互连影响可靠性、良率和单机价值量。", "50%", "13%", "90deg"]
] as const;

export function RobotAnalysisHoverHero({ sector }: { sector: SectorRecord }) {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    hover: false,
    locked: false,
    reduced: false
  });
  const [mode, setMode] = useState<ImageMode>("exterior");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    pointerRef.current.reduced = media.matches;
    const onChange = () => {
      pointerRef.current.reduced = media.matches;
    };
    media.addEventListener("change", onChange);

    const tick = () => {
      const state = pointerRef.current;
      const root = rootRef.current;
      if (root && !state.reduced) {
        state.currentX += (state.targetX - state.currentX) * 0.1;
        state.currentY += (state.targetY - state.currentY) * 0.1;
        root.style.setProperty("--rx", state.currentX.toFixed(4));
        root.style.setProperty("--ry", state.currentY.toFixed(4));
        root.style.setProperty("--hero-scale", state.hover ? "1.02" : "1");
      }
      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      media.removeEventListener("change", onChange);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function handleMouseMove(event: ReactMouseEvent<HTMLElement>) {
    const state = pointerRef.current;
    if (state.locked || state.reduced) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    state.targetX = (event.clientX - rect.left) / rect.width - 0.5;
    state.targetY = (event.clientY - rect.top) / rect.height - 0.5;
  }

  function handleMouseEnter() {
    pointerRef.current.hover = true;
  }

  function handleMouseLeave() {
    pointerRef.current.hover = false;
    if (!pointerRef.current.locked) {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
    }
  }

  function toggleLock(event: ReactMouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("button, a")) {
      return;
    }
    const next = !pointerRef.current.locked;
    pointerRef.current.locked = next;
    setLocked(next);
  }

  function unlockView(event: ReactMouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    pointerRef.current.locked = false;
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
    setLocked(false);
  }

  return (
    <section
      className={`robot-analysis-hover-hero ${locked ? "is-locked" : ""}`}
      data-review-id="robot-analysis-hero"
      ref={rootRef}
      onClick={toggleLock}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="robot-analysis-hero-grid" />
      <div className="robot-analysis-orb robot-analysis-orb-blue" />
      <div className="robot-analysis-orb robot-analysis-orb-orange" />

      <div className="robot-analysis-hero-copy">
        <p className="font-mono text-xs uppercase tracking-normal text-[#f36b21]">{sector.number} / {sector.slug}</p>
        <div className="mt-5 h-1 w-full bg-[#f36b21]" />
        <h1 className="mt-8 font-serif text-[13vw] font-black leading-[.82] tracking-normal md:text-[102px]">
          机器人产业链雷达
        </h1>
        <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/76 md:text-2xl">
          用外部结构和内部零部件两张产业链图，追踪客户、订单、收入占比、产能扩张和供应链位置。
        </p>
        <button className="robot-analysis-unlock" hidden={!locked} type="button" onClick={unlockView}>
          Back to hover
        </button>
      </div>

      <div className="robot-analysis-stage">
        <div className="robot-analysis-mode-switch" aria-label="机器人结构图切换">
          <button
            className={mode === "exterior" ? "is-active" : ""}
            type="button"
            onClick={() => setMode("exterior")}
            onMouseEnter={() => setMode("exterior")}
          >
            Exterior
          </button>
          <button
            className={mode === "interior" ? "is-active" : ""}
            type="button"
            onClick={() => setMode("interior")}
            onMouseEnter={() => setMode("interior")}
          >
            Interior
          </button>
        </div>

        <div className="robot-analysis-image-shell">
          <span className="robot-analysis-scan" />
          <img
            alt="具身智能机器人外部结构与产业链拆解图"
            className={`robot-analysis-hero-image ${mode === "exterior" ? "is-visible" : ""}`}
            draggable={false}
            src="/images/robot-exterior.png"
          />
          <img
            alt="具身智能机器人内部机械结构与核心零部件产业链拆解图"
            className={`robot-analysis-hero-image ${mode === "interior" ? "is-visible" : ""}`}
            draggable={false}
            src="/images/robot-interior.png"
          />

          <div className="robot-analysis-hotspots" aria-label="产业链交互热点">
            {hotspots.map(([label, description, x, y, angle]) => (
              <button
                className="robot-analysis-hotspot"
                key={label}
                style={{ "--hotspot-x": x, "--hotspot-y": y, "--line-angle": angle } as CSSProperties}
                type="button"
              >
                <span className="robot-analysis-hotspot-dot" />
                <span className="robot-analysis-hotspot-label">{label}</span>
                <span className="robot-analysis-hotspot-line" />
                <span className="robot-analysis-hotspot-card">{description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="robot-analysis-lock-badge">{locked ? "Back to hover" : "Click to lock view"}</div>
      </div>
    </section>
  );
}
