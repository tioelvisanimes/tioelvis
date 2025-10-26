(function(){
  const gridEl = document.getElementById('grid');
  if(!gridEl) return;

  const size = 4;
  let tiles = Array(size*size).fill(0);
  let score = 0; let best = Number(localStorage.getItem('2048-best')||0); let moves=0;
  let prev = null;

  function idx(x,y){ return y*size + x; }
  function spawn(){
    const empty = tiles
      .map((v,i)=>[v,i])
      .filter(([v])=>v===0)
      .map(([,i])=>i);
    if(!empty.length) return;
    const i = empty[Math.floor(Math.random()*empty.length)];
    tiles[i] = Math.random()<0.9?2:4;
  }

  function start(){
    tiles.fill(0); score=0; moves=0; prev=null;
    spawn(); spawn();
    render(); hud();
  }

  function hud(){
    document.getElementById('score').textContent = String(score);
    best = Math.max(best, score); localStorage.setItem('2048-best', String(best));
    document.getElementById('best').textContent = String(best);
    document.getElementById('moves').textContent = String(moves);
  }

  function move(dir){ // dir: 'left'|'right'|'up'|'down'
    prev = { tiles: tiles.slice(), score, moves };
    let changed = false;
    const combine = (arr)=>{
      const line = arr.filter(v=>v!==0);
      for(let i=0;i<line.length-1;i++){
        if(line[i]===line[i+1]){ line[i]*=2; score+=line[i]; line.splice(i+1,1); changed = true; }
      }
      while(line.length<size) line.push(0);
      return line;
    };
    if(dir==='left' || dir==='right'){
      for(let y=0;y<size;y++){
        const row = [];
        for(let x=0;x<size;x++) row.push(tiles[idx(x,y)]);
        const base = dir==='left'? row : row.reverse();
        const out = combine(base);
        const res = dir==='left'? out : out.reverse();
        for(let x=0;x<size;x++) { if(tiles[idx(x,y)]!==res[x]) changed = true; tiles[idx(x,y)] = res[x]; }
      }
    } else {
      for(let x=0;x<size;x++){
        const col = [];
        for(let y=0;y<size;y++) col.push(tiles[idx(x,y)]);
        const base = dir==='up'? col : col.reverse();
        const out = combine(base);
        const res = dir==='up'? out : out.reverse();
        for(let y=0;y<size;y++) { if(tiles[idx(x,y)]!==res[y]) changed = true; tiles[idx(x,y)] = res[y]; }
      }
    }
    if(changed){ spawn(); moves++; render(); hud(); checkEnd(); }
  }

  function checkEnd(){
    if(tiles.some(v=>v===2048)) return overlay('Você venceu!');
    if(tiles.some(v=>v===0)) return;
    // no empty, check merges
    for(let y=0;y<size;y++) for(let x=0;x<size;x++){
      const v = tiles[idx(x,y)];
      if(x+1<size && tiles[idx(x+1,y)]===v) return;
      if(y+1<size && tiles[idx(x,y+1)]===v) return;
    }
    overlay('Fim de jogo!');
  }

  function overlay(text){
    const ov = document.createElement('div');
    ov.style.position='fixed'; ov.style.inset='0'; ov.style.background='rgba(0,0,0,0.45)';
    ov.style.display='grid'; ov.style.placeItems='center'; ov.style.color='#e6e9f5'; ov.style.font='bold 32px Inter, sans-serif';
    ov.textContent=text; document.body.appendChild(ov);
    setTimeout(()=>ov.remove(), 1200);
  }

  function color(v){
    const map = {
      0: 'rgba(255,255,255,0.06)',
      2: '#e2e8f0', 4: '#cbd5e1', 8: '#fde68a', 16: '#fbbf24', 32: '#fb923c', 64: '#f87171',
      128: '#a78bfa', 256: '#7c5cff', 512: '#34d399', 1024: '#22d3ee', 2048: '#10b981'
    };
    return map[v] || '#93c5fd';
  }

  function render(){
    gridEl.innerHTML = '';
    for(let y=0;y<size;y++){
      for(let x=0;x<size;x++){
        const v = tiles[idx(x,y)];
        const tile = document.createElement('div'); tile.className='tile';
        tile.style.background = color(v);
        tile.textContent = v===0? '' : String(v);
        gridEl.appendChild(tile);
      }
    }
  }

  document.getElementById('btn-start')?.addEventListener('click', start);
  document.getElementById('btn-undo')?.addEventListener('click', ()=>{
    if(!prev) return; tiles = prev.tiles.slice(); score = prev.score; moves = prev.moves; render(); hud();
  });
  window.addEventListener('keydown', (e)=>{
    if(e.code==='ArrowLeft') move('left');
    if(e.code==='ArrowRight') move('right');
    if(e.code==='ArrowUp') move('up');
    if(e.code==='ArrowDown') move('down');
  });

  start();
})();
