(function(){
  const canvas = document.getElementById('game');
  if(!canvas) return; const ctx = canvas.getContext('2d');

  const size = 32; // grid size
  const cols = canvas.width / size;
  const rows = canvas.height / size;

  let snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
  let dir = {x: 1, y: 0};
  let pendingDir = dir;
  let food = spawnFood();
  let score = 0;
  let best = Number(localStorage.getItem('snake-best') || 0);
  let speed = 8; // ticks per second
  let acc = 0;
  let running = false;

  function spawnFood(){
    while(true){
      const f = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
      if(!snake.some(s => s.x===f.x && s.y===f.y)) return f;
    }
  }

  function start(){ running = true; score=0; snake=[{x:Math.floor(cols/2), y:Math.floor(rows/2)}]; dir={x:1,y:0}; pendingDir=dir; food=spawnFood(); acc=0; updateHud(); }

  document.getElementById('btn-start')?.addEventListener('click', ()=>{ if(!running) start(); });
  document.getElementById('btn-restart')?.addEventListener('click', ()=>{ start(); });

  window.addEventListener('keydown', (e)=>{
    if(e.code==='ArrowUp' && dir.y!==1) pendingDir={x:0,y:-1};
    if(e.code==='ArrowDown' && dir.y!==-1) pendingDir={x:0,y:1};
    if(e.code==='ArrowLeft' && dir.x!==1) pendingDir={x:-1,y:0};
    if(e.code==='ArrowRight' && dir.x!==-1) pendingDir={x:1,y:0};
    if(e.code==='Space') running = !running;
  });

  function update(dt){
    if(!running) return;
    acc += dt/1000;
    const step = 1/speed;
    while(acc >= step){
      acc -= step;
      dir = pendingDir;
      const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      // wrap
      head.x = (head.x + cols) % cols;
      head.y = (head.y + rows) % rows;

      // self collision
      if(snake.some(s => s.x===head.x && s.y===head.y)){
        running = false; draw(); overlay('Fim de jogo'); return;
      }

      snake.unshift(head);
      if(head.x === food.x && head.y === food.y){
        score += 10; speed = Math.min(18, speed + 0.2); food = spawnFood(); updateHud();
      } else {
        snake.pop();
      }
    }
  }

  function draw(){
    ctx.fillStyle = '#0b1020'; ctx.fillRect(0,0,canvas.width, canvas.height);

    // food
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(food.x*size, food.y*size, size, size);

    // snake
    for(let i=0;i<snake.length;i++){
      ctx.fillStyle = i===0 ? '#10b981' : '#34d399';
      ctx.fillRect(snake[i].x*size+2, snake[i].y*size+2, size-4, size-4);
    }
  }

  function overlay(text){
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = '#e6e9f5'; ctx.font = 'bold 36px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width/2, canvas.height/2);
    ctx.restore();
  }

  function updateHud(){
    document.getElementById('score').textContent = String(score);
    best = Math.max(best, score);
    localStorage.setItem('snake-best', String(best));
    document.getElementById('best').textContent = String(best);
    document.getElementById('speed').textContent = (Math.round(speed*10)/10) + 'x';
  }

  let last = 0;
  function loop(ts){
    const dt = ts - last; last = ts;
    update(dt); draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
