import { AbsoluteFill, interpolate } from "remotion";

const DIALOGUES: Record<string, { child: string; adult: string; showChild: boolean; showAdult: boolean }> = {
  hook: { child: "Olha! Desenhei o futuro!", adult: "", showChild: true, showAdult: false },
  dreams: { child: "Vou ser astronauta! Programador! Inventor! Artista!", adult: "", showChild: true, showAdult: false },
  reality: { child: "Por quê?", adult: "É... bonito. Mas o mundo não espera você estar pronto.", showChild: true, showAdult: true },
  question: { child: "O que você faria diferente?", adult: "Usaria ferramentas livres. Não pagaria por sonhar.", showChild: true, showAdult: true },
  flashback: { child: "Funcionou? Você virou tudo isso?", adult: "Não sozinho. Ferramentas certas. Pessoas certas. Tempo.", showChild: true, showAdult: true },
  discovery: { child: "Quais ferramentas?", adult: "As que são livres. RTK, n8n, Graphify, Remotion, Firecrawl, Puppeteer, Vercel, Skills...", showChild: true, showAdult: true },
  demo: { child: "Me mostra?", adult: "Aqui. RTK economiza 33% tokens. n8n automatiza. Graphify desenha. Remotion renderiza.", showChild: true, showAdult: true },
  teaching: { child: "Você me ensina a usar?", adult: "Eu te dou as chaves. Você abre as portas. Começa hoje.", showChild: true, showAdult: true },
  practice: { child: "Olha! Eu fiz! Scrapei, gráfico, vídeo... sozinho!", adult: "Foi rápido. Livre. Seu.", showChild: true, showAdult: true },
  victory: { child: "Eu consigo! De verdade!", adult: "Sempre pôde. Só precisava das ferramentas certas.", showChild: true, showAdult: true },
  promise: { child: "Promete que me espera no futuro?", adult: "Prometo. Leve as ferramentas. Elas são suas. Custo zero.", showChild: true, showAdult: true },
  cta: { child: "", adult: "", showChild: false, showAdult: false },
};

export const Dialogue = ({ frame, scene, width }: { frame: number; scene: string; width: number }) => {
  const dialogue = DIALOGUES[scene];
  if (!dialogue) return null;
  const show = interpolate(frame, [0, 15], [0, 1], { extrapolate: "clamp" }) * interpolate(frame, [135, 150], [1, 0], { extrapolate: "clamp" });
  if (show < 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {dialogue.showChild && dialogue.child && (
        <div style={{ position: "absolute", left: "80px", top: "120px", maxWidth: "500px", background: "rgba(59,130,246,0.15)", border: "2px solid #3b82f6", borderRadius: "24px", padding: "20px 28px", fontSize: "28px", lineHeight: "1.4", color: "#93c5fd", fontFamily: "'Comic Neue', cursive, system-ui", fontWeight: "500", textShadow: "0 0 20px rgba(59,130,246,0.3)", opacity: show, transform: `translateX(${interpolate(frame, [0, 15], [-50, 0], { extrapolate: "clamp" })}px)`, boxShadow: "0 10px 40px rgba(59,130,246,0.2)" }}>"{dialogue.child}"</div>
      )}
      {dialogue.showAdult && dialogue.adult && (
        <div style={{ position: "absolute", right: "80px", top: "120px", maxWidth: "550px", background: "rgba(244,114,182,0.15)", border: "2px solid #f472b6", borderRadius: "24px", padding: "20px 28px", fontSize: "26px", lineHeight: "1.5", color: "#fbcfe8", fontFamily: "'Inter', system-ui", fontWeight: "400", textShadow: "0 0 20px rgba(244,114,182,0.3)", opacity: show, transform: `translateX(${interpolate(frame, [0, 15], [50, 0], { extrapolate: "clamp" })}px)`, boxShadow: "0 10px 40px rgba(244,114,182,0.2)" }}>{dialogue.adult}</div>
      )}
    </AbsoluteFill>
  );
};