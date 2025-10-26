(function(){
  const board = document.getElementById('game-board');
  const status = document.getElementById('status');
  if(!board || !status) return;

  let state = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameOver = false;
  let scores = {x: Number(localStorage.getItem('ttt-x')||0), o: Number(localStorage.getItem('ttt-o')||0), draw: Number(localStorage.getItem('ttt-draw')||0)};

  const WIN_PATTERNS = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6] // diagonals
  ];

  function checkWinner(){
    for(const pattern of WIN_PATTERNS){
      const [a,b,c] = pattern;
      if(state[a] && state[a]===state[b] && state[a]===state[c]){
        return {winner: state[a], pattern};
      }
    }
    if(!state.includes(null)) return {winner: 'draw'};
    return null;
  }

  function handleClick(idx){
    if(gameOver || state[idx]) return;
    state[idx] = currentPlayer;
    render();
    const result = checkWinner();
    if(result){
      gameOver = true;
      if(result.winner === 'draw'){
        status.textContent = 'Empate!';
        scores.draw++;
        localStorage.setItem('ttt-draw', String(scores.draw));
      } else {
        status.textContent = `Jogador ${result.winner} venceu!`;
        if(result.winner === 'X') { scores.x++; localStorage.setItem('ttt-x', String(scores.x)); }
        else { scores.o++; localStorage.setItem('ttt-o', String(scores.o)); }
        highlightWin(result.pattern);
      }
      updateScores();
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `Vez do jogador ${currentPlayer}`;
    }
  }

  function highlightWin(pattern){
    pattern.forEach(i => {
      const cell = board.children[i];
      cell.style.background = 'rgba(124,92,255,0.3)';
    });
  }

  function render(){
    board.innerHTML = '';
    for(let i=0;i<9;i++){
      const cell = document.createElement('button');
      cell.style.cssText = 'aspect-ratio:1/1; background:var(--bg-elev); border:1px solid var(--border); border-radius:12px; font-size:3rem; font-weight:900; color:var(--text); cursor:pointer; transition:all .2s ease;';
      cell.textContent = state[i] || '';
      if(state[i]==='X') cell.style.color = '#22d3ee';
      if(state[i]==='O') cell.style.color = '#f472b6';
      cell.addEventListener('click', ()=>handleClick(i));
      cell.addEventListener('mouseenter', ()=>{ if(!state[i] && !gameOver) cell.style.background='rgba(124,92,255,0.15)'; });
      cell.addEventListener('mouseleave', ()=>{ if(!state[i]) cell.style.background='var(--bg-elev)'; });
      board.appendChild(cell);
    }
  }

  function restart(){
    state.fill(null);
    currentPlayer = 'X';
    gameOver = false;
    status.textContent = 'Vez do jogador X';
    render();
  }

  function updateScores(){
    document.getElementById('score-x').textContent = String(scores.x);
    document.getElementById('score-o').textContent = String(scores.o);
    document.getElementById('score-draw').textContent = String(scores.draw);
  }

  function resetScores(){
    scores = {x:0, o:0, draw:0};
    localStorage.removeItem('ttt-x');
    localStorage.removeItem('ttt-o');
    localStorage.removeItem('ttt-draw');
    updateScores();
  }

  document.getElementById('btn-restart')?.addEventListener('click', restart);
  document.getElementById('btn-reset-scores')?.addEventListener('click', resetScores);

  restart();
  updateScores();
})();
