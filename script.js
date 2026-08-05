/* ============================================
   Vedant Parnaik — Portfolio JS
   ============================================ */

(function () {
  'use strict';

  // ---- Nav: shadow on scroll ----
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 16) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ---- Smooth scroll for in-page anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ---- Reveal on scroll (IntersectionObserver) ----
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Gallery image carousels ----
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(track.children);
    const dots = Array.from(carousel.querySelectorAll('[data-carousel-dots] button'));
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    let index = 0;

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
      dots.forEach((dot, di) => dot.classList.toggle('is-active', di === index));
    };

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    dots.forEach((dot, di) => dot.addEventListener('click', () => goTo(di)));

    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== index && i >= 0 && i < slides.length) {
        index = i;
        dots.forEach((dot, di) => dot.classList.toggle('is-active', di === index));
      }
    }, { passive: true });
  });

  // ---- Subtle parallax on hero glow ----
  const glow = document.querySelector('.bg-glow');
  if (glow && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      glow.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
    });
  }

  // ---- Cursor / scroll-reactive network web (below hero) ----
  (function initNetwork() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      canvas.style.display = 'none';
      return;
    }

    const hero = document.getElementById('home');
    const ctx = canvas.getContext('2d');
    const mouse = { x: null, y: null, active: false };
    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let scrollY = window.scrollY;
    let raf = 0;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    const config = () => ({
      count: isMobile() ? 36 : 70,
      connectDist: isMobile() ? 110 : 140,
      mouseDist: isMobile() ? 120 : 170,
      speed: isMobile() ? 0.22 : 0.35,
    });

    function updateVisibility() {
      if (!hero) {
        canvas.classList.add('is-visible');
        return;
      }
      const heroBottom = hero.offsetTop + hero.offsetHeight * 0.55;
      if (window.scrollY > heroBottom - window.innerHeight * 0.25) {
        canvas.classList.add('is-visible');
      } else {
        canvas.classList.remove('is-visible');
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function spawn() {
      const { count, speed } = config();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.6 + 0.8,
      }));
    }

    function draw() {
      const { connectDist, mouseDist } = config();
      const scrollDrift = scrollY * 0.018;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy + Math.sin((scrollDrift + i) * 0.03) * 0.08;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseDist && dist > 0.1) {
            const force = (mouseDist - dist) / mouseDist;
            p.x -= (dx / dist) * force * 1.4;
            p.y -= (dy / dist) * force * 1.4;
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouseDist) {
            const alpha = (1 - dist / mouseDist) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(13, 148, 136, 0.45)';
        ctx.fill();
      }

      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.55)';
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      resize();
      updateVisibility();
      raf = requestAnimationFrame(draw);
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
      updateVisibility();
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!e.touches[0]) return;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.active = false;
    }, { passive: true });

    resize();
    updateVisibility();
    raf = requestAnimationFrame(draw);
  })();

  // ---- Hero: structured robotics / ML perception graph ----
  (function initHeroNetwork() {
    const canvas = document.getElementById('hero-network');
    const hero = document.getElementById('home');
    if (!canvas || !hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    const mouse = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let edges = [];
    let packets = [];
    let t = 0;
    let raf = 0;

    const labelsLeft = ['CAM', 'LiDAR', 'RADAR', 'IMU', 'GNSS'];
    const labelsMid = ['DETECT', 'SEGMENT', 'DEPTH', 'TRACK'];
    const labelsRight = ['FUSION', 'SLAM', 'PLAN'];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = hero.getBoundingClientRect();
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGraph();
    }

    function layerX(i, n) {
      // Bias graph toward left/center so portrait stays readable
      const mobile = width < 768;
      const start = mobile ? width * 0.08 : width * 0.04;
      const end = mobile ? width * 0.92 : width * 0.58;
      if (n === 1) return (start + end) / 2;
      return start + (i / (n - 1)) * (end - start);
    }

    function buildGraph() {
      nodes = [];
      edges = [];
      packets = [];

      const layers = [
        { labels: labelsLeft, y: height * 0.22 },
        { labels: labelsMid, y: height * 0.48 },
        { labels: labelsRight, y: height * 0.74 },
      ];

      const layerNodes = layers.map((layer, li) => {
        return layer.labels.map((label, i) => {
          const node = {
            id: `${li}-${i}`,
            label,
            layer: li,
            ox: layerX(i, layer.labels.length),
            oy: layer.y + (i % 2 === 0 ? -18 : 18) * (width < 768 ? 0.4 : 1),
            x: 0,
            y: 0,
            phase: Math.random() * Math.PI * 2,
            r: li === 2 ? 5.5 : 4.2,
            hub: li === 2 && i === 0,
          };
          nodes.push(node);
          return node;
        });
      });

      // Fully connect adjacent layers (neural-style)
      for (let li = 0; li < layerNodes.length - 1; li++) {
        layerNodes[li].forEach((a) => {
          layerNodes[li + 1].forEach((b) => {
            edges.push({ a, b, pulse: Math.random() });
          });
        });
      }

      // Orbital sensor ring around portrait (right side)
      if (width >= 768) {
        const cx = width * 0.78;
        const cy = height * 0.48;
        const ringR = Math.min(160, width * 0.12);
        const sensors = ['VISION', 'DEPTH', 'POSE', 'CTRL'];
        const orbit = sensors.map((label, i) => {
          const ang = (i / sensors.length) * Math.PI * 2 - Math.PI / 2;
          const node = {
            id: `orbit-${i}`,
            label,
            layer: 3,
            ox: cx + Math.cos(ang) * ringR,
            oy: cy + Math.sin(ang) * ringR,
            x: 0,
            y: 0,
            phase: ang,
            r: 4,
            hub: false,
            orbit: true,
            orbitCx: cx,
            orbitCy: cy,
            orbitR: ringR,
            orbitAng: ang,
          };
          nodes.push(node);
          return node;
        });

        const core = {
          id: 'core',
          label: 'AI',
          layer: 4,
          ox: cx,
          oy: cy,
          x: 0,
          y: 0,
          phase: 0,
          r: 7,
          hub: true,
          core: true,
        };
        nodes.push(core);
        orbit.forEach((n) => edges.push({ a: n, b: core, pulse: Math.random() }));

        // Bridge mid-layer into fusion core
        layerNodes[2].forEach((n) => edges.push({ a: n, b: core, pulse: Math.random() }));
      }

      // Seed traveling packets
      for (let i = 0; i < Math.min(18, edges.length); i++) {
        const e = edges[Math.floor(Math.random() * edges.length)];
        packets.push({
          edge: e,
          t: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
        });
      }
    }

    function drawHex(x, y, r, alpha) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i + Math.PI / 6;
        const px = x + Math.cos(ang) * r;
        const py = y + Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function draw() {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      // Soft vignette wash so graph feels embedded
      const g = ctx.createRadialGradient(width * 0.35, height * 0.45, 40, width * 0.4, height * 0.5, width * 0.7);
      g.addColorStop(0, 'rgba(13, 148, 136, 0.045)');
      g.addColorStop(1, 'rgba(13, 148, 136, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Update node positions with gentle float + mouse parallax
      nodes.forEach((n) => {
        if (n.orbit) {
          n.orbitAng += 0.0022;
          n.x = n.orbitCx + Math.cos(n.orbitAng) * n.orbitR;
          n.y = n.orbitCy + Math.sin(n.orbitAng) * n.orbitR;
        } else {
          const floatX = Math.sin(t * 0.01 + n.phase) * 4;
          const floatY = Math.cos(t * 0.012 + n.phase) * 5;
          let mx = 0;
          let my = 0;
          if (mouse.active) {
            const dx = mouse.x - n.ox;
            const dy = mouse.y - n.oy;
            const dist = Math.hypot(dx, dy) || 1;
            const pull = Math.max(0, 1 - dist / 280);
            mx = (dx / dist) * pull * 14;
            my = (dy / dist) * pull * 14;
          }
          n.x = n.ox + floatX + mx;
          n.y = n.oy + floatY + my;
        }
      });

      // Orbital rings behind portrait
      const core = nodes.find((n) => n.core);
      if (core) {
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(core.x, core.y, 70 + i * 36, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 / i})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        drawHex(core.x, core.y, 52 + Math.sin(t * 0.02) * 3, 0.18);
        drawHex(core.x, core.y, 78 + Math.cos(t * 0.015) * 4, 0.1);
      }

      // Edges
      edges.forEach((e) => {
        const dx = e.b.x - e.a.x;
        const dy = e.b.y - e.a.y;
        const dist = Math.hypot(dx, dy) || 1;
        let near = 0;
        if (mouse.active) {
          // Distance from mouse to segment midpoint
          const mx = (e.a.x + e.b.x) / 2;
          const my = (e.a.y + e.b.y) / 2;
          near = Math.max(0, 1 - Math.hypot(mouse.x - mx, mouse.y - my) / 160);
        }
        const base = e.a.orbit || e.b.orbit ? 0.14 : 0.1;
        const alpha = base + near * 0.35 + Math.sin(t * 0.03 + e.pulse * 10) * 0.03;
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.strokeStyle = near > 0.2
          ? `rgba(99, 102, 241, ${alpha})`
          : `rgba(13, 148, 136, ${alpha})`;
        ctx.lineWidth = near > 0.25 ? 1.4 : 1;
        ctx.stroke();
      });

      // Traveling inference packets
      packets.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.edge = edges[Math.floor(Math.random() * edges.length)];
        }
        const e = p.edge;
        const x = e.a.x + (e.b.x - e.a.x) * p.t;
        const y = e.a.y + (e.b.y - e.a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.75)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
        ctx.fill();
      });

      // Nodes + labels
      nodes.forEach((n) => {
        // glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 6, 0, Math.PI * 2);
        ctx.fillStyle = n.hub
          ? 'rgba(99, 102, 241, 0.12)'
          : 'rgba(13, 148, 136, 0.08)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.hub ? 'rgba(99, 102, 241, 0.85)' : 'rgba(13, 148, 136, 0.75)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (width >= 640) {
          ctx.font = '500 10px JetBrains Mono, monospace';
          ctx.fillStyle = 'rgba(82, 82, 91, 0.72)';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + n.r + 14);
        }
      });

      // Cursor link halo when active in hero
      if (mouse.active) {
        nodes.forEach((n) => {
          const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.35;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      }

      raf = requestAnimationFrame(draw);
    }

    function onMove(e) {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height && mouse.x >= 0 && mouse.x <= rect.width;
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      resize();
      raf = requestAnimationFrame(draw);
    }, { passive: true });

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', () => { mouse.active = false; }, { passive: true });

    resize();
    raf = requestAnimationFrame(draw);
  })();
})();
