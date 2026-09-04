(() => {
  const $ = (s) => document.querySelector(s);
  const loader = $('#loader');
  const progress = $('#progressBar');
  const nav = $('#nav');
  const canvas = $('#field');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, points = [];

  const resize = () => {
    w = canvas.width = window.innerWidth * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    points = Array.from({ length: Math.min(75, Math.floor(window.innerWidth / 18)) }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
      r: Math.random() * 1.3 + .25
    }));
  };
  const field = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of points) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(114,229,255,.55)'; ctx.fill();
    }
    for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x, dy = points[i].y - points[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 125) { ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y); ctx.strokeStyle = `rgba(114,229,255,${(1-d/125)*.09})`; ctx.stroke(); }
    }
    requestAnimationFrame(field);
  };
  resize(); field(); window.addEventListener('resize', resize);

  window.addEventListener('load', () => setTimeout(() => {
    loader.style.opacity = '0'; loader.style.pointerEvents = 'none'; loader.style.transition = 'opacity .8s ease';
  }, 850));

  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max ? scrollY / max * 100 : 0}%`;
    nav.classList.toggle('scrolled', scrollY > 30);
  };
  window.addEventListener('scroll', update, { passive: true }); update();

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.section-index,.display-label,.about-copy,.journey-head,.timeline-card,.project,.stack-card,.principle-big,.principles-list>div,.github-card,.contact-inner').forEach((el) => {
      gsap.from(el, { opacity: 0, y: 28, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.from('.hero-copy > *', { opacity: 0, y: 25, duration: .9, stagger: .09, delay: 1, ease: 'power3.out' });
    gsap.to('.hero-orbit', { y: -55, rotation: 4, ease: 'none', scrollTrigger: { trigger: '.hero', scrub: 1 } });
    gsap.utils.toArray('.project').forEach((el, i) => gsap.to(el.querySelector('.project-visual'), { y: i % 2 ? -10 : 10, ease: 'none', scrollTrigger: { trigger: el, scrub: 1 } }));
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  }));

  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      const visual = card.querySelector('.project-visual');
      if (visual) visual.style.transform = `perspective(900px) rotateX(${y*-2}deg) rotateY(${x*2}deg)`;
    });
    card.addEventListener('mouseleave', () => { const v=card.querySelector('.project-visual'); if(v) v.style.transform=''; });
  });
})();