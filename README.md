# 🎮 Arcadia - Plataforma de Jogos Web

Um site moderno e completo de jogos web, totalmente funcional e pronto para uso!

## ✨ Características

- **Design Moderno**: Interface elegante com gradientes e animações suaves
- **Tema Dark/Light**: Alterne entre temas claro e escuro
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Sistema de Favoritos**: Marque seus jogos preferidos
- **Busca Inteligente**: Encontre jogos por nome ou tags
- **4 Jogos Completos**: Todos funcionais e prontos para jogar!

## 🎯 Jogos Incluídos

### 1. Block Break Deluxe 🧱
- Clássico jogo de quebra-blocos
- Múltiplos níveis com dificuldade crescente
- Controle por mouse ou teclado
- Sistema de vidas e pontuação
- **Localização**: `games/block-break-deluxe/`

### 2. Snake Neo 🐍
- Jogo da cobrinha modernizado
- Velocidade progressiva
- Sistema de recordes locais
- Controles responsivos
- **Localização**: `games/snake/`

### 3. 2048 Fusion 🔢
- Puzzle viciante de combinar números
- Sistema de desfazer jogada
- Salvamento automático de recorde
- Interface colorida e intuitiva
- **Localização**: `games/2048/`

### 4. Jogo da Velha ⭕
- Clássico para 2 jogadores
- Sistema de placar persistente
- Detecção automática de vitória
- Interface interativa
- **Localização**: `games/tic-tac-toe/`

## 🚀 Como Usar

1. **Abrir o site**: Simplesmente abra o arquivo `index.html` em seu navegador
2. **Navegar**: Use o menu superior para acessar diferentes seções
3. **Jogar**: Clique em qualquer jogo para começar a jogar
4. **Favoritar**: Clique na estrela nos cards para marcar favoritos
5. **Buscar**: Use a barra de busca na página de jogos para filtrar

## 📁 Estrutura do Projeto

```
/workspace/
├── index.html              # Página inicial
├── games.html             # Catálogo de jogos
├── assets/
│   ├── css/
│   │   └── style.css      # Estilos globais
│   ├── js/
│   │   ├── app.js         # JavaScript principal
│   │   └── games/         # Scripts dos jogos
│   └── img/               # Imagens e thumbnails
└── games/                 # Páginas dos jogos
    ├── block-break-deluxe/
    ├── snake/
    ├── 2048/
    └── tic-tac-toe/
```

## 🎨 Personalização

### Alterar Cores
Edite as variáveis CSS em `assets/css/style.css`:
```css
:root {
  --primary: #7c5cff;
  --secondary: #22d3ee;
  --accent: #10b981;
}
```

### Adicionar Novos Jogos
1. Crie uma pasta em `games/nome-do-jogo/`
2. Adicione o HTML do jogo
3. Crie o script do jogo em `assets/js/games/`
4. Adicione uma thumbnail em `assets/img/`
5. Registre o jogo no array `GAMES` em `assets/js/app.js`

## 🌟 Recursos Técnicos

- **Vanilla JavaScript**: Sem dependências externas
- **CSS Moderno**: Grid, Flexbox, Custom Properties
- **LocalStorage**: Persistência de dados local
- **Canvas API**: Renderização dos jogos
- **Responsive Design**: Mobile-first approach

## 🎮 Controles dos Jogos

### Block Break Deluxe
- **Mouse**: Mover raquete
- **Setas**: Controle alternativo
- **Espaço**: Lançar bola
- **P**: Pausar

### Snake Neo
- **Setas**: Direção da cobra
- **Espaço**: Pausar/Continuar

### 2048 Fusion
- **Setas**: Mover blocos

### Jogo da Velha
- **Mouse**: Clicar nas células

## 📝 Notas

- Todos os jogos salvam dados localmente (recordes, favoritos, tema)
- Compatível com navegadores modernos (Chrome, Firefox, Safari, Edge)
- Não requer servidor - funciona offline
- Otimizado para performance

## 🎉 Divirta-se!

O site está 100% funcional e pronto para uso. Basta abrir o `index.html` e começar a jogar!

---

**Desenvolvido com ❤ usando HTML, CSS e JavaScript puro**
