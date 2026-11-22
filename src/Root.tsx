import {
  Composition,
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from "remotion";
import { Child } from "./components/Child";
import { Adult } from "./components/Adult";
import { Dialogue } from "./components/Dialogue";
import { Background } from "./components/Background";
import { QRCode } from "./components/QRCode";
import { Particles } from "./components/Particles";

const DURATION = 1800;
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const BLOCK = 150;

const SCENES = {
  hook: { start: 0, end: BLOCK },
  dreams: { start: BLOCK, end: BLOCK * 2 },
  reality: { start: BLOCK * 2, end: BLOCK * 3 },
  question: { start: BLOCK * 3, end: BLOCK * 4 },
  flashback: { start: BLOCK * 4, end: BLOCK * 5 },
  discovery: { start: BLOCK * 5, end: BLOCK * 6 },
  demo: { start: BLOCK * 6, end: BLOCK * 7 },
  teaching: { start: BLOCK * 7, end: BLOCK * 8 },
  practice: { start: BLOCK * 8, end: BLOCK * 9 },
  victory: { start: BLOCK * 9, end: BLOCK * 10 },
  promise: { start: BLOCK * 10, end: BLOCK * 11 },
  cta: { start: BLOCK * 11, end: BLOCK * 12 },
};

function opacity(frame: number, sceneStart: number, sceneEnd: number) {
  const fadeIn = interpolate(frame, [sceneStart, sceneStart + 15], [0, 1], { extrapolate: "clamp" });
  const fadeOut = interpolate(frame, [sceneEnd - 15, sceneEnd], [1, 0], { extrapolate: "clamp" });
  return fadeIn * fadeOut;
}

export const TestVideo = () => {
  const frame = useCurrentFrame();
  const currentScene = Object.entries(SCENES).find(([, v]) => frame >= v.start && frame < v.end)?.[0] || "cta";

  return (
    <>
      <Background frame={frame} scene={currentScene} width={WIDTH} height={HEIGHT} />
      <Particles frame={frame} scene={currentScene} width={WIDTH} height={HEIGHT} />
      <Child frame={frame} scene={currentScene} width={WIDTH} height={HEIGHT} opacity={opacity(frame, SCENES.hook.start, SCENES.promise.end)} />
      <Adult frame={frame} scene={currentScene} width={WIDTH} height={HEIGHT} opacity={opacity(frame, SCENES.reality.start, SCENES.promise.end)} />
      <Dialogue frame={frame} scene={currentScene} width={WIDTH} />
      {(currentScene === "discovery" || currentScene === "demo" || currentScene === "teaching" || currentScene === "practice") && (
        <UIOverlay frame={frame} scene={currentScene} width={WIDTH} height={HEIGHT} />
      )}
      <QRCode frame={frame} scene={currentScene} width={WIDTH} height={HEIGHT} />
    </>
  );
};

const UIOverlay = ({ frame, scene, width, height }: { frame: number; scene: string; width: number; height: number }) => {
  const show = opacity(frame, SCENES.discovery.start, SCENES.practice.end);
  if (show < 0.01) return null;
  const tools = [
    { name: "RTK", desc: "33% tokens", color: "#00d4ff" },
    { name: "n8n", desc: "Workflows", color: "#f472b6" },
    { name: "Graphify", desc: "Grafos", color: "#7c3aed" },
    { name: "Remotion", desc: "Vídeo", color: "#22c55e" },
    { name: "Firecrawl", desc: "Scraping", color: "#f97316" },
    { name: "Puppeteer", desc: "Browser", color: "#eab308" },
    { name: "Vercel", desc: "Deploy", color: "#06b6d4" },
    { name: "Skills", desc: "MCPs", color: "#a855f7" },
  ];
  return (
    <AbsoluteFill style={{ opacity: show, pointerEvents: "none" }}>
      <div style={{ position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", padding: "0 40px" }}>
        {tools.map((tool, i) => (
          <div key={tool.name} style={{ background: "rgba(15,15,35,0.95)", border: `2px solid ${tool.color}`, borderRadius: "16px", padding: "16px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", boxShadow: `0 0 30px ${tool.color}40`, animation: `popIn 0.5s ease-out ${i * 0.1}s both` }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: tool.color, textShadow: `0 0 20px ${tool.color}` }}>{tool.name}</div>
            <div style={{ fontSize: "14px", color: "#94a3b8" }}>{tool.desc}</div>
          </div>
        ))}
      </div>
      <style jsx global>{`@keyframes popIn { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </AbsoluteFill>
  );
};

export const Root = () => (
  <>
    <Composition id="TestVideo" component={TestVideo} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{}} />
  </>
);