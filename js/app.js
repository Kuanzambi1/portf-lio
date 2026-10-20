(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const nav = document.querySelector('nav');
  const navToggle = document.getElementById('nav-toggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('nav-open');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
      });
    });
  }

  const boot = document.getElementById('boot');
  if (boot) {
    const bootLogEl = document.getElementById('boot-log');
    const bootBar = document.querySelector('#boot-bar span');
    const bootLines = [
      ['> iniciando kernel de portfólio...', 'ok'],
      ['> a carregar módulo <span class="tag">FRONTEND</span>...', 'ok'],
      ['> a carregar módulo <span class="tag">BACKEND</span>...', 'ok'],
      ['> a carregar módulo <span class="tag">DADOS</span>...', 'ok'],
      ['> a estabelecer perfil: EMANUEL KUANZAMBI', 'ok'],
      ['> todos os sistemas operacionais.', 'ok']
    ];
    const bootDelay = 160;
    bootLines.forEach((l, i) => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.innerHTML = l[0];
        if (l[1] === 'ok') div.innerHTML += ' <span class="ok">[OK]</span>';
        bootLogEl.appendChild(div);
      }, bootDelay * (i + 1));
    });
    setTimeout(() => { if (bootBar) bootBar.style.width = '100%'; }, 120);
    setTimeout(() => { boot.classList.add('hide'); }, 1700);
  }

  const roleEl = document.getElementById('role-text');
  if (roleEl) {
    const roles = ['Desenvolvedor Web Fullstack', 'Engenheiro de Software', 'Engenheiro de Dados'];
    let ri = 0, ci = 0, deleting = false;
    function typeRole() {
      const current = roles[ri];
      if (!deleting) {
        ci++;
        roleEl.textContent = current.slice(0, ci);
        if (ci === current.length) { deleting = true; setTimeout(typeRole, 1400); return; }
      } else {
        ci--;
        roleEl.textContent = current.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(typeRole, deleting ? 35 : 65);
    }
    setTimeout(typeRole, boot ? 1900 : 200);
  }

  document.querySelectorAll('.reveal').forEach((el) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    io.observe(el);
  });

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  const uptime = document.getElementById('uptime');
  if (uptime) {
    const start = Date.now();
    setInterval(() => {
      const diff = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const s = String(diff % 60).padStart(2, '0');
      uptime.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }

  const canvas = document.getElementById('circuit-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  const nodes = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NODE_COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    });
  }

  const mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(0,229,255,${(1 - dist / 140) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }
      const dxm = n.x - mouse.x, dym = n.y - mouse.y;
      const dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 180) {
        ctx.strokeStyle = `rgba(155,107,255,${(1 - dm / 180) * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0,229,255,0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  draw();
})();
