import { AbsoluteFill, interpolate } from "remotion";

interface CinematicOverlayProps {
  frame: number;
  scene: string;
  width: number;
  height: number;
}

const OVERLAY_CONTENT: Record<string, {
  type: "terminal" | "code" | "browser" | "files" | "dashboard";
  lines: string[];
  highlightLine?: number;
  cursorPosition?: { line: number; char: number };
}> = {
  discovery: {
    type: "terminal",
    lines: [
      "┌─[ ~ ]──────────────────────────────────────┐",
      "│  $ npm create vite@latest meu-mundo -- --template react-ts",
      "│  ✔ Project created in 2.3s",
      "│  $ cd meu-mundo && npm install",
      "│  ✔ 247 packages installed in 8.1s",
      "│  $ npm run dev",
      "│  ┌─────────────────────────────────────────┐",
      "│  │  VITE v5.4.0  ready in 312ms           │",
      "│  │  ➜  Local:   http://localhost:5173/    │",
      "│  │  ➜  Network: http://192.168.1.42:5173/ │",
      "│  └─────────────────────────────────────────┘",
      "└────────────────────────────────────────────┘",
    ],
    highlightLine: 7,
  },
  demo: {
    type: "code",
    lines: [
      "// Primeiro componente — a mágica acontece aqui",
      "import { useState } from 'react';",
      "",
      "export function BotaoMagico() {",
      "  const [cliques, setCliques] = useState(0);",
      "",
      "  return (",
      "    <button",
      "      className='bg-cyan-500 hover:bg-cyan-400",
      "             text-white px-6 py-3 rounded-xl",
      "             transition-colors duration-200'",
      "      onClick={() => setCliques(c => c + 1)}",
      "    >",
      "      Cliques: {cliques} ✨",
      "    </button>",
      "  );",
      "}",
      "",
      "// Salve. Atualize. Veja. Acredite.",
    ],
    highlightLine: 10,
    cursorPosition: { line: 12, char: 4 },
  },
  teaching: {
    type: "browser",
    lines: [
      "http://localhost:5173/",
      "┌─────────────────────────────────────────────┐",
      "│  ▢  🔄  🏠  ◀  ▶  🔖  ●  📦  ⋮            │",
      "├─────────────────────────────────────────────┤",
      "│                                             │",
      "│           ████████████████████████          │",
      "│           █  Cliques: 0  ✨  █              │",
      "│           ████████████████████████          │",
      "│                                             │",
      "│           [Console]                         │",
      "│           > BotaoMagico mounted             │",
      "│           > State initialized: 0            │",
      "│                                             │",
      "└─────────────────────────────────────────────┘",
    ],
    highlightLine: 7,
  },
  practice: {
    type: "files",
    lines: [
      "📁 meu-mundo/",
      "├── 📁 src/",
      "│   ├── 📁 components/",
      "│   │   ├── BotaoMagico.tsx      ◀ editando",
      "│   │   ├── Contador.tsx         ✓",
      "│   │   └── ListaTarefas.tsx     ✓",
      "│   ├── 📁 hooks/",
      "│   │   └── useLocalStorage.ts   ✓",
      "│   ├── App.tsx                  ✓",
      "│   └── main.tsx                 ✓",
      "├── package.json                 ✓",
      "├── tsconfig.json                ✓",
      "├── vite.config.ts               ✓",
      "└── README.md                    ◀ escrevendo",
      "",
      "✓ 12 arquivos  •  347 linhas  •  0 erros  •  4 avisos",
    ],
    highlightLine: 3,
  },
  victory: {
    type: "dashboard",
    lines: [
      "┌─────────────────────────────────────────────┐",
      "│  🚀 DEPLOY CONCLUÍDO — vercel.app           │",
      "├─────────────────────────────────────────────┤",
      "│                                             │",
      "│   ████░░░░░░░░░░  Build:     ✓ 4.2s         │",
      "│   ████████░░░░░░  Lint:      ✓ 1.1s         │",
      "│   ████████████░░░  Test:       ✓ 2.8s       │",
      "│   ████████████████  Deploy:    ✓ 3.5s       │",
      "│                                             │",
      "│   🌐 https://meu-mundo-abc123.vercel.app    │",
      "│   📦 142 kB gzipped  •  98/100 Lighthouse   │",
      "│   🔓 Open Source  •  MIT License            │",
      "│                                             │",
      "│   [Compartilhar]  [Clonar]  [Estrelas ★42]  │",
      "│                                             │",
      "└─────────────────────────────────────────────┘",
    ],
    highlightLine: 8,
  },
};

function getSceneContent(scene: string) {
  return OVERLAY_CONTENT[scene];
}

