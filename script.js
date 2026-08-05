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
})();
