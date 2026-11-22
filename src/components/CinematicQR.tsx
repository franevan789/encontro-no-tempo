import { AbsoluteFill, interpolate } from "remotion";

interface CinematicQRProps {
  frame: number;
  scene: string;
  width: number;
  height: number;
}

const QR_SCENES = ["promise", "cta"];

function generateQRPattern(size: number, data: string): boolean[][] {
  const pattern: boolean[][] = [];
  const modules = 25; // 25x25 QR-like pattern

  for (let y = 0; y < modules; y++) {
    pattern[y] = [];
    for (let x = 0; x < modules; x++) {
      // Deterministic pattern based on data string
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        hash = ((hash << 5) - hash) + data.charCodeAt(i);
        hash |= 0;
      }
      hash = Math.abs(hash + x * 31 + y * 17);

      // Finder patterns (corners)
      const inFinderTL = x < 7 && y < 7;
      const inFinderTR = x >= modules - 7 && y < 7;
      const inFinderBL = x < 7 && y >= modules - 7;

      if (inFinderTL || inFinderTR || inFinderBL) {
        // Finder pattern: alternating rings
        const cx = inFinderTL ? 3.5 : inFinderTR ? modules - 3.5 : 3.5;
        const cy = inFinderTL ? 3.5 : inFinderTR ? 3.5 : modules - 3.5;
        const dist = Math.max(Math.abs(x - cx), Math.abs(y - cy));
        pattern[y][x] = dist === 3 || dist === 0;
      } else {
        // Data pattern - deterministic noise
        pattern[y][x] = (hash % 2) === 0;
      }
    }
  }

  // Timing patterns
  for (let i = 7; i < modules - 7; i++) {
    pattern[6][i] = i % 2 === 0;
    pattern[i][6] = i % 2 === 0;
  }

  return pattern;
}

export const CinematicQR = ({ frame, scene, width, height }: CinematicQRProps) => {
  if (!QR_SCENES.includes(scene)) return null;

  const sceneFrames = 150;
  const sceneStart = ["promise", "cta"].indexOf(scene) * sceneFrames + 1500;
  const progress = Math.max(0, Math.min(1, (frame - sceneStart) / sceneFrames));
  const fadeIn = interpolate(frame, [sceneStart, sceneStart + 30], [0, 1], { extrapolate: "clamp" });
  const opacity = fadeIn;

  if (opacity < 0.01) return null;

  const qrData = "https://github.com/seu-usuario/encontro-no-tempo";
  const qrSize = 160;
  const moduleSize = qrSize / 25;
  const pattern = generateQRPattern(25, qrData);

  const pulsePhase = (frame * 0.02) % (Math.PI * 2);
  const glowIntensity = 0.3 + 0.2 * Math.sin(pulsePhase);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        opacity,
        filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))",
      }}>
        {/* QR Container - film-integrated */}
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}>
          {/* QR Code with cinematic styling */}
          <div style={{
            position: "relative",
            padding: "16px",
            background: "linear-gradient(145deg, #0a0a12 0%, #050508 100%)",
            border: "1px solid rgba(0, 212, 255, 0.3)",
            borderRadius: "16px",
            boxShadow: `
              0 0 40px rgba(0, 212, 255, ${0.1 * glowIntensity}),
              inset 0 1px 0 rgba(255,255,255,0.05),
              0 20px 50px rgba(0,0,0,0.5)
            `,
            transformStyle: "preserve-3d",
          }}>
            {/* Subtle animated border glow */}
            <div style={{
              position: "absolute",
              inset: "-2px",
              background: `conic-gradient(from ${frame * 0.5}deg, transparent 0%, #00d4ff${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')} 25%, transparent 50%, #f472b6${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')} 75%, transparent 100%)`,
              borderRadius: "18px",
              filter: "blur(8px)",
              opacity: 0.4,
              zIndex: -1,
              pointerEvents: "none",
            }} />

            {/* QR Modules */}
            <svg width={qrSize} height={qrSize} style={{ display: "block" }}>
              <defs>
                <filter id="qrGlow">
                  <feGaussianBlur stdDeviation="0.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="qrInnerGlow">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0.83  0 0 0 0.13 0  0 0 0 0.5 0" result="colored" />
                  <feMerge>
                    <feMergeNode in="colored" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Quiet zone background */}
              <rect width={qrSize} height={qrSize} fill="#0a0a12" />

              {/* Modules */}
              {pattern.map((row, y) =>
                row.map((isDark, x) =>
                  isDark && (
                    <rect
                      key={`${x}-${y}`}
                      x={x * moduleSize}
                      y={y * moduleSize}
                      width={moduleSize}
                      height={moduleSize}
                      rx={1}
                      ry={1}
                      fill="#00d4ff"
                      fillOpacity={0.95}
                      filter="url(#qrInnerGlow)"
                      style={{
                        transition: "fill-opacity 0.1s",
                        transformOrigin: `${x * moduleSize + moduleSize/2}px ${y * moduleSize + moduleSize/2}px`,
                      }}
                    />
                  )
                )
              )}

              {/* Decorative corner accents */}
              <g fill="none" stroke="#00d4ff" strokeWidth="2" strokeOpacity={0.6 * glowIntensity}>
                {/* Top-left corner brackets */}
                <path d={`M ${4 * moduleSize} ${1 * moduleSize} h ${4 * moduleSize}`} />
                <path d={`M ${1 * moduleSize} ${4 * moduleSize} v ${4 * moduleSize}`} />
                {/* Top-right corner brackets */}
                <path d={`M ${20 * moduleSize} ${1 * moduleSize} h ${4 * moduleSize}`} />
                <path d={`M ${24 * moduleSize} ${4 * moduleSize} v ${4 * moduleSize}`} />
                {/* Bottom-left corner brackets */}
                <path d={`M ${4 * moduleSize} ${24 * moduleSize} h ${4 * moduleSize}`} />
                <path d={`M ${1 * moduleSize} ${20 * moduleSize} v ${4 * moduleSize}`} />
              </g>
            </svg>
          </div>

          {/* Label and URL */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            textAlign: "center",
            maxWidth: "300px",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui",
              fontSize: "12px",
              fontWeight: "500",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#00d4ff",
              textShadow: "0 0 16px rgba(0,212,255,0.4)",
            }}>
              {scene === "promise" ? "O CÓDIGO É LIVRE" : "ESCANEIE • CONSTRUA • COMPARTILHE"}
            </div>

            <div style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: "11px",
              color: "#8b949e",
              letterSpacing: "0.02em",
            }}>
              github.com/seu-usuario/encontro-no-tempo
            </div>

            {/* Scan hint animation */}
            <div style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#00d4ff",
              fontFamily: "'Space Grotesk', 'Inter', system-ui",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.8,
            }}>
              <div style={{
                width: "20px",
                height: "20px",
                border: "2px solid #00d4ff",
                borderRadius: "50%",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "8px",
                  height: "8px",
                  background: "#00d4ff",
                  borderRadius: "50%",
                  animation: "scanPulse 1.5s ease-in-out infinite",
                }} />
              </div>
              <span>APONTE A CÂMERA</span>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes scanPulse {
            0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.5); }
          }
        `}</style>
      </div>
    </AbsoluteFill>
  );
};