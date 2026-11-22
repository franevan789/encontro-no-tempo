import { AbsoluteFill, interpolate } from "remotion";

export const Background = ({ frame, scene, width, height }: { frame: number; scene: string; width: number; height: number }) => {
  const scenes = [
    { name: "hook", bg: "#0f0f23", accent: "#00d4ff" },
    { name: "dreams", bg: "#1a1a3a", accent: "#7c3aed" },
    { name: "reality", bg: "#1a1a2e", accent: "#f472b6" },
    { name: "question", bg: "#16213e", accent: "#f97316" },
    { name: "flashback", bg: "#0d1b2a", accent: "#eab308" },
    { name: "discovery", bg: "#0f0f23", accent: "#00d4ff" },
    { name: "demo", bg: "#0f0f23", accent: "#00d4ff" },
    { name: "teaching", bg: "#1a1a3a", accent: "#7c3aed" },
    { name: "practice", bg: "#16213e", accent: "#22c55e" },
    { name: "victory", bg: "#0f0f23", accent: "#00d4ff" },
    { name: "promise", bg: "#1a1a3a", accent: "#7c3aed" },
    { name: "cta", bg: "#0f0f23", accent: "#f472b6" },
  ];
  const currentIdx = scenes.findIndex(s => s.name === scene);
  const nextIdx = Math.min(currentIdx + 1, scenes.length - 1);
  const current = scenes[currentIdx >= 0 ? currentIdx : 0];
  const next = scenes[nextIdx];
  const sceneFrames = 150;
  const sceneStart = currentIdx * sceneFrames;
  const progress = Math.max(0, Math.min(1, (frame - sceneStart) / sceneFrames));
  const bg = progress < 0.5 ? current.bg : next.bg;
  const accent = progress < 0.5 ? current.accent : next.accent;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${bg} 0%, #050510 100%)` }}>
      <svg width={width} height={height} style={{ opacity: 0.03 }}>
        <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke={accent} strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", borderRadius: "50%", background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};