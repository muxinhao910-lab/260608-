"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AddSectionButton } from "@/components/builder/AddSectionButton";
import { HomepageBuilderProvider, useHomepageBuilder } from "@/components/builder/HomepageBuilderProvider";
import { SectionToolbar } from "@/components/builder/SectionToolbar";
import { moduleRegistry } from "@/components/home/sectionRegistry";
import type { HomeSection } from "@/types/pageBuilder";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <HomepageBuilderProvider>
      <HomeBuilderCanvas />
    </HomepageBuilderProvider>
  );
}

function HomeBuilderCanvas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const builder = useHomepageBuilder();

  useEffect(() => {
    function cleanupHomeStoryAnimation() {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
      gsap.killTweensOf([
        ".story-pin",
        ".hero-word",
        ".hero-title",
        ".orange-disc",
        ".story-line",
        ".caption-a",
        ".caption-b",
        ".caption-c",
        ".scribble-one",
        ".sector-button",
        ".radar-poster",
        ".radar-mark",
        ".final-call"
      ]);
    }

    window.addEventListener("homepage-builder-before-open", cleanupHomeStoryAnimation);
    return () => {
      window.removeEventListener("homepage-builder-before-open", cleanupHomeStoryAnimation);
    };
  }, []);

  useGSAP(
    () => {
      if (builder.isBuilderOpen) {
        return;
      }

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
              rotate: (index) => [-9, 7, -6, 10][index] ?? 0,
              x: (index) => [-360, 320, -260, 340][index] ?? 0,
              y: (index) => [220, 170, -220, -180][index] ?? 0
            },
            { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0, stagger: 0.08, duration: 1.25, ease: "back.out(1.35)" },
            ">-0.05"
          )
          .to(".hero-title", { opacity: 0.14, scale: 0.48, yPercent: -48, duration: 1 }, "<")
          .to(".orange-disc", { scale: 1.95, xPercent: 24, yPercent: 16, duration: 1.1 }, "<")
          .to(".sector-button", { y: (index) => [-28, 28, -18, 18][index] ?? 0, duration: 0.8, ease: "sine.inOut" }, ">")
          .to(
            ".sector-button",
            {
              backgroundColor: (index) => ["#151515", "#f36b21", "#ffffff", "#151515"][index] ?? "#151515",
              color: (index) => ["#ffffff", "#151515", "#151515", "#ffffff"][index] ?? "#ffffff",
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
    { scope: rootRef, dependencies: [builder.isBuilderOpen, builder.sections.length] }
  );

  return (
    <main ref={rootRef} className="min-h-screen bg-[#050505] text-white" data-review-page="home">
      {builder.isBuilderOpen ? <AddSectionButton insertIndex={0} /> : null}
      {builder.sections.map((section, index) => renderSection(section, index))}
    </main>
  );

  function renderSection(section: HomeSection, index: number) {
    const registryItem = moduleRegistry[section.type];
    const Component = registryItem.Component;
    const isSelected = builder.selectedSectionId === section.id;

    return (
      <div key={section.id}>
        <div
          className={`builder-section-frame ${builder.isBuilderOpen ? "is-builder-mode" : ""} ${isSelected ? "is-selected" : ""}`}
          data-page-id="home"
          data-section-id={section.id}
          data-section-index={index}
          data-section-type={section.type}
        >
          {builder.isBuilderOpen ? <SectionToolbar sectionId={section.id} /> : null}
          <Component index={index} section={section} />
        </div>
        {builder.isBuilderOpen ? <AddSectionButton insertIndex={index + 1} /> : null}
      </div>
    );
  }
}
