import { AbsoluteFill, interpolate } from "remotion";

const SCENE_LOOKS: Record<string, {
  bgTop: string; bgBottom: string;
  accent: string;
  lightDir: number;
  temp: "warm" | "cool" | "neutral";
  practicalLights: Array<{ x: number; y: number; color: string; intensity: number }>;
}> = {
  hook: {
    bgTop: "#0a0a12", bgBottom: "#050508",
    accent: "#00d4ff",
    lightDir: 225,
    temp: "cool",
    practicalLights: [{ x: 0.15, y: 0.45, color: "#00d4ff", intensity: 0.3 }]
  },
  dreams: {
    bgTop: "#120820", bgBottom: "#080410",
    accent: "#7c3aed",
    lightDir: 315,
    temp: "cool",
    practicalLights: [
      { x: 0.2, y: 0.3, color: "#7c3aed", intensity: 0.25 },
      { x: 0.8, y: 0.6, color: "#a855f7", intensity: 0.15 }
    ]
  },
  reality: {
    bgTop: "#1a1410", bgBottom: "#0d0805",
    accent: "#f472b6",
    lightDir: 180,
    temp: "warm",
    practicalLights: [
      { x: 0.75, y: 0.5, color: "#f472b6", intensity: 0.3 },
      { x: 0.5, y: 0.8, color: "#eab308", intensity: 0.2 }
    ]
  },
  question: {
    bgTop: "#180f18", bgBottom: "#0a050a",
    accent: "#f97316",
    lightDir: 135,
    temp: "warm",
    practicalLights: [{ x: 0.3, y: 0.4, color: "#f97316", intensity: 0.35 }]
  },
  flashback: {
    bgTop: "#10151a", bgBottom: "#06080c",
    accent: "#eab308",
    lightDir: 45,
    temp: "neutral",
    practicalLights: [
      { x: 0.2, y: 0.7, color: "#eab308", intensity: 0.2 },
      { x: 0.8, y: 0.3, color: "#f97316", intensity: 0.15 }
    ]
  },
  discovery: {
    bgTop: "#08121a", bgBottom: "#030608",
    accent: "#00d4ff",
    lightDir: 270,
    temp: "cool",
    practicalLights: [
      { x: 0.5, y: 0.35, color: "#00d4ff", intensity: 0.4 },
      { x: 0.25, y: 0.55, color: "#06b6d4", intensity: 0.2 }
    ]
  },
  demo: {
    bgTop: "#061018", bgBottom: "#020508",
    accent: "#00d4ff",
    lightDir: 225,
    temp: "cool",
    practicalLights: [
      { x: 0.3, y: 0.4, color: "#00d4ff", intensity: 0.35 },
      { x: 0.7, y: 0.4, color: "#22c55e", intensity: 0.25 }
    ]
  },
  teaching: {
    bgTop: "#10081a", bgBottom: "#06030a",
    accent: "#7c3aed",
    lightDir: 315,
    temp: "cool",
    practicalLights: [
      { x: 0.2, y: 0.5, color: "#7c3aed", intensity: 0.3 },
      { x: 0.8, y: 0.5, color: "#a855f7", intensity: 0.2 }
    ]
  },
  practice: {
    bgTop: "#081510", bgBottom: "#030805",
    accent: "#22c55e",
    lightDir: 180,
    temp: "neutral",
    practicalLights: [
      { x: 0.5, y: 0.45, color: "#22c55e", intensity: 0.4 },
      { x: 0.5, y: 0.7, color: "#06b6d4", intensity: 0.25 }
    ]
  },
  victory: {
    bgTop: "#061810", bgBottom: "#020805",
    accent: "#22c55e",
    lightDir: 135,
    temp: "warm",
    practicalLights: [
      { x: 0.25, y: 0.5, color: "#22c55e", intensity: 0.35 },
      { x: 0.75, y: 0.5, color: "#00d4ff", intensity: 0.25 }
    ]
  },
  promise: {
    bgTop: "#100815", bgBottom: "#060307",
    accent: "#7c3aed",
    lightDir: 45,
    temp: "warm",
    practicalLights: [
      { x: 0.3, y: 0.45, color: "#7c3aed", intensity: 0.3 },
      { x: 0.7, y: 0.45, color: "#f472b6", intensity: 0.25 }
    ]
  },
  cta: {
    bgTop: "#0a0a12", bgBottom: "#050508",
    accent: "#f472b6",
    lightDir: 270,
    temp: "cool",
    practicalLights: [
      { x: 0.5, y: 0.3, color: "#f472b6", intensity: 0.3 },
      { x: 0.5, y: 0.7, color: "#00d4ff", intensity: 0.2 }
    ]
  },
};

export const CinematicBackground = ({
  frame,
  scene,
  width,
  height
}: {
  frame: number;
  scene: string;
  width: number;
  height: number;
}) => {
  const current = SCENE_LOOKS[scene] || SCENE_LOOKS.hook;
  const nextSceneName = Object.keys(SCENE_LOOKS)[(Object.keys(SCENE_LOOKS).indexOf(scene) + 1) % Object.keys(SCENE_LOOKS).length];
  const next = SCENE_LOOKS[nextSceneName];

  const sceneFrames = 150;
  const sceneStart = Object.keys(SCENE_LOOKS).indexOf(scene) * sceneFrames;
  const progress = Math.max(0, Math.min(1, (frame - sceneStart) / sceneFrames));

  const lerpColor = (c1: string, c2: string, t: number) => {
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    if (!rgb1 || !rgb2) return c1;
    return `rgb(${Math.round(rgb1.r + (rgb2.r - rgb1.r) * t)}, ${Math.round(rgb1.g + (rgb2.g - rgb1.g) * t)}, ${Math.round(rgb1.b + (rgb2.b - rgb1.b) * t)})`;
  };

  const bgTop = progress < 0.7 ? current.bgTop : lerpColor(current.bgTop, next.bgTop, (progress - 0.7) / 0.3);
  const bgBottom = progress < 0.7 ? current.bgBottom : lerpColor(current.bgBottom, next.bgBottom, (progress - 0.7) / 0.3);
  const accent = current.accent;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${bgTop} 0%, ${bgBottom} 100%)`,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Atmospheric fog/volume */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 60% at ${current.lightDir > 180 ? '20%' : '80%'} ${current.temp === 'warm' ? '60%' : '40%'}, ${accent}15 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Practical light sources */}
      {current.practicalLights.map((light, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${light.x * 100}%`,
          top: `${light.y * 100}%`,
          width: "400px",
          height: "400px",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${light.color}${Math.round(light.intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          pointerEvents: "none",
          filter: "blur(100px)",
          animation: `pulse ${3 + i * 0.7}s ease-in-out infinite`,
        }} />
      ))}

      {/* Subtle film texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.02,
        pointerEvents: "none",
        mixBlendMode: "overlay",
      }} />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </AbsoluteFill>
  );
};

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}