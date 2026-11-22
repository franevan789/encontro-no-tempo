import { AbsoluteFill, interpolate, spring } from "remotion";

export const Adult = ({ frame, scene, width, height, opacity: baseOpacity = 1 }: { frame: number; scene: string; width: number; height: number; opacity?: number }) => {
  const scenes = ["reality", "question", "flashback", "discovery", "demo", "teaching", "practice", "victory", "promise"];
  const idx = scenes.indexOf(scene);
  if (idx < 0) return null;
  const float = Math.sin(frame * 0.03) * 5;
  const breathe = spring({ frame, fps: 30, config: { damping: 20, stiffness: 80 } });
  const x = interpolate(frame, [idx * 150, idx * 150 + 30], [width * 0.85, width * 0.75], { extrapolate: "clamp" });
  const y = height * 0.52 + float;
  const expressions: Record<string, { eyes: string; mouth: string; posture: number }> = {
    reality: { eyes: "😔", mouth: "😐", posture: 0 },
    question: { eyes: "🤨", mouth: "😕", posture: 5 },
    flashback: { eyes: "😰", mouth: "😟", posture: 10 },
    discovery: { eyes: "😌", mouth: "😊", posture: -5 },
    demo: { eyes: "😎", mouth: "😏", posture: -10 },
    teaching: { eyes: "😊", mouth: "😌", posture: -5 },
    practice: { eyes: "👀", mouth: "😮", posture: 0 },
    victory: { eyes: "🥲", mouth: "😊", posture: -5 },
    promise: { eyes: "🥹", mouth: "😊", posture: -5 },
  };
  const expr = expressions[scene] || expressions.reality;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${expr.posture * 0.5}deg)`, opacity: baseOpacity }}>
        <div style={{ width: "140px", height: "200px", background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", borderRadius: "50px 50px 30px 30px", border: "2px solid #334155", boxShadow: "0 30px 80px rgba(0,0,0,0.4)", position: "relative" }}>
          <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "16px", height: "60px", background: "linear-gradient(180deg, #f472b6 0%, #c026d3 100%)", clipPath: "polygon(50% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)" }} />
          <div style={{ position: "relative", width: "110px", height: "110px", margin: "-35px auto 0", background: "linear-gradient(180deg, #fdbcb4 0%, #f5a990 100%)", borderRadius: "50%", boxShadow: "0 15px 40px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "52px" }}>
            <span style={{ transform: `scale(${1 + breathe * 0.05})`, display: "inline-block" }}>{expr.eyes}{expr.mouth}</span>
          </div>
          <div style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "120px", height: "50px", background: "#1e293b", borderRadius: "60px 60px 0 0" }} />
        </div>
        <div style={{ position: "absolute", bottom: "-40px", left: "50%", transform: "translateX(-50%)", background: "rgba(244,114,182,0.2)", border: "1px solid #f472b6", borderRadius: "20px", padding: "4px 16px", fontSize: "14px", color: "#f472b6", fontFamily: "system-ui", whiteSpace: "nowrap" }}>Adulto (35 anos)</div>
      </div>
    </AbsoluteFill>
  );
};