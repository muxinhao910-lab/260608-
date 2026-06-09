"use client";

import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type SectorRecord, useSiteDataStore } from "@/lib/cms-store";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { data } = useSiteDataStore();
  const sectors = [...data.sectors].sort((a, b) => a.order - b.order);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const story = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".story-pin",
            start: "top top",
            end: "+=4600",
            scrub: 1.08,
            pin: true,
            anticipatePin: 1
          }
        });

        story
          .fromTo(
            ".hero-word",
            { yPercent: 44, opacity: 0, rotate: -2 },
            { yPercent: 0, opacity: 1, rotate: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }
          )
          .to(".hero-title", { scale: 0.62, yPercent: -20, duration: 1.1, ease: "power2.inOut" }, ">-0.05")
          .to(".hero-word:nth-child(2)", { color: "#f36b21", xPercent: -12, duration: 1 }, "<")
          .fromTo(".orange-disc", { scale: 0, rotate: -35, opacity: 0 }, { scale: 1, rotate: 18, opacity: 1, duration: 1, ease: "back.out(1.7)" }, "<")
          .fromTo(".story-line", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power2.inOut" }, "<")
          .to(".caption-a", { opacity: 0, y: -36, duration: 0.55 }, ">")
          .fromTo(".caption-b", { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<")
          .to(".scribble-one", { xPercent: 35, yPercent: -20, rotate: 26, scale: 1.15, duration: 1.1 }, "<")
          .fromTo(
            ".sector-button",
            {
              opacity: 0,
              scale: 0.7,
              rotate: (index) => [-9, 7, -6, 10][index],
              x: (index) => [-360, 320, -260, 340][index],
              y: (index) => [220, 170, -220, -180][index]
            },
            { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0, stagger: 0.08, duration: 1.25, ease: "back.out(1.35)" },
            ">-0.05"
          )
          .to(".hero-title", { opacity: 0.14, scale: 0.48, yPercent: -48, duration: 1 }, "<")
          .to(".orange-disc", { scale: 1.95, xPercent: 24, yPercent: 16, duration: 1.1 }, "<")
          .to(".sector-button", { y: (index) => [-28, 28, -18, 18][index], duration: 0.8, ease: "sine.inOut" }, ">")
          .to(
            ".sector-button",
            {
              backgroundColor: (index) => ["#151515", "#f36b21", "#ffffff", "#151515"][index],
              color: (index) => ["#ffffff", "#151515", "#151515", "#ffffff"][index],
              duration: 0.8
            },
            "<"
          )
          .to(".caption-b", { opacity: 0, y: -42, duration: 0.55 }, ">")
          .fromTo(".caption-c", { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<")
          .to(".sector-button:nth-child(1)", { xPercent: -56, yPercent: -28, rotate: -4, duration: 1.1, ease: "power2.inOut" }, "<")
          .to(".sector-button:nth-child(2)", { xPercent: 54, yPercent: -30, rotate: 4, duration: 1.1, ease: "power2.inOut" }, "<")
          .to(".sector-button:nth-child(3)", { xPercent: -50, yPercent: 30, rotate: 3, duration: 1.1, ease: "power2.inOut" }, "<")
          .to(".sector-button:nth-child(4)", { xPercent: 56, yPercent: 28, rotate: -3, duration: 1.1, ease: "power2.inOut" }, "<")
          .fromTo(".radar-poster", { opacity: 0, yPercent: 34, scale: 0.88 }, { opacity: 1, yPercent: 0, scale: 1, duration: 1, ease: "power3.out" }, ">")
          .to(".sector-button", { opacity: 0.38, scale: 0.9, duration: 0.8 }, "<")
          .to(".radar-mark", { width: "70vw", duration: 0.9, ease: "power2.inOut" }, "<")
          .fromTo(".final-call", { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, ">-0.15")
          .to(".story-pin", { backgroundColor: "#0f0f0f", color: "#ffffff", duration: 1 }, "<")
          .to(".orange-disc", { scale: 0.58, xPercent: -54, yPercent: -28, opacity: 0.86, duration: 1 }, "<");
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [sectors.length] }
  );

  function handleSectorClick(event: ReactMouseEvent<HTMLAnchorElement>, sector: SectorRecord) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    startRouteCountdown(sector);
  }

  const titleLines = getTitleLines(data.home.title, data.home.subtitle);

  return (
    <main ref={rootRef} className="min-h-screen bg-[#f8f4ec] text-[#111111]">
      <section className="story-pin relative h-screen overflow-hidden bg-[#f8f4ec] text-[#111111]">
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
            <span>模拟数据 / 第一阶段</span>
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
            <div className="hero-title select-none font-serif text-[14vw] font-black leading-[.78] tracking-normal md:text-[9.4vw]">
              <span className="hero-word block">{titleLines[0]}</span>
              <span className="hero-word block">{titleLines[1]}</span>
              <span className="hero-word block">{titleLines[2]}</span>
            </div>

            <div className="relative min-h-[430px] md:min-h-[520px]">
              <Caption className="caption-a" kicker="场景 01" title={data.home.subtitle}>
                {data.home.intro}
              </Caption>
              <Caption className="caption-b opacity-0" kicker="场景 02" title="四个板块都是独立入口">
                点击板块会进入新的研究展区；过场动画按 3、2、1 依次出现，页面快就快速掠过，页面慢就继续由加载页承接。
              </Caption>
              <Caption className="caption-c opacity-0" kicker="场景 03" title="机器人页先看 3D 模型，再看公司证据">
                默认展示机器人外表面公司，鼠标移到模型上会切换到内部骨架构造与核心零部件公司。
              </Caption>

              <div className="card-stage absolute inset-x-0 bottom-4 grid grid-cols-2 gap-3 md:bottom-0 md:gap-4">
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
                      <span>新地址</span>
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
                <p className="font-mono text-xs tracking-normal">板块独立展区</p>
                <h2 className="mt-5 font-serif text-[13vw] font-black leading-[.78] tracking-normal md:text-[82px]">
                  点击板块<br />进入独立<br />研究展区
                </h2>
              </div>
            </div>
          </div>

          <footer className="grid grid-cols-2 items-end gap-5 font-mono text-[11px] tracking-normal md:grid-cols-4 md:text-xs">
            <span>滚轮联动动画</span>
            <span>3D 板块页面</span>
            <span>本地后台数据</span>
            <span className="text-right">不以 K 线为核心</span>
          </footer>
        </div>

        <div className="final-call pointer-events-none absolute inset-x-5 bottom-20 z-20 translate-y-10 opacity-0 md:inset-x-10">
          <div className="flex items-end justify-between gap-8 border-t border-white pt-5">
            <p className="max-w-[34ch] text-lg leading-tight md:text-2xl">点击任意板块，进入新地址的研究展区。</p>
            <p className="hidden font-serif text-[8vw] font-black leading-none md:block">进入</p>
          </div>
        </div>
      </section>
    </main>
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
  children: ReactNode;
}) {
  return (
    <div className={`caption ${className}`}>
      <p className="caption-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function getTitleLines(title: string, subtitle: string) {
  const cleanTitle = title.trim() || "产业链投资研究雷达";
  if (cleanTitle.replace(/\s/g, "") === "产业链投资研究雷达") {
    return ["产业链", "投资研究", "雷达"];
  }
  return [cleanTitle, subtitle.trim() || "产业链研究", "雷达"];
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
      <div class="route-countdown-meta">加载草图 / 新页面</div>
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
  const digit = overlay.querySelector<HTMLElement>("[data-route-digit]");
  if (label) {
    label.textContent = `${sector.number}${sector.title}`;
  }

  const timeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      window.location.assign(sector.path);
    }
  });

  timeline.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 });

  ["3", "2", "1"].forEach((value) => {
    timeline
      .call(() => {
        if (digit) {
          digit.textContent = value;
        }
      })
      .fromTo(
        digit,
        { autoAlpha: 0, scale: 0.58, rotate: -8, y: 24 },
        { autoAlpha: 1, scale: 1.08, rotate: 0, y: 0, duration: 0.12, ease: "back.out(2.2)" }
      )
      .to(digit, { autoAlpha: 0, scale: 0.78, rotate: 7, y: -18, duration: 0.07, ease: "power2.in" }, "+=0.01");
  });
}
