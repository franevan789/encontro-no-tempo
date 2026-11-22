import { AbsoluteFill, interpolate, spring } from "remotion";

interface CinematicAdultProps {
  frame: number;
  scene: string;
  width: number;
  height: number;
  opacity: number;
}

const EXPRESSIONS: Record<string, {
  eyes: { openness: number; direction: number; dilation: number; fatigue: number };
  brows: { inner: number; outer: number; height: number; furrow: number };
  mouth: { openness: number; width: number; curve: number; tension: number };
  headTilt: number;
  breathRate: number;
  jawTension: number;
}> = {
  hook: { eyes: { openness: 0.8, direction: 0, dilation: 0.5, fatigue: 0.3 }, brows: { inner: 0.2, outer: 0.1, height: 0.2, furrow: 0.1 }, mouth: { openness: 0.15, width: 0.6, curve: -0.05, tension: 0.3 }, headTilt: 0, breathRate: 0.85, jawTension: 0.2 },
  dreams: { eyes: { openness: 0.7, direction: 0.1, dilation: 0.6, fatigue: 0.2 }, brows: { inner: 0.1, outer: 0.1, height: 0.3, furrow: 0.05 }, mouth: { openness: 0.2, width: 0.7, curve: 0.2, tension: 0.15 }, headTilt: -2, breathRate: 0.9, jawTension: 0.1 },
  reality: { eyes: { openness: 0.65, direction: -0.05, dilation: 0.45, fatigue: 0.4 }, brows: { inner: 0.4, outer: 0.2, height: 0.2, furrow: 0.3 }, mouth: { openness: 0.1, width: 0.5, curve: -0.15, tension: 0.4 }, headTilt: 0, breathRate: 0.8, jawTension: 0.35 },
  question: { eyes: { openness: 0.75, direction: 0, dilation: 0.55, fatigue: 0.25 }, brows: { inner: 0.5, outer: 0.2, height: 0.4, furrow: 0.2 }, mouth: { openness: 0.12, width: 0.55, curve: 0.0, tension: 0.25 }, headTilt: 3, breathRate: 0.88, jawTension: 0.15 },
  flashback: { eyes: { openness: 0.6, direction: -0.15, dilation: 0.4, fatigue: 0.5 }, brows: { inner: 0.3, outer: 0.3, height: 0.1, furrow: 0.25 }, mouth: { openness: 0.08, width: 0.45, curve: -0.2, tension: 0.45 }, headTilt: -4, breathRate: 0.75, jawTension: 0.4 },
  discovery: { eyes: { openness: 0.85, direction: 0.1, dilation: 0.7, fatigue: 0.15 }, brows: { inner: 0.6, outer: 0.3, height: 0.5, furrow: 0.1 }, mouth: { openness: 0.2, width: 0.75, curve: 0.25, tension: 0.2 }, headTilt: 2, breathRate: 0.95, jawTension: 0.1 },
  demo: { eyes: { openness: 0.8, direction: 0.05, dilation: 0.6, fatigue: 0.2 }, brows: { inner: 0.2, outer: 0.1, height: 0.3, furrow: 0.05 }, mouth: { openness: 0.18, width: 0.7, curve: 0.3, tension: 0.15 }, headTilt: -1, breathRate: 0.9, jawTension: 0.1 },
  teaching: { eyes: { openness: 0.75, direction: -0.05, dilation: 0.55, fatigue: 0.25 }, brows: { inner: 0.15, outer: 0.1, height: 0.25, furrow: 0.1 }, mouth: { openness: 0.15, width: 0.65, curve: 0.2, tension: 0.15 }, headTilt: 0, breathRate: 0.88, jawTension: 0.1 },
  practice: { eyes: { openness: 0.8, direction: 0.15, dilation: 0.65, fatigue: 0.2 }, brows: { inner: 0.4, outer: 0.2, height: 0.4, furrow: 0.15 }, mouth: { openness: 0.18, width: 0.6, curve: 0.1, tension: 0.2 }, headTilt: -3, breathRate: 0.92, jawTension: 0.15 },
  victory: { eyes: { openness: 0.9, direction: 0, dilation: 0.75, fatigue: 0.1 }, brows: { inner: 0.5, outer: 0.25, height: 0.45, furrow: 0.05 }, mouth: { openness: 0.25, width: 0.85, curve: 0.5, tension: 0.08 }, headTilt: 1, breathRate: 0.95, jawTension: 0.05 },
  promise: { eyes: { openness: 0.7, direction: -0.05, dilation: 0.5, fatigue: 0.3 }, brows: { inner: 0.25, outer: 0.2, height: 0.3, furrow: 0.15 }, mouth: { openness: 0.12, width: 0.6, curve: 0.2, tension: 0.2 }, headTilt: 2, breathRate: 0.85, jawTension: 0.1 },
};

