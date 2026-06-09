"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import type { CompanyRecord } from "@/lib/cms-store";

type RobotRadarModelProps = {
  companies: CompanyRecord[];
  activeCode: string;
  onSelect: (code: string) => void;
};

const surfaceMarkers = [
  { id: "hair", name: "仿生头发公司", part: "头发表面", x: 16, y: 12 },
  { id: "skin", name: "硅胶皮肤公司", part: "脸部 / 手部皮肤", x: 70, y: 15 },
  { id: "shell", name: "外壳材料公司", part: "躯干外壳", x: 10, y: 72 },
  { id: "clothing", name: "柔性包覆公司", part: "关节包覆", x: 72, y: 74 }
];

function RobotBody({ activeCompany, internal }: { activeCompany: CompanyRecord; internal: boolean }) {
  const activePart = activeCompany.mapPoint.part;

  const materialFor = (part: string) => ({
    color: part === activePart ? "#f36b21" : internal ? "#d8d2c7" : "#f2ede3",
    transparent: internal,
    opacity: internal ? (part === activePart ? 1 : 0.48) : 1,
    roughness: internal ? 0.38 : 0.72,
    metalness: internal ? 0.68 : 0.16,
    emissive: part === activePart ? "#7a2a00" : "#000000",
    emissiveIntensity: part === activePart ? 0.58 : 0
  });

  return (
    <Float speed={1.35} rotationIntensity={0.2} floatIntensity={0.25}>
      <group rotation={[0.06, -0.22, 0]} scale={1.12}>
        {!internal ? (
          <>
            <mesh position={[0, 1.88, 0]}>
              <sphereGeometry args={[0.42, 40, 40]} />
              <meshStandardMaterial color="#f2ede3" roughness={0.68} metalness={0.1} />
            </mesh>
            <mesh position={[0, 2.18, -0.04]}>
              <torusGeometry args={[0.34, 0.04, 12, 64]} />
              <meshStandardMaterial color="#111111" roughness={0.45} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <capsuleGeometry args={[0.46, 1.16, 18, 42]} />
              <meshStandardMaterial color="#f2ede3" roughness={0.72} metalness={0.12} />
            </mesh>
            <mesh position={[-0.92, 0.62, 0]} rotation={[0, 0, -0.38]}>
              <capsuleGeometry args={[0.13, 1.28, 10, 28]} />
              <meshStandardMaterial color="#f2ede3" roughness={0.72} metalness={0.12} />
            </mesh>
            <mesh position={[0.92, 0.62, 0]} rotation={[0, 0, 0.38]}>
              <capsuleGeometry args={[0.13, 1.28, 10, 28]} />
              <meshStandardMaterial color="#f2ede3" roughness={0.72} metalness={0.12} />
            </mesh>
            <mesh position={[-0.34, -0.4, 0]} rotation={[0, 0, 0.05]}>
              <capsuleGeometry args={[0.15, 1.36, 10, 28]} />
              <meshStandardMaterial color="#f2ede3" roughness={0.72} metalness={0.12} />
            </mesh>
            <mesh position={[0.34, -0.4, 0]} rotation={[0, 0, -0.05]}>
              <capsuleGeometry args={[0.15, 1.36, 10, 28]} />
              <meshStandardMaterial color="#f2ede3" roughness={0.72} metalness={0.12} />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[0, 1.88, 0]}>
              <boxGeometry args={[0.78, 0.58, 0.58]} />
              <meshStandardMaterial {...materialFor("头部视觉")} />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <boxGeometry args={[1.18, 1.56, 0.64]} />
              <meshStandardMaterial {...materialFor("躯干传动")} />
            </mesh>
            <mesh position={[-0.78, 1.12, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial {...materialFor("肩关节模组")} />
            </mesh>
            <mesh position={[-1.06, 0.56, 0]} rotation={[0, 0, -0.38]}>
              <capsuleGeometry args={[0.12, 0.78, 8, 24]} />
              <meshStandardMaterial {...materialFor("肘关节")} />
            </mesh>
            <mesh position={[0.78, 1.12, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial {...materialFor("腕部力控")} />
            </mesh>
            <mesh position={[1.1, 0.54, 0]} rotation={[0, 0, 0.36]}>
              <capsuleGeometry args={[0.12, 0.78, 8, 24]} />
              <meshStandardMaterial {...materialFor("灵巧手 / 腕部")} />
            </mesh>
            <mesh position={[1.32, 0.02, 0]}>
              <boxGeometry args={[0.38, 0.18, 0.25]} />
              <meshStandardMaterial {...materialFor("手指微型传动")} />
            </mesh>
            <mesh position={[-0.42, -0.28, 0]} rotation={[0, 0, 0.08]}>
              <capsuleGeometry args={[0.14, 1.05, 8, 24]} />
              <meshStandardMaterial {...materialFor("膝部线性执行器")} />
            </mesh>
            <mesh position={[0.42, -0.28, 0]} rotation={[0, 0, -0.08]}>
              <capsuleGeometry args={[0.14, 1.05, 8, 24]} />
              <meshStandardMaterial color="#d8d2c7" transparent opacity={0.48} roughness={0.42} metalness={0.45} />
            </mesh>
          </>
        )}
        <mesh position={[0, -0.92, 0]}>
          <torusGeometry args={[0.88, 0.025, 12, 80]} />
          <meshStandardMaterial color="#f36b21" emissive="#f36b21" emissiveIntensity={0.45} />
        </mesh>
        {internal ? (
          <mesh position={[activeCompany.mapPoint.x, activeCompany.mapPoint.y, activeCompany.mapPoint.z + 0.34]}>
            <sphereGeometry args={[0.075, 32, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#f36b21" emissiveIntensity={1.1} />
          </mesh>
        ) : null}
      </group>
    </Float>
  );
}

function pointToScreen(company: CompanyRecord) {
  return {
    x: 50 + company.mapPoint.x * 17,
    y: 50 - company.mapPoint.y * 18
  };
}

export function RobotRadarModel({ companies, activeCode, onSelect }: RobotRadarModelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const internalRef = useRef(false);
  const pointerRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0, hover: false, reduced: false });
  const [internal, setInternal] = useState(false);
  const activeCompany = companies.find((company) => company.stockCode === activeCode) ?? companies[0];

  function setInternalView(nextInternal: boolean) {
    if (internalRef.current === nextInternal) {
      return;
    }
    internalRef.current = nextInternal;
    setInternal(nextInternal);
  }

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
        root.style.setProperty("--radar-x", state.currentX.toFixed(4));
        root.style.setProperty("--radar-y", state.currentY.toFixed(4));
        root.style.setProperty("--radar-hover", state.hover ? "1" : "0");
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

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = pointerRef.current;
    if (event.pointerType !== "mouse" || state.reduced) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    state.targetX = (event.clientX - rect.left) / rect.width - 0.5;
    state.targetY = (event.clientY - rect.top) / rect.height - 0.5;
    state.hover = true;
    setInternalView(true);
  }

  function handlePointerEnter(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }
    pointerRef.current.hover = true;
    setInternalView(true);
  }

  function handlePointerLeave() {
    pointerRef.current.hover = false;
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
    setInternalView(false);
  }

  return (
    <div
      className="robot-stage robot-hover-radar relative min-h-[760px] overflow-hidden bg-[#050505]"
      data-review-id="robot-analysis-radar-model"
      ref={rootRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="robot-hover-radar-bg absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(243,107,33,.24),transparent_35%),linear-gradient(120deg,rgba(255,255,255,.07)_0_1px,transparent_1px_18px)]" />
      <div className="robot-hover-radar-aura robot-hover-radar-aura-orange" />
      <div className="robot-hover-radar-aura robot-hover-radar-aura-blue" />
      <div className="robot-hover-radar-scan" />
      <Canvas className="robot-hover-radar-canvas" camera={{ position: [0, 0.42, 5.25], fov: 40 }} dpr={[1, 1.6]}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2.6, 3.2, 4]} intensity={2.2} />
        <spotLight position={[-2.8, 3.5, 2.8]} angle={0.42} penumbra={0.7} intensity={2.4} color="#f36b21" />
        <RobotBody activeCompany={activeCompany} internal={internal} />
        <Environment preset="city" />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={1.05} maxPolarAngle={1.9} />
      </Canvas>

      <div className="pointer-events-none absolute left-1/2 top-6 z-10 -translate-x-1/2 border border-white/20 bg-black/40 px-4 py-2 text-center font-mono text-xs uppercase tracking-normal text-white/70 backdrop-blur">
        {internal ? "内部骨骼构造 / 核心零部件公司" : "外表面 / 外观材料公司待后台添加"}
      </div>

      {internal ? (
        <>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {companies.map((company) => {
              const target = pointToScreen(company);
              const active = company.stockCode === activeCode;
              return (
                <line
                  key={company.stockCode}
                  x1={company.mapPoint.labelX}
                  y1={company.mapPoint.labelY}
                  x2={target.x}
                  y2={target.y}
                  stroke={active ? "#f36b21" : "rgba(255,255,255,.34)"}
                  strokeDasharray={active ? "0" : "3 2"}
                  strokeWidth={active ? "0.42" : "0.18"}
                />
              );
            })}
          </svg>
          {companies.map((company) => (
            <motion.button
              className={`absolute z-10 border px-3 py-2 text-left font-mono text-[11px] uppercase tracking-normal backdrop-blur-md transition ${
                company.stockCode === activeCode
                  ? "border-[#f36b21] bg-[#f36b21] text-black shadow-[0_0_28px_rgba(243,107,33,.65)]"
                  : "border-white/30 bg-black/45 text-white hover:border-[#f36b21] hover:text-[#f36b21]"
              }`}
              key={company.stockCode}
              onClick={() => onSelect(company.stockCode)}
              style={{ left: `${company.mapPoint.labelX}%`, top: `${company.mapPoint.labelY}%` }}
              type="button"
              whileHover={{ scale: 1.04, x: 4 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <span className="block">{company.stockCode}</span>
              <strong className="block text-sm normal-case">{company.stockName}</strong>
              <span className="block text-[10px] opacity-70">{company.mapPoint.part}</span>
            </motion.button>
          ))}
        </>
      ) : (
        <>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {surfaceMarkers.map((marker) => (
              <line
                key={marker.id}
                x1={marker.x}
                y1={marker.y}
                x2="50"
                y2="42"
                stroke="rgba(243,107,33,.72)"
                strokeDasharray="2 2"
                strokeWidth="0.24"
              />
            ))}
          </svg>
          {surfaceMarkers.map((marker) => (
            <div
              className="absolute z-10 border border-[#f36b21]/60 bg-black/45 px-3 py-2 text-left font-mono text-[11px] uppercase tracking-normal text-white backdrop-blur-md"
              key={marker.id}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            >
              <span className="block text-[#f36b21]">待添加</span>
              <strong className="block text-sm normal-case">{marker.name}</strong>
              <span className="block text-[10px] opacity-70">{marker.part}</span>
            </div>
          ))}
        </>
      )}

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 border-t border-white/20 pt-4 text-white">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-normal text-[#f36b21]">3D robot supply-chain map</p>
          <h3 className="mt-1 font-serif text-3xl font-black leading-none md:text-5xl">{internal ? activeCompany.stockName : "外观层公司占位"}</h3>
        </div>
        <p className="max-w-[28ch] text-right text-sm text-white/70">
          {internal ? activeCompany.chainPosition : "鼠标移入模型区域，切换到内部骨骼构造和核心零部件公司。"}
        </p>
      </div>
    </div>
  );
}
