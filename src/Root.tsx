import {
  Composition,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  AbsoluteFill,
  registerRoot,
  Sequence,
} from "remotion";
import { CinematicBackground } from "./components/CinematicBackground";
import { CinematicChild } from "./components/CinematicChild";
import { CinematicAdult } from "./components/CinematicAdult";
import { CinematicDialogue } from "./components/CinematicDialogue";
import { CinematicParticles } from "./components/CinematicParticles";
import { CinematicQR } from "./components/CinematicQR";
import { CinematicOverlay } from "./components/CinematicOverlay";

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

function sceneOpacity(frame: number, sceneStart: number, sceneEnd: number) {
  const fadeIn = interpolate(frame, [sceneStart, sceneStart + 20], [0, 1], { extrapolate: "clamp" });
  const fadeOut = interpolate(frame, [sceneEnd - 20, sceneEnd], [1, 0], { extrapolate: "clamp" });
  return fadeIn * fadeOut;
}

function getCurrentScene(frame: number) {
  return Object.entries(SCENES).find(([, v]) => frame >= v.start && frame < v.end)?.[0] || "cta";
}

const CinematicTestVideo = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const currentScene = getCurrentScene(frame);

  return (
    <>
      <CinematicBackground frame={frame} scene={currentScene} width={width} height={height} />
      <CinematicParticles frame={frame} scene={currentScene} width={width} height={height} />

      <CinematicChild
        frame={frame}
        scene={currentScene}
        width={width}
        height={height}
        opacity={sceneOpacity(frame, SCENES.hook.start, SCENES.promise.end)}
      />
      <CinematicAdult
        frame={frame}
        scene={currentScene}
        width={width}
        height={height}
        opacity={sceneOpacity(frame, SCENES.reality.start, SCENES.promise.end)}
      />

      <CinematicDialogue frame={frame} scene={currentScene} width={width} />

      {(currentScene === "discovery" || currentScene === "demo" || currentScene === "teaching" || currentScene === "practice") && (
        <CinematicOverlay frame={frame} scene={currentScene} width={width} height={height} />
      )}

      <CinematicQR frame={frame} scene={currentScene} width={width} height={height} />

      {/* Film grain overlay */}
      <FilmGrain frame={frame} width={width} height={height} />

      {/* Vignette */}
      <Vignette width={width} height={height} />
    </>
  );
};

const FilmGrain = ({ frame, width, height }: { frame: number; width: number; height: number }) => {
  // Procedural film grain via SVG noise
  const grainSize = 2;
  const cols = Math.ceil(width / grainSize);
  const rows = Math.ceil(height / grainSize);

  const noise = Array.from({ length: Math.min(cols * rows, 5000) }, (_, i) => {
    const x = (i % cols) * grainSize;
    const y = Math.floor(i / cols) * grainSize;
    const seed = (x * 12345 + y * 67890 + frame * 1000) % 10000;
    const opacity = (seed / 10000) * 0.08;
    return <rect key={i} x={x} y={y} width={grainSize} height={grainSize} fill="white" fillOpacity={opacity} />;
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.15 }}>
      <svg width={width} height={height}>{noise}</svg>
    </AbsoluteFill>
  );
};

const Vignette = ({ width, height }: { width: number; height: number }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={width} height={height}>
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  </AbsoluteFill>
);

export const Root = () => (
  <>
    <Composition
      id="TestVideo"
      component={CinematicTestVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{}}
    />
  </>
);

registerRoot(Root);