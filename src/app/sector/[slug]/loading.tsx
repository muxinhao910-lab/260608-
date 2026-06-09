export default function SectorLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8f4ec] p-6 text-black">
      <div className="route-countdown-card">
        <div className="route-countdown-texture" />
        <div className="route-countdown-meta">加载草图 / 板块页面</div>
        <div className="route-countdown-copy">
          <p>即将进入</p>
          <h2>研究展区</h2>
        </div>
        <div className="route-countdown-center" aria-hidden="true">
          <div className="route-sketch">
            <span className="route-sketch-body" />
            <span className="route-sketch-eye route-sketch-eye-left" />
            <span className="route-sketch-eye route-sketch-eye-right" />
            <span className="route-sketch-mouth" />
            <span className="route-sketch-arm route-sketch-arm-left" />
            <span className="route-sketch-arm route-sketch-arm-right" />
          </div>
          <span className="countdown-sequence" aria-label="3 2 1">
            <span className="countdown-number">3</span>
            <span className="countdown-number">2</span>
            <span className="countdown-number">1</span>
          </span>
        </div>
      </div>
    </main>
  );
}
