import { AbsoluteFill, interpolate, spring } from "remotion";

export const Child = ({ frame, scene, width, height, opacity: baseOpacity = 1 }: { frame: number; scene: string; width: number; height: number; opacity?: number }) => {
  const scenes = ["hook", "dreams", "reality", "question", "flashback", "discovery", "demo", "teaching", "practice", "victory", "promise"];
  const idx = scenes.indexOf(scene);
  if (idx < 0) return null;
  const float = Math.sin(frame * 0.05) * 10;
  const x = interpolate(frame, [idx * 150, idx * 150 + 30], [width * 0.15, width * 0.25], { extrapolate: "clamp" });
  const y = height * 0.55 + float;
  const expressions: Record<string, { eyes: string; mouth: string; scale: number }> = {
    hook: { eyes: "😲", mouth: "😮", scale: 1.1 },
    dreams: { eyes: "✨", mouth: "😄", scale: 1.05 },
    reality: { eyes: "😯", mouth: "😐", scale: 1 },
    question: { eyes: "🤔", mouth: "😮", scale: 1 },
    flashback: { eyes: "😧", mouth: "😯", scale: 0.95 },
    discovery: { eyes: "🤩", mouth: "😲", scale: 1.1 },
    demo: { eyes: "😎", mouth: "😄", scale: 1.05 },
    teaching: { eyes: "🤓", mouth: "😊", scale: 1 },
    practice: { eyes: "😤", mouth: "😤", scale: 1.1 },
    victory: { eyes: "🏆", mouth: "😁", scale: 1.15 },
    promise: { eyes: "🥺", mouth: "😊", scale: 1 },
  };
  const expr = expressions[scene] || expressions.hook;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: baseOpacity }}>
        <div style={{ width: "120px", height: "160px", background: "linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)", borderRadius: "60px 60px 40px 40px", boxShadow: "0 20px 60px rgba(59,130,246,0.3)" }}>
          <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto -30px", background: "linear-gradient(180deg, #fdbcb4 0%, #f5a990 100%)", borderRadius: "50%", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
            <span style={{ transform: `scale(${expr.scale})`, display: "inline-block" }}>{expr.eyes}{expr.mouth}</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: "-20px", top: "40px", width: "40px", height: "60px", background: "#f97316", borderRadius: "8px 0 0 8px" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "50%", transform: "translateX(-50%)", background: "rgba(0,212,255,0.2)", border: "1px solid #00d4ff", borderRadius: "20px", padding: "4px 16px", fontSize: "14px", color: "#00d4ff", fontFamily: "system-ui", whiteSpace: "nowrap" }}>Criança (7 anos)</div>
      </div>
    </AbsoluteFill>
  );
};