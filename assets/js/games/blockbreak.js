(function(){
  const canvas = document.getElementById('game');
  if(!canvas) return; // only on game page
  const ctx = canvas.getContext('2d');

  // Dimensions
  const W = canvas.width;
  const H = canvas.height;

  // Game state
  const state = {
    running: false,
    paused: false,
    score: 0,
    lives: 3,
    level: 1,
  };

  // Paddle
  const paddle = {
    w: 140,
    h: 18,
    x: (W - 140)/2,
    y: H - 40,
    speed: 9
  };

  // Ball
  const ball = {
    r: 9,
    x: W/2,
    y: H - 60,
    dx: 4,
    dy: -4,
    stuck: true // stuck to paddle until launch
  };

  // Bricks
  const BRICK_ROWS_START = 5;
  const BRICK_COLS = 12;
  const BRICK_W = Math.floor((W - 120) / BRICK_COLS);
  const BRICK_H = 24;
  const BRICK_GAP = 6;

  let bricks = [];

  function createLevel(level){
    const rows = BRICK_ROWS_START + Math.min(4, level-1); // up to +4 rows
    bricks = [];
    for(let r=0;r<rows;r++){
      for(let c=0;c<BRICK_COLS;c++){
        const strength = 1 + Math.floor((level-1)/2) + (r%2===0?0:1);
        bricks.push({
          x: 60 + c*(BRICK_W+BRICK_GAP),
          y: 60 + r*(BRICK_H+BRICK_GAP),
          w: BRICK_W,
          h: BRICK_H,
          hp: strength,
          color: `hsl(${(r*25 + c*4)%360} 80% 60%)`
        });
      }
    }
  }

  function resetBall(){
    ball.x = paddle.x + paddle.w/2;
    ball.y = paddle.y - ball.r - 2;
    ball.dx = 4 * (Math.random()>0.5?1:-1);
    ball.dy = -4;
    ball.stuck = true;
  }

  function start(){
    state.running = true; state.paused = false; state.score = 0; state.lives = 3; state.level = 1;
    createLevel(state.level);
    resetBall();
    loop();
    updateHud();
  }

  function nextLevel(){
    state.level += 1;
    createLevel(state.level);
    resetBall();
    updateHud();
  }

  function gameOver(){
    state.running = false;
    draw();
    overlayText('Fim de jogo! Clique em Reiniciar');
  }

  // Controls
  let mouseX = null;
  window.addEventListener('mousemove', (e)=>{
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
  });
  window.addEventListener('keydown', (e)=>{
    if(e.code === 'Space') { ball.stuck = false; }
    if(e.code === 'KeyP') { state.paused = !state.paused; }
    if(e.code === 'ArrowLeft') { paddle.x -= paddle.speed*2; }
    if(e.code === 'ArrowRight') { paddle.x += paddle.speed*2; }
  });

  document.getElementById('btn-start')?.addEventListener('click', ()=>{ if(!state.running) start(); else { ball.stuck=false; }});
  document.getElementById('btn-restart')?.addEventListener('click', ()=>{ start(); });
  document.getElementById('btn-pause')?.addEventListener('click', ()=>{ if(state.running) state.paused = !state.paused; });

  // Update HUD
  function updateHud(){
    document.getElementById('score').textContent = String(state.score);
    document.getElementById('lives').textContent = String(state.lives);
    document.getElementById('level').textContent = String(state.level);
  }

  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  function update(){
    if(!state.running || state.paused) return;

    // Paddle motion
    if(mouseX !== null){
      paddle.x = clamp(mouseX - paddle.w/2, 10, W - paddle.w - 10);
    }

    if(ball.stuck){
      ball.x = paddle.x + paddle.w/2;
      ball.y = paddle.y - ball.r - 2;
      return;
    }

    // Move ball
    ball.x += ball.dx; ball.y += ball.dy;

    // Wall collisions
    if(ball.x < ball.r) { ball.x = ball.r; ball.dx *= -1; }
    if(ball.x > W - ball.r) { ball.x = W - ball.r; ball.dx *= -1; }
    if(ball.y < ball.r) { ball.y = ball.r; ball.dy *= -1; }

    // Bottom
    if(ball.y > H + ball.r){
      state.lives -= 1; updateHud();
      if(state.lives <= 0) return gameOver();
      resetBall();
      return;
    }

    // Paddle collision
    if(ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w){
      ball.y = paddle.y - ball.r;
      // reflect with angle based on hit position
      const hit = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
      const speed = Math.hypot(ball.dx, ball.dy) * 1.02;
      const angle = hit * (Math.PI/3); // -60..60 degrees
      ball.dx = speed * Math.sin(angle);
      ball.dy = -Math.abs(speed * Math.cos(angle));
    }

    // Brick collisions
    for(let i=0;i<bricks.length;i++){
      const b = bricks[i]; if(b.hp <= 0) continue;
      if(ball.x + ball.r < b.x || ball.x - ball.r > b.x + b.w || ball.y + ball.r < b.y || ball.y - ball.r > b.y + b.h) continue;
      // collision detected - decide reflection side
      const prevX = ball.x - ball.dx;
      const prevY = ball.y - ball.dy;
      const fromLeft = prevX <= b.x;
      const fromRight = prevX >= b.x + b.w;
      const fromTop = prevY <= b.y;
      const fromBottom = prevY >= b.y + b.h;
      if((fromLeft && !fromRight) || (!fromLeft && fromRight)) ball.dx *= -1; else ball.dy *= -1;
      b.hp -= 1; state.score += 10; updateHud();
      break;
    }

    // Win level?
    if(bricks.every(b=>b.hp<=0)){
      nextLevel();
    }
  }

  function draw(){
    // clear
    ctx.clearRect(0,0,W,H);

    // background
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0,0,W,H);

    // bricks
    for(const b of bricks){
      if(b.hp<=0) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }

    // paddle
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

    // ball
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
  }

  function overlayText(text){
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#e6e9f5';
    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, W/2, H/2);
    ctx.restore();
  }

  let last = 0;
  function loop(ts=0){
    if(!state.running){ draw(); return; }
    const dt = ts - last; last = ts;
    if(!state.paused) update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // Initialize
  createLevel(state.level);
  resetBall();
  draw();
})();
