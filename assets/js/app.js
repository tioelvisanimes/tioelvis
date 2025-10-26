/* Modern Gaming Template - App */
(function(){
  const GAMES = [
    {
      id: 'block-break-deluxe',
      title: 'Block Break Deluxe',
      slug: 'block-break-deluxe',
      description: 'Quebra-blocos clássico com níveis, power-ups e leaderboard local.',
      tags: ['arcade', 'clássico', 'rápido'],
      url: 'games/block-break-deluxe/',
      thumb: 'assets/img/thumb-blockbreak.svg',
      rating: 4.8,
      addedAt: '2025-10-20'
    },
    {
      id: 'snake',
      title: 'Snake Neo',
      slug: 'snake',
      description: 'A clássica cobrinha com controle responsivo e ranking local.',
      tags: ['clássico', 'arcade'],
      url: 'games/snake/',
      thumb: 'assets/img/thumb-snake.svg',
      rating: 4.4,
      addedAt: '2025-10-22'
    },
    {
      id: 'game-2048',
      title: '2048 Fusion',
      slug: '2048',
      description: 'Deslize os blocos e alcance o 2048! Com desfazer e salvar.',
      tags: ['puzzle', 'casual'],
      url: 'games/2048/',
      thumb: 'assets/img/thumb-2048.svg',
      rating: 4.6,
      addedAt: '2025-10-24'
    },
    {
      id: 'tic-tac-toe',
      title: 'Jogo da Velha',
      slug: 'tic-tac-toe',
      description: 'Clássico jogo de estratégia para 2 jogadores. Forme 3 em linha!',
      tags: ['estratégia', 'clássico', '2-jogadores'],
      url: 'games/tic-tac-toe/',
      thumb: 'assets/img/thumb-tictactoe.svg',
      rating: 4.5,
      addedAt: '2025-10-26'
    }
  ];

  const dom = {
    q: (sel, el=document) => el.querySelector(sel),
    qa: (sel, el=document) => Array.from(el.querySelectorAll(sel)),
    el: (tag, cls) => { const e = document.createElement(tag); if(cls) e.className = cls; return e; }
  };

  const storage = {
    get(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
  };

  function initTheme(){
    const preferred = storage.get('theme', 'dark');
    document.documentElement.dataset.theme = preferred;
    const btn = dom.q('[data-action="toggle-theme"]');
    if(btn){
      btn.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        storage.set('theme', next);
      });
    }
  }

  function getGames(){ return GAMES.slice(); }

  function renderCards(container, list){
    container.innerHTML = '';
    list.forEach(game => {
      const card = dom.el('article', 'card');
      const fav = dom.el('button', 'fav icon-btn');
      fav.innerHTML = '★';
      fav.setAttribute('aria-pressed', isFav(game.id) ? 'true' : 'false');
      fav.addEventListener('click', (e)=>{ e.stopPropagation(); toggleFav(game.id); fav.setAttribute('aria-pressed', isFav(game.id) ? 'true' : 'false'); updateFavCount(); });

      const thumb = dom.el('div', 'card-thumb');
      thumb.style.backgroundImage = `url('${game.thumb}')`;
      const body = dom.el('div', 'card-body');
      const title = dom.el('h3', 'card-title'); title.textContent = game.title;
      const tags = dom.el('div', 'card-tags'); tags.textContent = game.tags.join(' • ');

      card.appendChild(fav);
      card.appendChild(thumb); card.appendChild(body);
      body.appendChild(title); body.appendChild(tags);
      card.addEventListener('click', ()=>{ window.location.href = game.url; });
      container.appendChild(card);
    });
  }

  function searchAndFilter(list, term){
    if(!term) return list;
    term = term.toLowerCase();
    return list.filter(g => g.title.toLowerCase().includes(term) || g.tags.some(t=>t.toLowerCase().includes(term)));
  }

  function setupSearch(inputSel, gridSel){
    const input = dom.q(inputSel);
    const grid = dom.q(gridSel);
    if(!input || !grid) return;
    const base = getGames();
    renderCards(grid, base);
    input.addEventListener('input', ()=>{
      const filtered = searchAndFilter(base, input.value);
      renderCards(grid, filtered);
    });
  }

  function isFav(id){ const f = storage.get('favorites', []); return f.includes(id); }
  function toggleFav(id){
    const f = storage.get('favorites', []);
    const i = f.indexOf(id);
    if(i>=0) f.splice(i,1); else f.push(id);
    storage.set('favorites', f);
  }
  function updateFavCount(){
    const count = storage.get('favorites', []).length;
    const el = dom.q('[data-fav-count]'); if(el) el.textContent = String(count);
  }

  function renderHomepage(){
    const heroBtn = dom.q('[data-action="play-featured"]');
    if(heroBtn){ heroBtn.addEventListener('click', ()=>{ window.location.href = 'games/block-break-deluxe/'; }); }

    const destaques = dom.q('#destaques-grid');
    const novidades = dom.q('#novidades-grid');
    const list = getGames();
    if(destaques){
      const curated = list.slice().sort((a,b)=>b.rating - a.rating);
      renderCards(destaques, curated);
    }
    if(novidades){
      const sorted = list.slice().sort((a,b)=> new Date(b.addedAt) - new Date(a.addedAt));
      renderCards(novidades, sorted);
    }
  }

  function renderCatalog(){
    setupSearch('#search', '#catalog-grid');
  }

  function initRouting(){
    const path = location.pathname;
    if(path.endsWith('/') || path.endsWith('/index.html')){
      if(dom.q('#destaques-grid')) renderHomepage();
    }
    if(path.endsWith('/games.html')){ renderCatalog(); }
    updateFavCount();
  }

  document.addEventListener('DOMContentLoaded', function(){
    initTheme();
    initRouting();
  });
})();
