import { AbsoluteFill, interpolate } from "remotion";

interface CinematicDialogueProps {
  frame: number;
  scene: string;
  width: number;
}

const DIALOGUE: Record<string, {
  speaker: "child" | "adult" | "both" | "narrator";
  text: string;
  subtext?: string;
  timing: { start: number; end: number };
}> = {
  hook: {
    speaker: "child",
    text: "Você sonha?",
    subtext: "Curiosidade pura",
    timing: { start: 10, end: 130 }
  },
  dreams: {
    speaker: "child",
    text: "Eu vou construir mundos.\nCom código. Com luz.",
    subtext: "Certeza absoluta",
    timing: { start: 160, end: 280 }
  },
  reality: {
    speaker: "adult",
    text: "O mundo não é gentil\ncom quem sonha alto.",
    subtext: "Cicatrizes vivas",
    timing: { start: 310, end: 430 }
  },
  question: {
    speaker: "child",
    text: "Então por que você\nnão desistiu?",
    subtext: "Pergunta que muda tudo",
    timing: { start: 460, end: 580 }
  },
  flashback: {
    speaker: "adult",
    text: "Eu desisti.\nPor anos. Até me lembrar\nde quem eu era.",
    subtext: "O peso do silêncio",
    timing: { start: 610, end: 730 }
  },
  discovery: {
    speaker: "both",
    text: "Ferramentas livres.\nSem portas fechadas.\nSó código aberto.",
    subtext: "A chave estava aqui",
    timing: { start: 760, end: 880 }
  },
  demo: {
    speaker: "adult",
    text: "Veja. Um comando.\nE o mundo responde.",
    subtext: "Ensina pelo fazer",
    timing: { start: 910, end: 1030 }
  },
  teaching: {
    speaker: "child",
    text: "Eu consigo.\nDe verdade. Eu consigo.",
    subtext: "Primeira vitória",
    timing: { start: 1060, end: 1180 }
  },
  practice: {
    speaker: "adult",
    text: "Erre. Erre de novo.\nErre melhor da próxima vez.",
    subtext: "O método científico",
    timing: { start: 1210, end: 1330 }
  },
  victory: {
    speaker: "both",
    text: "Funcionou.\nNós fizemos funcionar.",
    subtext: "Cumplicidade",
    timing: { start: 1360, end: 1480 }
  },
  promise: {
    speaker: "adult",
    text: "Nunca pare de perguntar.\nNunca pare de construir.\nO futuro é seu.",
    subtext: "Promessa eterna",
    timing: { start: 1510, end: 1650 }
  },
  cta: {
    speaker: "narrator",
    text: "O código é livre.\nO futuro também.\ngithub.com/seu-usuario",
    subtext: "Convite",
    timing: { start: 1680, end: 1780 }
  },
};

const SPEAKER_COLORS = {
  child: "#00d4ff",
  adult: "#f472b6",
  both: "#22c55e",
  narrator: "#eab308",
};

const SPEAKER_LABELS = {
  child: "CRIANÇA",
  adult: "ADULTO",
  both: "AMBOS",
  narrator: "NARRADOR",
};

export const CinematicDialogue = ({ frame, scene, width }: CinematicDialogueProps) => {
  const current = DIALOGUE[scene];
  if (!current) return null;

  const { timing, speaker, text, subtext } = current;
  const isActive = frame >= timing.start && frame <= timing.end;
  if (!isActive) return null;

  const progress = (frame - timing.start) / (timing.end - timing.start);
  const fadeIn = interpolate(frame, [timing.start, timing.start + 15], [0, 1], { extrapolate: "clamp" });
  const fadeOut = interpolate(frame, [timing.end - 15, timing.end], [1, 0], { extrapolate: "clamp" });
  const opacity = fadeIn * fadeOut;

  const color = SPEAKER_COLORS[speaker];
  const label = SPEAKER_LABELS[speaker];

  // Typewriter effect for main text
  const chars = text.length;
  const visibleChars = Math.floor(chars * Math.min(1, progress * 1.2));
  const displayText = text.slice(0, visibleChars);

  // Subtext appears after main text
  const subtextProgress = Math.max(0, (progress - 0.6) / 0.4);
  const subtextOpacity = interpolate(frame, [timing.start + (timing.end - timing.start) * 0.6, timing.end - 10], [0, 1], { extrapolate: "clamp" }) * opacity;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute",
        bottom: "180px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "1000px",
        textAlign: "center",
        opacity,
        filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.6))",
      }}>
        {/* Speaker label - diegetic UI */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
          opacity: 0.85 * opacity,
        }}>
          {/* Left line */}
          <div style={{
            width: "60px",
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
          }} />
          {/* Speaker indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, 0.15)`,
            border: `1px solid ${color}40`,
            borderRadius: "100px",
            padding: "6px 16px",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              background: color,
              borderRadius: "50%",
              boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
              animation: "speakerPulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "'Space Grotesk', 'Inter', system-ui",
              fontSize: "11px",
              fontWeight: "500",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: color,
            }}>{label}</span>
          </div>
          {/* Right line */}
          <div style={{
            width: "60px",
            height: "1px",
            background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
          }} />
        </div>

        <style jsx global>{`
          @keyframes speakerPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.85); }
          }
        `}</style>

        {/* Main dialogue text - cinematic subtitle style */}
        <div style={{
          fontFamily: "'Inter', system-ui",
          fontSize: "clamp(28px, 3.5vw, 42px)",
          fontWeight: "300",
          lineHeight: "1.35",
          letterSpacing: "0.01em",
          color: "#fafafa",
          textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.9)",
          marginBottom: subtext ? "20px" : 0,
          whiteSpace: "pre-line",
        }}>
          {displayText.split("\n").map((line, i) => (
            <span key={i} style={{ display: "block" }}>{line}</span>
          ))}
          {/* Typing cursor */}
          {visibleChars < chars && progress < 0.95 && (
            <span style={{
              display: "inline-block",
              width: "3px",
              height: "1.1em",
              background: color,
              marginLeft: "2px",
              verticalAlign: "bottom",
              animation: "cursorBlink 0.8s ease-in-out infinite",
            }} />
          )}
        </div>

        <style jsx global>{`
          @keyframes cursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {/* Subtext - emotional context */}
        {subtext && (
          <div style={{
            fontFamily: "'Space Grotesk', 'Inter', system-ui",
            fontSize: "13px",
            fontWeight: "400",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: color,
            opacity: subtextOpacity,
            textShadow: `0 0 16px ${color}40`,
            whiteSpace: "pre-line",
          }}>
            {subtext}
          </div>
        )}

        {/* Progress bar - subtle, diegetic */}
        <div style={{
          position: "absolute",
          bottom: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "200px",
          height: "2px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "1px",
          overflow: "hidden",
          opacity: 0.5 * opacity,
        }}>
          <div style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
            borderRadius: "1px",
            transformOrigin: "left",
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};