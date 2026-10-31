import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1,
  infinite: false,
  gestureOrientation: 'vertical',
  normalizeWheel: true,
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const initVideoClipControl = () => {
  const video = document.querySelector('.bg-video');
  if (!video) return;

  const pageMap = {
    home: 0,
    collection: 0.2,
    heritage: 0.45,
    craftsmanship: 0.7,
    journal: 0.6,
    boutiques: 0.8,
    materials: 0.3,
    care: 0.55,
  };

  const page = document.body.dataset.page || 'home';
  const clipStart = pageMap[page] || 0;

  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('playsinline', 'true');

  video.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.min(clipStart * video.duration, Math.max(0, video.duration - 1));
    }
  });

  video.addEventListener('canplay', () => {
    video.play().catch(() => {});
  });
};

const initHeroAnimations = () => {
  const hero = document.querySelector('.hero, .page-hero');
  if (!hero) return;

  const heroTl = gsap.timeline();
  [
    ['.hero-kicker', { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out' }],
    ['.hero-title', { opacity: 0, y: 28, duration: 0.9, ease: 'power2.out' }, '-=0.35'],
    ['.hero-subtitle', { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out' }, '-=0.45'],
    ['.hero-actions', { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out' }, '-=0.35'],
    ['.hero-meta', { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, '-=0.25'],
  ].forEach(([selector, animation, position]) => {
    const target = hero.querySelector(selector);
    if (target) heroTl.from(target, animation, position);
  });

  const video = hero.querySelector('.bg-video');
  if (video) {
    gsap.to(video, {
      scale: 1.04,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  const heroContent = hero.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: -120,
      opacity: 0.55,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }

  const backgroundTitle = hero.querySelector('.hero-text-bg');
  if (backgroundTitle) {
    gsap.to(backgroundTitle, {
      y: -260,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.3,
      },
    });
  }
};

const initProductRevealAnimations = () => {
  if (!document.querySelector('.product-reveal')) return;

  gsap.set('.product-reveal-watch', { opacity: 0, y: 50, rotation: -10 });
  gsap.set('.product-reveal-details > *', { opacity: 0, y: 30 });

  ScrollTrigger.create({
    trigger: '.product-reveal',
    start: 'top 60%',
    onEnter: () => {
      gsap.to('.product-reveal-watch', {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 1.1,
        ease: 'power4.out',
      });
      gsap.to('.product-reveal-title', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
      });
      gsap.to('.product-reveal-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.1,
      });
      gsap.to('.product-reveal-cta-group', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.2,
      });
    },
    toggleActions: 'play none none reverse',
  });

  gsap.to('.product-reveal-watch', {
    rotation: 20,
    scale: 1.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.product-reveal',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });

  gsap.to('.product-reveal-details', {
    y: -150,
    ease: 'none',
    scrollTrigger: {
      trigger: '.product-reveal',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    },
  });

  gsap.to('.product-reveal-text-bg', {
    y: -250,
    ease: 'none',
    scrollTrigger: {
      trigger: '.product-reveal',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.3,
    },
  });
};

const initEthosAnimations = () => {
  if (!document.querySelector('.ethos')) return;

  gsap.utils.toArray('.ethos-bg-img').forEach((bg) => {
    gsap.to(bg, {
      scale: 1.12,
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.ethos',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  gsap.set('.ethos-text-side, .ethos-watch-img', { opacity: 0, x: 0 });
  gsap.fromTo('.ethos-main.active .ethos-text-side', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
  gsap.fromTo('.ethos-main.active .ethos-watch-img', { opacity: 0, x: 44 }, { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 });

  document.querySelectorAll('.ethos-next-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      const current = document.querySelector('.ethos-main.active');
      const next = document.querySelector(`.ethos-main[data-variant="${target}"]`);
      const currentBg = document.querySelector('.ethos-bg-img.active');
      const nextBg = document.querySelector(`.ethos-bg-img.ethos-bg-${target}`);

      if (!current || !next || !currentBg || !nextBg) return;

      const currentText = current.querySelector('.ethos-text-side');
      const currentWatch = current.querySelector('.ethos-watch-img');
      const nextText = next.querySelector('.ethos-text-side');
      const nextWatch = next.querySelector('.ethos-watch-img');

      const tl = gsap.timeline();
      tl
        .to(currentText, { x: -90, opacity: 0, duration: 0.42, ease: 'power2.inOut' })
        .to(currentWatch, { x: -140, opacity: 0, duration: 0.42, ease: 'power2.inOut' }, 0)
        .call(() => {
          current.classList.remove('active');
          next.classList.add('active');
          currentBg.classList.remove('active');
          nextBg.classList.add('active');
        })
        .fromTo(nextText, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.18)
        .fromTo(nextWatch, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2);
    });
  });
};

const initDismantleAnimations = () => {
  const canvas = document.getElementById('dismantle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const frames = [];
  const totalFrames = 152;
  let loadedCount = 0;

  const renderFrame = (frameIndex) => {
    const image = frames[frameIndex];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image && image.complete) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  for (let i = 1; i <= totalFrames; i += 1) {
    const img = new Image();
    img.onload = () => {
      loadedCount += 1;
      if (loadedCount === totalFrames) {
        renderFrame(0);
      }
    };
    img.src = `/assets/photo/v3/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
    frames.push(img);
  }

  gsap.to({}, {
    duration: 1,
    onUpdate: () => {},
    scrollTrigger: {
      trigger: '.dismantle',
      start: 'top 40%',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.round(self.progress * (totalFrames - 1));
        renderFrame(frameIndex);
      },
    },
  });

  gsap.to('.dismantle-header', {
    x: -150,
    opacity: 0,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: '.dismantle',
      start: 'top 45%',
      end: 'top 10%',
      scrub: 1,
    },
  });
};

const initNavScroll = () => {
  let lastY = window.scrollY;
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const handleScroll = () => {
    const currentY = window.scrollY;

    if (currentY > lastY && currentY > 80) {
      nav.classList.add('is-hidden');
    } else {
      nav.classList.remove('is-hidden');
    }

    lastY = currentY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
};

const initModal = () => {
  const modal = document.getElementById('reserve-modal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('.open-reserve-modal');
  const closeButton = document.getElementById('modal-close');

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button instanceof HTMLAnchorElement) event.preventDefault();
      openModal();
    });
  });

  closeButton?.addEventListener('click', closeModal);
  if (window.location.hash === '#reserve') {
    openModal();
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -90 });
      if (modal.classList.contains('active')) {
        closeModal();
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initVideoClipControl();
  initHeroAnimations();
  initProductRevealAnimations();
  initEthosAnimations();
  initDismantleAnimations();
  initNavScroll();
  initModal();
});
