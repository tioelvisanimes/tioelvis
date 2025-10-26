# 🎮 ARCADIA - SITE DE JOGOS WEB

## O QUE É
Plataforma moderna de jogos web. 4 jogos funcionais + tema dark/light + favoritos + busca. HTML5, CSS3, JavaScript puro. Funciona offline.

## ESTRUTURA
```
index.html          → Página inicial
games.html          → Catálogo
assets/css/         → Estilos
assets/js/app.js    → Core (tema, favoritos, busca)
assets/js/games/    → Lógica dos 4 jogos
games/              → Páginas dos jogos
```

## JOGOS

**Block Break Deluxe** 🧱 → Breakout com 10 níveis, 3 vidas
**Snake Neo** 🐍 → Cobrinha com velocidade progressiva
**2048 Fusion** 🔢 → Puzzle combinar números
**Jogo da Velha** ⭕ → 2 jogadores, placar salvo

## DESIGN

**Cores**: `#7c5cff` (roxo), `#22d3ee` (ciano), `#10b981` (verde)
**Grid**: 6→5→4→3→2 colunas (responsivo)
**Fonte**: Inter (Google Fonts)

## FUNCIONALIDADES

✅ Tema dark/light (LocalStorage)
✅ Favoritos (LocalStorage)
✅ Busca por nome/tags
✅ Recordes salvos
✅ 100% responsivo
✅ Sem dependências

## ADICIONAR JOGO

1. Edite `assets/js/app.js` → array GAMES
2. Crie `games/meu-jogo/index.html`
3. Crie `assets/js/games/meu-jogo.js`
4. Crie thumbnail SVG

## PERSONALIZAR

**Cores**: `assets/css/style.css` → `:root`
**Nome**: Trocar "Arcadia" em todos HTMLs

## TECH STACK
HTML5 • CSS3 • Vanilla JS • Canvas API • LocalStorage

**Status**: ✅ Funcional
