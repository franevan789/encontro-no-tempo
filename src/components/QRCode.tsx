import { AbsoluteFill, interpolate } from "remotion";

export const QRCode = ({ frame, scene, width, height }: { frame: number; scene: string; width: number; height: number }) => {
  if (scene !== "cta") return null;
  const show = interpolate(frame, [0, 30], [0, 1], { extrapolate: "clamp" });
  const qrSize = 200;
  const modules = 25;
  const moduleSize = qrSize / modules;
  const qrPattern = Array.from({ length: modules * modules }, (_, i) => {
    const x = i % modules;
    const y = Math.floor(i / modules);
    const isFinder = (x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17);
    const isTiming = (x === 6 || y === 6) && (x < 8 || x > 16 || y < 8 || y > 16);
    const isData = Math.sin(x * 0.8 + y * 0.5 + frame * 0.01) > 0.3;
    const on = isFinder || isTiming || (isData && !isFinder && !isTiming);
    return on ? <rect key={i} x={x * moduleSize} y={y * moduleSize} width={moduleSize} height={moduleSize} fill="#00d4ff" opacity={0.9} /> : null;
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: show, transform: `scale(${interpolate(frame, [0, 20], [0.5, 1], { extrapolate: "clamp" })})`, textAlign: "center" }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,212,255,0.3)", display: "inline-block" }}>
          <svg width={qrSize} height={qrSize}>{qrPattern}</svg>
        </div>
        <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          <div style={{ fontSize: "48px", fontWeight: "900", background: "linear-gradient(90deg, #00d4ff, #7c3aed, #f472b6)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "system-ui", letterSpacing: "-2px" }}>Free Claude Code</div>
          <div style={{ fontSize: "28px", color: "#94a3b8", fontFamily: "system-ui" }}>Custo Zero • Liberdade Total • Seu</div>
          <div style={{ marginTop: "20px", fontSize: "20px", color: "#64748b", fontFamily: "monospace" }}>github.com/franevan789/encontro-no-tempo</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};