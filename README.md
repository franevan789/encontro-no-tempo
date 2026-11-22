# Encontro no Tempo - 60s

Vídeo animado: criança (7 anos) encontra seu eu adulto (35 anos). Diálogo sobre sonhos, ferramentas livres e o futuro.

## Render Local
```bash
npm install
npm run build
# Output: out.mp4
```

## Render na Nuvem (GitHub Actions)
1. Push para main → dispara workflow automático
2. Actions → workflow → artifacts → baixar `encontro-no-tempo-60s.zip`
3. Descompactar → `out.mp4` (60s, 1920x1080, 30fps)

## Tecnologias
- **Remotion** - React → vídeo
- **GitHub Actions** - Render grátis na nuvem (zero CPU local)
- **TypeScript** - Type safety