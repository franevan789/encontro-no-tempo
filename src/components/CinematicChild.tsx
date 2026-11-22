import { AbsoluteFill, interpolate, spring } from "remotion";

interface CinematicChildProps {
  frame: number;
  scene: string;
  width: number;
  height: number;
  opacity: number;
}

const EXPRESSIONS: Record<string, {
  eyes: { openness: number; direction: number; dilation: number };
  brows: { inner: number; outer: number; height: number };
  mouth: { openness: number; width: number; curve: number; tension: number };
  headTilt: number;
  breathRate: number;
}> = {
  hook: { eyes: { openness: 1.0, direction: 0, dilation: 0.8 }, brows: { inner: 0.7, outer: 0.5, height: 0.6 }, mouth: { openness: 0.4, width: 0.8, curve: 0.1, tension: 0.2 }, headTilt: -5, breathRate: 1.2 },
  dreams: { eyes: { openness: 0.9, direction: 0.1, dilation: 0.9 }, brows: { inner: 0.3, outer: 0.2, height: 0.8 }, mouth: { openness: 0.3, width: 1.0, curve: 0.6, tension: 0.1 }, headTilt: 3, breathRate: 1.1 },
  reality: { eyes: { openness: 0.7, direction: -0.1, dilation: 0.5 }, brows: { inner: 0.5, outer: 0.4, height: 0.3 }, mouth: { openness: 0.2, width: 0.6, curve: -0.1, tension: 0.3 }, headTilt: 0, breathRate: 1.0 },
  question: { eyes: { openness: 0.85, direction: 0, dilation: 0.7 }, brows: { inner: 0.6, outer: 0.3, height: 0.7 }, mouth: { openness: 0.25, width: 0.7, curve: 0.05, tension: 0.2 }, headTilt: 8, breathRate: 1.05 },
  flashback: { eyes: { openness: 0.6, direction: -0.2, dilation: 0.4 }, brows: { inner: 0.4, outer: 0.5, height: 0.2 }, mouth: { openness: 0.15, width: 0.5, curve: -0.2, tension: 0.4 }, headTilt: -3, breathRate: 0.9 },
  discovery: { eyes: { openness: 1.0, direction: 0.15, dilation: 0.85 }, brows: { inner: 0.8, outer: 0.4, height: 0.9 }, mouth: { openness: 0.35, width: 0.85, curve: 0.3, tension: 0.15 }, headTilt: 5, breathRate: 1.15 },
  demo: { eyes: { openness: 0.85, direction: 0.1, dilation: 0.7 }, brows: { inner: 0.3, outer: 0.2, height: 0.6 }, mouth: { openness: 0.3, width: 0.9, curve: 0.5, tension: 0.1 }, headTilt: -2, breathRate: 1.1 },
  teaching: { eyes: { openness: 0.8, direction: -0.05, dilation: 0.6 }, brows: { inner: 0.2, outer: 0.1, height: 0.4 }, mouth: { openness: 0.25, width: 0.8, curve: 0.4, tension: 0.1 }, headTilt: 0, breathRate: 1.0 },
  practice: { eyes: { openness: 0.9, direction: 0.2, dilation: 0.8 }, brows: { inner: 0.5, outer: 0.3, height: 0.7 }, mouth: { openness: 0.3, width: 0.7, curve: 0.2, tension: 0.25 }, headTilt: -4, breathRate: 1.2 },
  victory: { eyes: { openness: 0.95, direction: 0, dilation: 0.9 }, brows: { inner: 0.6, outer: 0.3, height: 0.8 }, mouth: { openness: 0.4, width: 1.0, curve: 0.7, tension: 0.05 }, headTilt: 2, breathRate: 1.1 },
  promise: { eyes: { openness: 0.75, direction: -0.1, dilation: 0.65 }, brows: { inner: 0.3, outer: 0.4, height: 0.5 }, mouth: { openness: 0.2, width: 0.7, curve: 0.3, tension: 0.15 }, headTilt: 4, breathRate: 0.95 },
};

