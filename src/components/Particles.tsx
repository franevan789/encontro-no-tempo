import { AbsoluteFill, interpolate } from "remotion";

export const Particles = ({ frame, scene, width, height }: { frame: number; scene: string; width: number; height: number }) => {
  const scenes = ["hook", "dreams", "discovery", "demo", "victory", "cta"];
  if (!scenes.includes(scene)) return null;
  const particleCount = scene === "hook" ? 50 : scene === "dreams" ? 80 : scene === "victory" ? 100 : 30;
  const colors = scene === "dreams" ? ["#7c3aed", "#a855f7", "#d946ef"] : scene === "victory" ? ["#22c55e", "#84cc16", "#a3e635"] : ["#00d4ff", "#06b6d4", "#0ea5e9"];
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const seed = i * 137.5;
    const radius = 100 + (i % 5) * 80;
    const angle = (frame * 0.002 + seed * 0.01) % (Math.PI * 2);
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius * 0.6;
    const size = 2 + (i % 4) * 2;
    const color = colors[i % colors.length];
    const opacity = interpolate(frame, [0, 30], [0, 0.6], { extrapolate: "clamp" });
    return <circle key={i} cx={x} cy={y} r={size} fill={color} opacity={opacity} style={{ filter: `blur(${size * 0.5}px)` }} />;
  });
  return <AbsoluteFill style={{ pointerEvents: "none" }}><svg width={width} height={height} style={{ overflow: "visible" }}>{particles}</svg></AbsoluteFill>;
};