export const CinematicAdult = ({ frame, scene, width, height, opacity }: CinematicAdultProps) => {
  const scenes = ["hook", "dreams", "reality", "question", "flashback", "discovery", "demo", "teaching", "practice", "victory", "promise"];
  const sceneIdx = scenes.indexOf(scene);
  if (sceneIdx < 0 || opacity < 0.01) return null;

  const breathe = spring({ frame, fps: 30, config: { damping: 22, stiffness: 45 } });
  const idleSway = Math.sin(frame * 0.005) * 0.3 + Math.sin(frame * 0.009) * 0.2;
  const blinkCycle = Math.sin(frame * 0.04) > 0.96 ? 0 : 1;

  const expr = EXPRESSIONS[scene] || EXPRESSIONS.hook;
  const nextScene = scenes[Math.min(sceneIdx + 1, scenes.length - 1)];
  const nextExpr = EXPRESSIONS[nextScene] || expr;
  const sceneProgress = Math.max(0, Math.min(1, (frame - sceneIdx * 150) / 150));

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const eyeOpenness = lerp(expr.eyes.openness, nextExpr.eyes.openness, sceneProgress) * blinkCycle;
  const mouthCurve = lerp(expr.mouth.curve, nextExpr.mouth.curve, sceneProgress);
  const headTilt = lerp(expr.headTilt, nextExpr.headTilt, sceneProgress) + idleSway;
  const jawTension = lerp(expr.jawTension, nextExpr.jawTension, sceneProgress);

  const baseX = width * 0.78;
  const baseY = height * 0.58;
  const posX = baseX + Math.sin(frame * 0.004) * 2;
  const posY = baseY + breathe * 1.2 + Math.sin(frame * 0.008) * 1.2;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute",
        left: posX,
        top: posY,
        transform: `translate(-50%, -50%) rotate(${headTilt}deg)`,
        opacity,
        filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))",
        transformStyle: "preserve-3d",
      }}>
        <div style={{
          position: "relative",
          width: "220px",
          height: "320px",
          transformStyle: "preserve-3d",
        }}>
          {/* Suit jacket - realistic fabric */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "180px",
            height: "220px",
            background: "linear-gradient(180deg, #0f1218 0%, #080a0d 100%)",
            borderRadius: "16px 16px 32px 32px",
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.03), 0 15px 40px rgba(0,0,0,0.6), 0 0 80px rgba(0,212,255,0.03)",
            border: "1px solid rgba(25, 35, 45, 0.5)",
            transformStyle: "preserve-3d",
            zIndex: 1,
          }}>
            {/* Fabric texture */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wool'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wool)' opacity='0.04'/%3E%3C/svg%3E")`,
              borderRadius: "16px 16px 32px 32px",
              pointerEvents: "none",
            }} />
            {/* Lapels */}
            <div style={{
              position: "absolute",
              top: "20px",
              left: "15px",
              width: "50px",
              height: "100px",
              background: "linear-gradient(135deg, #0f1218 0%, #080a0d 100%)",
              borderRadius: "0 0 0 25px",
              clipPath: "polygon(0 0, 100% 0, 60% 100%, 0% 100%)",
              boxShadow: "inset 2px 0 4px rgba(0,0,0,0.3)",
              borderRight: "1px solid rgba(40, 50, 60, 0.3)",
            }} />
            <div style={{
              position: "absolute",
              top: "20px",
              right: "15px",
              width: "50px",
              height: "100px",
              background: "linear-gradient(135deg, #080a0d 0%, #0f1218 100%)",
              borderRadius: "0 0 25px 0",
              clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3)",
              borderLeft: "1px solid rgba(40, 50, 60, 0.3)",
            }} />
            {/* Buttons */}
            <div style={{
              position: "absolute",
              top: "60px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              zIndex: 2,
            }}>
              {[1,2].map((i) => (
                <div key={i} style={{
                  width: "12px",
                  height: "12px",
                  background: "radial-gradient(circle at 30% 30%, #2a3a4a 0%, #1a2a3a 100%)",
                  borderRadius: "50%",
                  border: "1px solid rgba(60, 80, 100, 0.4)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.5)",
                }} />
              ))}
            </div>
            {/* Pocket square - subtle accent */}
            <div style={{
              position: "absolute",
              top: "30px",
              right: "25px",
              width: "16px",
              height: "16px",
              background: "linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)",
              borderRadius: "2px",
              transform: "rotate(45deg)",
              opacity: 0.15,
              boxShadow: "0 0 10px rgba(0,212,255,0.3)",
            }} />
          </div>

          {/* Shirt collar */}
          <div style={{
            position: "absolute",
            bottom: "210px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "25px",
            background: "#faf8f5",
            borderRadius: "0 0 8px 8px",
            zIndex: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            <div style={{
              position: "absolute",
              top: "5px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70px",
              height: "15px",
              background: "linear-gradient(180deg, #f0ede8 0%, #e8e0d8 100%)",
              borderRadius: "0 0 6px 6px",
            }} />
          </div>

          {/* Tie */}
          <div style={{
            position: "absolute",
            bottom: "160px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "8px",
            height: "60px",
            background: "linear-gradient(180deg, #1a1f2a 0%, #0f1520 100%)",
            borderRadius: "4px",
            zIndex: 2,
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "18px",
              height: "18px",
              background: "linear-gradient(135deg, #1a1f2a 0%, #0f1520 100%)",
              clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
              borderRadius: "1px",
            }} />
          </div>

          {/* Neck */}
          <div style={{
            position: "absolute",
            bottom: "200px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "42px",
            height: "24px",
            background: "linear-gradient(180deg, #d4b8a0 0%, #c4a890 100%)",
            borderRadius: "21px 21px 10px 10px",
            zIndex: 1,
            boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.2)",
          }} />

          {/* Head - mature proportions */}
          <div style={{
            position: "absolute",
            bottom: "218px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "110px",
            height: "135px",
            background: "linear-gradient(180deg, #e8c8b0 0%, #dcc0a8 50%, #d0b8a0 100%)",
            borderRadius: "55px 55px 48px 48px",
            zIndex: 3,
            boxShadow: "inset 0 -8px 20px rgba(0,0,0,0.18), 0 10px 30px rgba(0,0,0,0.5)",
            position: "relative",
            transformStyle: "preserve-3d",
          }}>
            {/* Face shadow from hair/lighting */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
              borderRadius: "55px 55px 0 0",
              pointerEvents: "none",
            }} />

            {/* Ears */}
            <div style={{
              position: "absolute",
              top: "50px",
              left: "-10px",
              width: "16px",
              height: "32px",
              background: "linear-gradient(90deg, #e8c8b0 0%, #dcc0a8 100%)",
              borderRadius: "0 16px 16px 0",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.25)",
              zIndex: 0,
            }} />
            <div style={{
              position: "absolute",
              top: "50px",
              right: "-10px",
              width: "16px",
              height: "32px",
              background: "linear-gradient(90deg, #dcc0a8 0%, #e8c8b0 100%)",
              borderRadius: "16px 0 0 16px",
              boxShadow: "inset 2px 0 4px rgba(0,0,0,0.25)",
              zIndex: 0,
            }} />

            {/* Hair - mature, slightly receding, textured */}
            <div style={{
              position: "absolute",
              top: "-18px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              height: "65px",
              background: "linear-gradient(180deg, #1a1816 0%, #0f0e0d 100%)",
              borderRadius: "60px 60px 25px 25px",
              zIndex: 4,
              boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
            }}>
              {/* Hair texture */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='hair'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23hair)' opacity='0.06'/%3E%3C/svg%3E")`,
                borderRadius: "60px 60px 25px 25px",
              }} />
              {/* Subtle gray streaks */}
              <div style={{
                position: "absolute",
                top: "15px",
                left: "20%",
                width: "60%",
                height: "25px",
                background: "repeating-linear-gradient(90deg, transparent 0, transparent 8px, rgba(180,180,180,0.04) 8px, rgba(180,180,180,0.04) 12px)",
                borderRadius: "0 0 10px 10px",
              }} />
            </div>

            {/* Eyebrows - mature, slightly bushier */}
            <div style={{
              position: "absolute",
              top: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "14px",
              display: "flex",
              justifyContent: "space-between",
              zIndex: 5,
            }}>
              <div style={{
                width: "30px",
                height: "6px",
                background: "#1a1816",
                borderRadius: "3px",
                transform: `rotate(${lerp(expr.brows.inner, nextExpr.brows.inner, sceneProgress) * 12}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                opacity: 0.9,
                marginLeft: "2px",
              }} />
              <div style={{
                width: "30px",
                height: "6px",
                background: "#1a1816",
                borderRadius: "3px",
                transform: `rotate(${-lerp(expr.brows.outer, nextExpr.brows.outer, sceneProgress) * 8}deg)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                opacity: 0.9,
                marginRight: "2px",
              }} />
            </div>

            {/* Forehead lines - subtle aging */}
            <div style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70px",
              height: "12px",
              opacity: lerp(expr.brows.furrow, nextExpr.brows.furrow, sceneProgress) * 0.15,
              zIndex: 4,
            }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{
                  position: "absolute",
                  top: `${i * 3}px`,
                  left: "15%",
                  width: "70%",
                  height: "1px",
                  background: "rgba(0,0,0,0.15)",
                  borderRadius: "0.5px",
                  transform: `rotate(${(i - 2) * 2}deg)`,
                }} />
              ))}
            </div>

            {/* Eyes - mature with depth and slight fatigue */}
            <div style={{
              position: "absolute",
              top: "42px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "84px",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 5,
            }}>
              {["left", "right"].map((side) => (
                <div key={side} style={{
                  position: "relative",
                  width: "36px",
                  height: eyeOpenness * 30,
                  background: "#151210",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "inset 0 3px 6px rgba(0,0,0,0.6), 0 -1px 2px rgba(255,255,255,0.03)",
                  transform: side === "left" ? "scaleX(1)" : "scaleX(-1)",
                }}>
                  {/* Sclera with subtle veins and aging */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at center, #efe8e0 0%, #e0d8d0 50%, #d0c8c0 100%)",
                    opacity: 0.92,
                  }} />
                  {/* Subtle red veins */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50 Q30 30 50 50 Q70 70 90 50' stroke='%238b4a4a' stroke-width='0.5' fill='none' opacity='0.08'/%3E%3C/svg%3E")`,
                    pointerEvents: "none",
                  }} />
                  {/* Iris */}
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${lerp(expr.eyes.direction, nextExpr.eyes.direction, sceneProgress) * 8}deg)`,
                    width: lerp(expr.eyes.dilation, nextExpr.eyes.dilation, sceneProgress) * 20,
                    height: lerp(expr.eyes.dilation, nextExpr.eyes.dilation, sceneProgress) * 20,
                    background: "radial-gradient(circle at 30% 30%, #2d5a8a 0%, #1a3a5a 60%, #0d1a2a 100%)",
                    borderRadius: "50%",
                    boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.08)",
                  }}>
                    {/* Pupil */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "7px",
                      height: "7px",
                      background: "#030305",
                      borderRadius: "50%",
                    }} />
                    {/* Catchlight - key light */}
                    <div style={{
                      position: "absolute",
                      top: "12%",
                      left: "18%",
                      width: "6px",
                      height: "6px",
                      background: "rgba(255,255,255,0.85)",
                      borderRadius: "50%",
                      filter: "blur(0.5px)",
                    }} />
                    {/* Fill catchlight */}
                    <div style={{
                      position: "absolute",
                      bottom: "12%",
                      right: "18%",
                      width: "3.5px",
                      height: "3.5px",
                      background: "rgba(255,255,255,0.35)",
                      borderRadius: "50%",
                    }} />
                  </div>
                  {/* Upper eyelid shadow - deeper with age */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }} />
                  {/* Lower eyelid - slight bags */}
                  <div style={{
                    position: "absolute",
                    bottom: "-3px",
                    left: "10%",
                    right: "10%",
                    height: "3px",
                    background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 50%, transparent 100%)",
                    borderRadius: "1.5px",
                    opacity: lerp(expr.eyes.fatigue, nextExpr.eyes.fatigue, sceneProgress),
                    pointerEvents: "none",
                  }} />
                </div>
              ))}
            </div>

            {/* Crow's feet - subtle aging around eyes */}
            <div style={{
              position: "absolute",
              top: "68px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90px",
              height: "10px",
              opacity: 0.12,
              zIndex: 5,
              pointerEvents: "none",
            }}>
              {["left", "right"].map((side) => (
                <div key={side} style={{
                  position: "absolute",
                  [side]: "0",
                  width: "20px",
                  height: "8px",
                  background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 100 Q20 50 50 0 M10 100 Q25 60 60 10 M20 100 Q30 70 70 20' stroke='%23000' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                  backgroundSize: "cover",
                  transform: side === "left" ? "scaleX(-1)" : "scaleX(1)",
                  transformOrigin: side === "left" ? "right" : "left",
                }} />
              ))}
            </div>

            {/* Nose - mature */}
            <div style={{
              position: "absolute",
              top: "75px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "18px",
              height: "22px",
              background: "linear-gradient(180deg, transparent 0%, #d0b8a0 50%, #c4a890 100%)",
              borderRadius: "9px 9px 10px 10px",
              opacity: 0.7,
              zIndex: 5,
            }}>
              <div style={{
                position: "absolute",
                bottom: "3px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "10px",
                height: "5px",
                background: "#c4a890",
                borderRadius: "5px 5px 0 0",
                opacity: 0.5,
              }} />
              {/* Nostrils hint */}
              <div style={{
                position: "absolute",
                bottom: "4px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "2px",
              }}>
                <div style={{ width: "2px", height: "2px", background: "rgba(0,0,0,0.15)", borderRadius: "50%" }} />
                <div style={{ width: "2px", height: "2px", background: "rgba(0,0,0,0.15)", borderRadius: "50%" }} />
              </div>
            </div>

            {/* Nasolabial folds - aging lines */}
            <div style={{
              position: "absolute",
              top: "85px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70px",
              height: "25px",
              opacity: 0.1,
              zIndex: 5,
              pointerEvents: "none",
            }}>
              {["left", "right"].map((side) => (
                <div key={side} style={{
                  position: "absolute",
                  [side]: "5px",
                  top: "0",
                  width: "1px",
                  height: "22px",
                  background: "rgba(0,0,0,0.2)",
                  transform: side === "left" ? "rotate(-15deg)" : "rotate(15deg)",
                  transformOrigin: "top",
                }} />
              ))}
            </div>

            {/* Mouth - mature lips */}
            <div style={{
              position: "absolute",
              top: "100px",
              left: "50%",
              transform: `translateX(-50%)`,
              width: lerp(expr.mouth.width, nextExpr.mouth.width, sceneProgress) * 40,
              height: lerp(expr.mouth.openness, nextExpr.mouth.openness, sceneProgress) * 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}>
              {/* Upper lip */}
              <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                height: "60%",
                background: "linear-gradient(180deg, #9a6a5a 0%, #805545 100%)",
                borderRadius: "0 0 8px 8px",
                clipPath: "polygon(0 0, 100% 0, 55% 100%, 45% 100%)",
              }} />
              {/* Lower lip */}
              <div style={{
                position: "absolute",
                bottom: "0",
                left: "10%",
                right: "10%",
                height: "50%",
                background: "linear-gradient(180deg, #b07a65 0%, #906050 100%)",
                borderRadius: "6px 6px 0 0",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1)",
              }} />
              {/* Mouth line */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "5%",
                right: "5%",
                height: "2px",
                background: "linear-gradient(90deg, #6a4a3a 0%, #805a45 50%, #6a4a3a 100%)",
                borderRadius: "1px",
                transform: `rotate(${mouthCurve * 18}deg) translateY(-50%)`,
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }} />
              {/* Philtrum */}
              <div style={{
                position: "absolute",
                top: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "6px",
                height: "8px",
                background: "linear-gradient(180deg, transparent 0%, #d0b8a0 100%)",
                borderRadius: "3px 3px 0 0",
                opacity: 0.4,
              }} />
            </div>

            {/* Chin shadow / jawline definition */}
            <div style={{
              position: "absolute",
              bottom: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "50px",
              height: "10px",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 4,
            }} />

            {/* Subtle stubble texture */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='stubble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stubble)' opacity='0.02'/%3E%3C/svg%3E")`,
              borderRadius: "55px 55px 48px 48px",
              pointerEvents: "none",
              opacity: lerp(expr.jawTension, nextExpr.jawTension, sceneProgress),
              mask: "linear-gradient(180deg, transparent 0%, transparent 50%, black 100%)",
            }} />
          </div>
        </div>

        {/* Label */}
        <div style={{
          position: "absolute",
          bottom: "-48px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(10, 10, 18, 0.9)",
          border: "1px solid rgba(244, 114, 182, 0.3)",
          borderRadius: "100px",
          padding: "6px 20px",
          fontSize: "13px",
          fontWeight: "400",
          letterSpacing: "0.1em",
          color: "#f472b6",
          fontFamily: "'Space Grotesk', 'Inter', system-ui",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
        }}>Adulto · 35 anos</div>
      </div>
    </AbsoluteFill>
  );
};