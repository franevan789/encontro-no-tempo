import { AbsoluteFill } from "remotion";

interface CinematicParticlesProps {
  frame: number;
  scene: string;
  width: number;
  height: number;
}

const SCENE_PARTICLES: Record<string, {
  dustDensity: number;
  dustSize: { min: number; max: number };
  floatSpeed: number;
  swirl: number;
  glowParticles: boolean;
  emberCount: number;
  lightShafts: boolean;
}> = {
  hook: { dustDensity: 0.8, dustSize: { min: 1, max: 3 }, floatSpeed: 0.3, swirl: 0.1, glowParticles: false, emberCount: 0, lightShafts: true },
  dreams: { dustDensity: 1.2, dustSize: { min: 0.5, max: 2.5 }, floatSpeed: 0.5, swirl: 0.3, glowParticles: true, emberCount: 15, lightShafts: true },
  reality: { dustDensity: 0.5, dustSize: { min: 1, max: 4 }, floatSpeed: 0.2, swirl: 0.05, glowParticles: false, emberCount: 0, lightShafts: true },
  question: { dustDensity: 0.7, dustSize: { min: 1, max: 3 }, floatSpeed: 0.4, swirl: 0.2, glowParticles: true, emberCount: 8, lightShafts: true },
  flashback: { dustDensity: 1.0, dustSize: { min: 1.5, max: 5 }, floatSpeed: 0.15, swirl: 0.0, glowParticles: false, emberCount: 0, lightShafts: true },
  discovery: { dustDensity: 0.9, dustSize: { min: 0.8, max: 3 }, floatSpeed: 0.6, swirl: 0.4, glowParticles: true, emberCount: 20, lightShafts: true },
  demo: { dustDensity: 0.6, dustSize: { min: 0.5, max: 2 }, floatSpeed: 0.7, swirl: 0.5, glowParticles: true, emberCount: 25, lightShafts: true },
  teaching: { dustDensity: 0.5, dustSize: { min: 0.5, max: 2 }, floatSpeed: 0.4, swirl: 0.3, glowParticles: true, emberCount: 15, lightShafts: true },
  practice: { dustDensity: 0.7, dustSize: { min: 0.8, max: 3 }, floatSpeed: 0.5, swirl: 0.35, glowParticles: true, emberCount: 18, lightShafts: true },
  victory: { dustDensity: 1.0, dustSize: { min: 0.5, max: 3 }, floatSpeed: 0.8, swirl: 0.6, glowParticles: true, emberCount: 30, lightShafts: true },
  promise: { dustDensity: 0.8, dustSize: { min: 0.8, max: 3.5 }, floatSpeed: 0.3, swirl: 0.2, glowParticles: true, emberCount: 12, lightShafts: true },
  cta: { dustDensity: 0.6, dustSize: { min: 1, max: 3 }, floatSpeed: 0.25, swirl: 0.1, glowParticles: false, emberCount: 0, lightShafts: true },
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateParticles(
  count: number,
  frame: number,
  width: number,
  height: number,
  config: typeof SCENE_PARTICLES[string],
  type: "dust" | "glow" | "ember"
) {
  const particles = [];
  const baseSeed = frame * 1000 + (type === "dust" ? 0 : type === "glow" ? 10000 : 20000);

  for (let i = 0; i < count; i++) {
    const seed = baseSeed + i * 137;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed * 2);
    const r3 = seededRandom(seed * 3);
    const r4 = seededRandom(seed * 4);
    const r5 = seededRandom(seed * 5);

    const x = r1 * width;
    const yBase = r2 * height;
    const floatOffset = Math.sin(frame * config.floatSpeed * 0.01 + seed) * (height * 0.15);
    const swirlOffset = Math.cos(frame * config.swirl * 0.005 + seed) * (width * 0.08);
    const y = (yBase + floatOffset + frame * config.floatSpeed * 0.5) % height;
    const xFinal = (x + swirlOffset) % width;

    const size = config.dustSize.min + r3 * (config.dustSize.max - config.dustSize.min);
    const opacityBase = 0.1 + r4 * 0.3;
    const pulseOpacity = 0.8 + 0.2 * Math.sin(frame * 0.02 + seed * 10);

    if (type === "dust") {
      particles.push(
        <circle
          key={i}
          cx={xFinal < 0 ? xFinal + width : xFinal}
          cy={y < 0 ? y + height : y}
          r={size}
          fill="white"
          fillOpacity={opacityBase * pulseOpacity * 0.6}
          filter="blur(0.5px)"
        />
      );
    } else if (type === "glow") {
      const hue = 180 + r5 * 60;
      particles.push(
        <circle
          key={i}
          cx={xFinal < 0 ? xFinal + width : xFinal}
          cy={y < 0 ? y + height : y}
          r={size * 1.5}
          fill={`hsl(${hue}, 80%, 60%)`}
          fillOpacity={opacityBase * pulseOpacity * 0.4}
          filter="blur(2px)"
        />
      );
    } else if (type === "ember") {
      const life = (frame * 0.5 + seed * 100) % 200;
      const emberY = height - (life / 200) * height * 1.5;
      const emberX = (width * 0.5 + Math.sin(frame * 0.01 + seed) * width * 0.3) % width;
      particles.push(
        <ellipse
          key={i}
          cx={emberX < 0 ? emberX + width : emberX}
          cy={emberY}
          rx={size * 0.8}
          ry={size * 1.2}
          fill={`hsl(${15 + r5 * 30}, 100%, ${50 + r4 * 30}%)`}
          fillOpacity={opacityBase * (1 - life / 200) * 0.8}
          filter="blur(1px)"
        />
      );
    }
  }
  return particles;
}