export const CinematicChild = ({ frame, scene, width, height, opacity }: CinematicChildProps) => {
  const scenes = ["hook", "dreams", "reality", "question", "flashback", "discovery", "demo", "teaching", "practice", "victory", "promise"];
  const sceneIdx = scenes.indexOf(scene);
  if (sceneIdx < 0 || opacity < 0.01) return null;

  // Animation values
  const breathe = spring({ frame, fps: 30, config: { damping: 18, stiffness: 60 } });
  const idleSway = Math.sin(frame * 0.008) * 0.5 + Math.sin(frame * 0.013) * 0.3;
  const blinkCycle = Math.sin(frame * 0.05) > 0.95 ? 0 : 1; // Procedural blink

  const expr = EXPRESSIONS[scene] || EXPRESSIONS.hook;
  const nextScene = scenes[Math.min(sceneIdx + 1, scenes.length - 1)];
  const nextExpr = EXPRESSIONS[nextScene] || expr;
  const sceneProgress = Math.max(0, Math.min(1, (frame - sceneIdx * 150) / 150));

  // Interpolate expressions between scenes
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const eyeOpenness = lerp(expr.eyes.openness, nextExpr.eyes.openness, sceneProgress) * blinkCycle;
  const mouthCurve = lerp(expr.mouth.curve, nextExpr.mouth.curve, sceneProgress);
  const headTilt = lerp(expr.headTilt, nextExpr.headTilt, sceneProgress) + idleSway;

  // Position - left third, slightly lower
  const baseX = width * 0.22;
  const baseY = height * 0.62;
  const posX = baseX + Math.sin(frame * 0.006) * 3;
  const posY = baseY + breathe * 1.5 + Math.sin(frame * 0.01) * 1.5;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute",
        left: posX,
        top: posY,
        transform: `translate(-50%, -50%) rotate(${headTilt}deg)`,
        opacity,
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))",
        transformStyle: "preserve-3d",
      }}>
        {/* Clothing - hoodie with realistic fabric */}
        <div style={{
          position: "relative",
          width: "200px",
          height: "280px",
          transformStyle: "preserve-3d",
        }}>
          {/* Hoodie body */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "160px",
            height: "180px",
            background: "linear-gradient(180deg, #1e2a3a 0%, #0f1520 100%)",
            borderRadius: "20px 20px 40px 40px",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5), 0 0 60px rgba(0,212,255,0.05)",
            border: "1px solid rgba(30, 60, 90, 0.5)",
            transformStyle: "preserve-3d",
            zIndex: 1,
          }}>
            {/* Fabric texture */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fabric'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fabric)' opacity='0.03'/%3E%3C/svg%3E")`,
              borderRadius: "20px 20px 40px 40px",
              pointerEvents: "none",
            }} />
            {/* Zipper */}
            <div style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "2px",
              height: "80px",
              background: "linear-gradient(180deg, #3a4a5a 0%, #2a3a4a 100%)",
              boxShadow: "1px 0 2px rgba(255,255,255,0.1), -1px 0 2px rgba(0,0,0,0.3)",
            }} />
            {/* Hood */}
            <div style={{
              position: "absolute",
              top: "-50px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "140px",
              height: "70px",
              background: "linear-gradient(180deg, #1e2a3a 0%, #0f1520 100%)",
              borderRadius: "0 0 70px 70px",
              boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.3), 0 5px 20px rgba(0,0,0,0.4)",
              border: "1px solid rgba(30, 60, 90, 0.5)",
              borderBottom: "none",
              zIndex: 2,
            }}>
              {/* Drawstrings */}
              <div style={{
                position: "absolute",
                top: "15px",
                left: "20px",
                width: "8px",
                height: "30px",
                background: "linear-gradient(180deg, #2a3a4a 0%, #1a2a3a 100%)",
                borderRadius: "4px",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }} />
              <div style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                width: "8px",
                height: "30px",
                background: "linear-gradient(180deg, #2a3a4a 0%, #1a2a3a 100%)",
                borderRadius: "4px",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }} />
            </div>
          </div>

          {/* Neck */}
          <div style={{
            position: "absolute",
            bottom: "170px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "32px",
            height: "20px",
            background: "linear-gradient(180deg, #e8c8b0 0%, #d4b090 100%)",
            borderRadius: "16px 16px 8px 8px",
            zIndex: 1,
            boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.2)",
          }} />

          {/* Head - realistic proportions */}
          <div style={{
            position: "absolute",
            bottom: "185px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "120px",
            background: "linear-gradient(180deg, #f0d4b8 0%, #e8c4a8 50%, #dcc0b0 100%)",
            borderRadius: "50px 50px 45px 45px",
            zIndex: 3,
            boxShadow: "inset 0 -5px 15px rgba(0,0,0,0.15), 0 8px 25px rgba(0,0,0,0.4)",
            position: "relative",
            transformStyle: "preserve-3d",
          }}>
            {/* Face shadow from hood */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "35px",
              background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
              borderRadius: "50px 50px 0 0",
              pointerEvents: "none",
            }} />

            {/* Ears */}
            <div style={{
              position: "absolute",
              top: "45px",
              left: "-8px",
              width: "14px",
              height: "28px",
              background: "linear-gradient(90deg, #e8c8b0 0%, #dcc0b0 100%)",
              borderRadius: "0 14px 14px 0",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2)",
              zIndex: 0,
            }} />
            <div style={{
              position: "absolute",
              top: "45px",
              right: "-8px",
              width: "14px",
              height: "28px",
              background: "linear-gradient(90deg, #dcc0b0 0%, #e8c8b0 100%)",
              borderRadius: "14px 0 0 14px",
              boxShadow: "inset 2px 0 4px rgba(0,0,0,0.2)",
              zIndex: 0,
            }} />

            {/* Hair - short, textured */}
            <div style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "110px",
              height: "55px",
              background: "linear-gradient(180deg, #2d1f1a 0%, #1a1210 100%)",
              borderRadius: "55px 55px 20px 20px",
              zIndex: 4,
              boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            }}>
              {/* Hair strands texture */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='hair'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.08' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23hair)' opacity='0.05'/%3E%3C/svg%3E")`,
                borderRadius: "55px 55px 20px 20px",
              }} />
            </div>

            {/* Eyebrows */}
            <div style={{
              position: "absolute",
              top: "28px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70px",
              height: "12px",
              display: "flex",
              justifyContent: "space-between",
              zIndex: 5,
            }}>
              <div style={{
                width: "26px",
                height: "5px",
                background: "#2d1f1a",
                borderRadius: "3px",
                transform: `rotate(${lerp(expr.brows.inner, nextExpr.brows.inner, sceneProgress) * 15}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                marginLeft: "2px",
              }} />
              <div style={{
                width: "26px",
                height: "5px",
                background: "#2d1f1a",
                borderRadius: "3px",
                transform: `rotate(${-lerp(expr.brows.outer, nextExpr.brows.outer, sceneProgress) * 10}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                marginRight: "2px",
              }} />
            </div>

            {/* Eyes - realistic with depth */}
            <div style={{
              position: "absolute",
              top: "38px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "76px",
              height: "28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 5,
            }}>
              {["left", "right"].map((side) => (
                <div key={side} style={{
                  position: "relative",
                  width: "32px",
                  height: lerp(expr.eyes.openness, nextExpr.eyes.openness, sceneProgress) * 28,
                  background: "#1a1512",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5), 0 -1px 2px rgba(255,255,255,0.05)",
                  transform: side === "left" ? "scaleX(1)" : "scaleX(-1)",
                }}>
                  {/* Sclera with subtle veins */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at center, #f5f0e8 0%, #e8e0d8 50%, #ddd0c0 100%)",
                    opacity: 0.95,
                  }} />
                  {/* Iris */}
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${lerp(expr.eyes.direction, nextExpr.eyes.direction, sceneProgress) * 10}deg)`,
                    width: lerp(expr.eyes.dilation, nextExpr.eyes.dilation, sceneProgress) * 18,
                    height: lerp(expr.eyes.dilation, nextExpr.eyes.dilation, sceneProgress) * 18,
                    background: "radial-gradient(circle at 30% 30%, #3b82f6 0%, #1e40af 60%, #0f1a3a 100%)",
                    borderRadius: "50%",
                    boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.1)",
                  }}>
                    {/* Pupil */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "6px",
                      height: "6px",
                      background: "#050508",
                      borderRadius: "50%",
                    }} />
                    {/* Catchlight - key light reflection */}
                    <div style={{
                      position: "absolute",
                      top: "15%",
                      left: "20%",
                      width: "5px",
                      height: "5px",
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "50%",
                      filter: "blur(0.5px)",
                    }} />
                    {/* Fill light catchlight */}
                    <div style={{
                      position: "absolute",
                      bottom: "10%",
                      right: "15%",
                      width: "3px",
                      height: "3px",
                      background: "rgba(255,255,255,0.4)",
                      borderRadius: "50%",
                    }} />
                  </div>
                  {/* Upper eyelid shadow */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }} />
                </div>
              ))}
            </div>

            {/* Nose - subtle */}
            <div style={{
              position: "absolute",
              top: "68px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "14px",
              height: "18px",
              background: "linear-gradient(180deg, transparent 0%, #d4b8a0 50%, #c8a890 100%)",
              borderRadius: "7px 7px 8px 8px",
              opacity: 0.6,
              zIndex: 5,
            }}>
              <div style={{
                position: "absolute",
                bottom: "2px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "8px",
                height: "4px",
                background: "#c8a890",
                borderRadius: "4px 4px 0 0",
                opacity: 0.5,
              }} />
            </div>

            {/* Mouth */}
            <div style={{
              position: "absolute",
              top: "88px",
              left: "50%",
              transform: `translateX(-50%)`,
              width: lerp(expr.mouth.width, nextExpr.mouth.width, sceneProgress) * 36,
              height: lerp(expr.mouth.openness, nextExpr.mouth.openness, sceneProgress) * 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}>
              <div style={{
                width: "100%",
                height: "3px",
                background: "linear-gradient(90deg, #8b5a4a 0%, #a06a50 50%, #8b5a4a 100%)",
                borderRadius: "2px",
                transform: `rotate(${lerp(expr.mouth.curve, nextExpr.mouth.curve, sceneProgress) * 20}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                opacity: 0.8,
              }} />
              {/* Lower lip highlight */}
              <div style={{
                position: "absolute",
                bottom: "-2px",
                left: "10%",
                right: "10%",
                height: "2px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                borderRadius: "1px",
              }} />
            </div>

            {/* Cheek blush - subtle */}
            {["left", "right"].map((side) => (
              <div key={side} style={{
                position: "absolute",
                top: "70px",
                [side]: "12px",
                width: "20px",
                height: "14px",
                background: "radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)",
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 4,
              }} />
            ))}

            {/* Freckles - subtle skin detail */}
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={{
                position: "absolute",
                top: `${55 + (i % 3) * 8}px`,
                left: `${35 + (i % 2) * 25}px`,
                width: "1.5px",
                height: "1.5px",
                background: "rgba(139, 100, 80, 0.3)",
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 5,
              }} />
            ))}
          </div>
        </div>

        {/* Label - clean typography */}
        <div style={{
          position: "absolute",
          bottom: "-48px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(10, 10, 18, 0.9)",
          border: "1px solid rgba(0, 212, 255, 0.3)",
          borderRadius: "100px",
          padding: "6px 20px",
          fontSize: "13px",
          fontWeight: "400",
          letterSpacing: "0.1em",
          color: "#00d4ff",
          fontFamily: "'Space Grotesk', 'Inter', system-ui",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
        }}>Criança · 7 anos</div>
      </div>
    </AbsoluteFill>
  );
};