export const CinematicOverlay = ({ frame, scene, width, height }: CinematicOverlayProps) => {
  const content = getSceneContent(scene);
  if (!content) return null;

  const sceneFrames = 150;
  const sceneStart = ["discovery", "demo", "teaching", "practice", "victory"].indexOf(scene) * sceneFrames + 750;
  const progress = Math.max(0, Math.min(1, (frame - sceneStart) / sceneFrames));
  const fadeIn = interpolate(frame, [sceneStart, sceneStart + 20], [0, 1], { extrapolate: "clamp" });
  const fadeOut = interpolate(frame, [sceneStart + sceneFrames - 20, sceneStart + sceneFrames], [1, 0], { extrapolate: "clamp" });
  const opacity = fadeIn * fadeOut;

  if (opacity < 0.01) return null;

  const isRightSide = width > height;
  const panelWidth = Math.min(580, width * 0.38);
  const panelHeight = Math.min(420, height * 0.55);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute",
        right: isRightSide ? "60px" : "50%",
        top: "50%",
        transform: isRightSide ? "translateY(-50%)" : "translate(50%, -50%)",
        opacity,
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
        pointerEvents: "none",
      }}>
        {/* Panel background - diegetic terminal/window */}
        <div style={{
          width: panelWidth,
          height: panelHeight,
          background: "linear-gradient(180deg, #0d1117 0%, #080c12 100%)",
          border: "1px solid rgba(0, 212, 255, 0.2)",
          borderRadius: "12px",
          boxShadow: "0 0 60px rgba(0,212,255,0.08), inset 0 1px 0 rgba(255,255,255,0.03)",
          overflow: "hidden",
          position: "relative",
          transformStyle: "preserve-3d",
        }}>
          {/* Top bar - window chrome */}
          <div style={{
            height: "36px",
            background: "linear-gradient(180deg, #161b22 0%, #0d1117 100%)",
            borderBottom: "1px solid rgba(48, 54, 61, 0.5)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
          }}>
            {/* Traffic lights */}
            <div style={{ display: "flex", gap: "6px" }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: i === 1 ? "#ff5f57" : i === 2 ? "#febc2e" : "#28ca42",
                  boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.2)",
                }} />
              ))}
            </div>
            {/* Title */}
            <div style={{
              flex: 1,
              fontFamily: "'Space Grotesk', 'Inter', system-ui",
              fontSize: "11px",
              fontWeight: "500",
              color: "#8b949e",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              {content.type.toUpperCase()} • main
            </div>
            {/* Minimal buttons */}
            <div style={{ display: "flex", gap: "4px" }}>
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }} />
            </div>
          </div>

          {/* Content area */}
          <div style={{
            height: `calc(100% - 36px)`,
            padding: "16px",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            fontSize: "12px",
            lineHeight: "1.6",
            color: "#e6edf3",
            overflow: "hidden",
            position: "relative",
          }}>
            {content.lines.map((line, lineIndex) => {
              const isHighlighted = lineIndex === content.highlightLine;
              const isCursorLine = content.cursorPosition?.line === lineIndex;

              return (
                <div
                  key={lineIndex}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "1px 0",
                    opacity: isHighlighted ? 1 : 0.7,
                    background: isHighlighted ? "rgba(0, 212, 255, 0.08)" : "transparent",
                    borderRadius: "3px",
                    margin: "0 -4px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    transition: "background 0.3s ease",
                  }}
                >
                  {/* Line number */}
                  <span style={{
                    width: "36px",
                    textAlign: "right",
                    paddingRight: "12px",
                    color: isHighlighted ? "#00d4ff" : "#484f58",
                    fontSize: "11px",
                    userSelect: "none",
                    flexShrink: 0,
                  }}>
                    {String(lineIndex + 1).padStart(2, "0")}
                  </span>
                  {/* Line content */}
                  <span style={{
                    color: isHighlighted ? "#00d4ff" : "#e6edf3",
                    fontWeight: isHighlighted ? "500" : "400",
                    whiteSpace: "pre",
                    wordBreak: "break-all",
                  }}>
                    {line}
                    {isCursorLine && (
                      <span style={{
                        display: "inline-block",
                        width: "2px",
                        height: "1.2em",
                        background: "#00d4ff",
                        marginLeft: "2px",
                        verticalAlign: "text-bottom",
                        animation: "blink 1s ease-in-out infinite",
                      }} />
                    )}
                  </span>
                </div>
              );
            })}

            {/* Scanline effect */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `repeating-linear-gradient(180deg, transparent 0, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
              pointerEvents: "none",
              opacity: 0.5,
            }} />
          </div>
        </div>

        {/* Floating label */}
        <div style={{
          position: "absolute",
          bottom: "-36px",
          left: "0",
          background: "rgba(10, 10, 18, 0.9)",
          border: "1px solid rgba(0, 212, 255, 0.3)",
          borderRadius: "100px",
          padding: "4px 16px",
          fontSize: "11px",
          fontWeight: "400",
          letterSpacing: "0.1em",
          color: "#00d4ff",
          fontFamily: "'Space Grotesk', 'Inter', system-ui",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          backdropFilter: "blur(10px)",
        }}>
          {content.type === "terminal" && "terminal"}
          {content.type === "code" && "editor"}
          {content.type === "browser" && "preview"}
          {content.type === "files" && "explorer"}
          {content.type === "dashboard" && "deploy"}
        </div>

        <style jsx global>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    </AbsoluteFill>
  );
};