export const CinematicParticles = ({ frame, scene, width, height }: CinematicParticlesProps) => {
  const config = SCENE_PARTICLES[scene] || SCENE_PARTICLES.hook;

  const dustCount = Math.floor(80 * config.dustDensity);
  const glowCount = config.glowParticles ? Math.floor(30 * config.dustDensity) : 0;
  const emberCount = config.emberCount;

  // Light shafts (volumetric fog beams)
  const lightShafts = config.lightShafts ? (
    <defs>
      <radialGradient id="lightShaft1" cx="20%" cy="40%" r="60%" fx="20%" fy="40%">
        <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.08" />
        <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.02" />
        <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lightShaft2" cx="80%" cy="60%" r="50%" fx="80%" fy="60%">
        <stop offset="0%" stopColor="#f472b6" stopOpacity="0.06" />
        <stop offset="50%" stopColor="#f472b6" stopOpacity="0.01" />
        <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lightShaft3" cx="50%" cy="30%" r="40%" fx="50%" fy="30%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.05" />
        <stop offset="50%" stopColor="#22c55e" stopOpacity="0.01" />
        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
      </radialGradient>
    </defs>
  ) : null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "visible" }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {lightShafts}

        {/* Light shafts - volumetric beams */}
        {config.lightShafts && (
          <>
            <ellipse
              cx={width * 0.2}
              cy={height * 0.4}
              rx={width * 0.35}
              ry={height * 0.6}
              fill="url(#lightShaft1)"
              transform={`rotate(${Math.sin(frame * 0.001) * 2}, ${width * 0.2}, ${height * 0.4})`}
              style={{ mixBlendMode: "screen" }}
            />
            <ellipse
              cx={width * 0.8}
              cy={height * 0.6}
              rx={width * 0.25}
              ry={height * 0.5}
              fill="url(#lightShaft2)"
              transform={`rotate(${-Math.sin(frame * 0.001) * 1.5}, ${width * 0.8}, ${height * 0.6})`}
              style={{ mixBlendMode: "screen" }}
            />
            <ellipse
              cx={width * 0.5}
              cy={height * 0.3}
              rx={width * 0.2}
              ry={height * 0.4}
              fill="url(#lightShaft3)"
              style={{ mixBlendMode: "screen" }}
            />
          </>
        )}

        {/* Dust motes - main atmospheric layer */}
        <g style={{ mixBlendMode: "screen", opacity: 0.6 }}>
          {generateParticles(dustCount, frame, width, height, config, "dust")}
        </g>

        {/* Glow particles - magical/tech atmosphere */}
        {config.glowParticles && (
          <g style={{ mixBlendMode: "screen", opacity: 0.8 }}>
            {generateParticles(glowCount, frame, width, height, config, "glow")}
          </g>
        )}

        {/* Embers - warm rising particles */}
        {emberCount > 0 && (
          <g style={{ mixBlendMode: "screen", opacity: 0.9 }}>
            {generateParticles(emberCount, frame, width, height, config, "ember")}
          </g>
        )}

        {/* Lens dust - static imperfections on "camera" */}
        <g style={{ opacity: 0.03, pointerEvents: "none" }}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <circle
              key={i}
              cx={(width * 0.1 + (i * 137 % 100) / 100 * width * 0.8) % width}
              cy={(height * 0.15 + (i * 241 % 100) / 100 * height * 0.7) % height}
              r={1 + (i * 17 % 10) / 10 * 3}
              fill="white"
              fillOpacity={0.3 + (i * 31 % 10) / 10 * 0.4}
              filter="blur(0.3px)"
            />
          ))}
        </g>
      </svg>

      {/* CSS-based floating particles for performance on high counts */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
        {Array.from({ length: Math.min(dustCount, 50) }, (_, i) => {
          const seed = i * 997;
          const x = (seededRandom(seed) * 100).toFixed(2);
          const y = (seededRandom(seed * 2) * 100).toFixed(2);
          const size = (1 + seededRandom(seed * 3) * 2).toFixed(2);
          const delay = (seededRandom(seed * 4) * 8).toFixed(2);
          const duration = (6 + seededRandom(seed * 5) * 8).toFixed(2);
          const opacity = (0.05 + seededRandom(seed * 6) * 0.15).toFixed(3);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: "white",
                borderRadius: "50%",
                opacity: opacity,
                filter: "blur(0.5px)",
                animation: `float${i} ${duration}s ease-in-out ${delay}s infinite`,
                transformOrigin: "center",
              }}
            />
          );
        })}
        <style jsx global>{`
          @keyframes float0 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.08; } 25% { transform: translate(30px, -40px) scale(1.2); opacity: 0.15; } 50% { transform: translate(-20px, -80px) scale(0.8); opacity: 0.05; } 75% { transform: translate(-40px, -120px) scale(1.1); opacity: 0.12; } }
          @keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.06; } 25% { transform: translate(-25px, -35px) scale(0.9); opacity: 0.12; } 50% { transform: translate(15px, -70px) scale(1.3); opacity: 0.04; } 75% { transform: translate(35px, -110px) scale(0.7); opacity: 0.1; } }
          @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; } 25% { transform: translate(20px, -50px) scale(1.1); opacity: 0.18; } 50% { transform: translate(-30px, -90px) scale(0.9); opacity: 0.06; } 75% { transform: translate(-50px, -130px) scale(1.2); opacity: 0.14; } }
          @keyframes float3 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.07; } 25% { transform: translate(-15px, -30px) scale(1.3); opacity: 0.14; } 50% { transform: translate(25px, -60px) scale(0.8); opacity: 0.03; } 75% { transform: translate(45px, -100px) scale(1.1); opacity: 0.11; } }
          @keyframes float4 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.09; } 25% { transform: translate(35px, -45px) scale(0.9); opacity: 0.16; } 50% { transform: translate(-10px, -85px) scale(1.2); opacity: 0.05; } 75% { transform: translate(-30px, -125px) scale(0.8); opacity: 0.13; } }
        `}</style>
      </div>
    </AbsoluteFill>
  );
};