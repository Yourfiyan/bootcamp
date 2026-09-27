import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis Smooth Scroll synchronized with GSAP ScrollTrigger
 */
export const initSmoothScroll = () => {
  if (typeof window === 'undefined') return { lenis: null, destroy: () => {} };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return { lenis: null, destroy: () => {} };
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
  });

  // Synchronize Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const updateTicker = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(updateTicker);
  gsap.ticker.lagSmoothing(0);

  // Give DOM and fonts time to calculate accurate layout bounds
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  return {
    lenis,
    destroy: () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    },
  };
};

/**
 * Magnetic button micro-interaction (Step 10)
 * Gently pulls element towards cursor within radius with spring release
 */
export const setupMagneticElement = (element, strength = 0.28) => {
  if (!element || typeof window === 'undefined') return () => {};
  if (window.matchMedia('(pointer: coarse)').matches) return () => {};

  let boundRect = element.getBoundingClientRect();
  const handleMouseEnter = () => {
    boundRect = element.getBoundingClientRect();
  };

  const handleMouseMove = (e) => {
    const x = (e.clientX - (boundRect.left + boundRect.width / 2)) * strength;
    const y = (e.clientY - (boundRect.top + boundRect.height / 2)) * strength;

    gsap.to(element, {
      x,
      y,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1.1, 0.4)',
    });
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * 3D Viewport / Window Tilt effect for sections (Step 5 of prompt)
 * Creates subtle physical surface movement through 3D space as user scrolls
 */
export const setupViewportTilt = (element, options = {}) => {
  if (!element || typeof window === 'undefined') return () => {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || window.innerWidth < 768) return () => {};

  const {
    enterRotateX = 3.5,
    exitRotateX = -2.5,
    enterScale = 0.97,
    exitScale = 0.98,
  } = options;

  const t1 = gsap.fromTo(
    element,
    {
      rotateX: enterRotateX,
      scale: enterScale,
      transformPerspective: 1200,
      transformOrigin: 'center top',
    },
    {
      rotateX: 0,
      scale: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        end: 'top 35%',
        scrub: 1,
      },
    }
  );

  const t2 = gsap.fromTo(
    element,
    {
      rotateX: 0,
      scale: 1,
    },
    {
      rotateX: exitRotateX,
      scale: exitScale,
      transformPerspective: 1200,
      transformOrigin: 'center bottom',
      scrollTrigger: {
        trigger: element,
        start: 'bottom 65%',
        end: 'bottom 15%',
        scrub: 1,
      },
    }
  );

  return () => {
    t1.scrollTrigger?.kill();
    t1.kill();
    t2.scrollTrigger?.kill();
    t2.kill();
  };
};

/**
 * Tactical Monochrome / Contrast Transition (Step 6)
 * Transitions section into stark tactical radar monochrome on enter, and returns to color on exit
 */
export const setupMonochromeTransition = (sectionElement, targetContainer) => {
  if (!sectionElement || typeof window === 'undefined') return () => {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return () => {};

  const target = targetContainer || sectionElement;

  const tween = gsap.fromTo(
    target,
    {
      filter: 'grayscale(0%) contrast(100%)',
    },
    {
      filter: 'grayscale(100%) contrast(115%)',
      scrollTrigger: {
        trigger: sectionElement,
        start: 'top 75%',
        end: 'top 30%',
        scrub: 1,
      },
    }
  );

  const exitTween = gsap.fromTo(
    target,
    {
      filter: 'grayscale(100%) contrast(115%)',
    },
    {
      filter: 'grayscale(0%) contrast(100%)',
      scrollTrigger: {
        trigger: sectionElement,
        start: 'bottom 70%',
        end: 'bottom 20%',
        scrub: 1,
      },
    }
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    exitTween.scrollTrigger?.kill();
    exitTween.kill();
  };
};

/**
 * Scroll velocity reactive motion (Step 14)
 * Clamps subtle vertical skew/displacement to high scroll velocity without shaking
 */
export const setupScrollVelocityResponse = (lenisInstance, targets) => {
  if (!lenisInstance || typeof window === 'undefined') return () => {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || window.innerWidth < 768) return () => {};

  const elements = document.querySelectorAll(targets);
  if (!elements.length) return () => {};

  let currentSkew = 0;
  let animId;

  const onScroll = ({ velocity }) => {
    // Clamp velocity to avoid aggressive distortion
    const clampedVelocity = Math.max(Math.min(velocity, 15), -15);
    const targetSkew = clampedVelocity * 0.08; // Max ~1.2 degrees

    gsap.to(elements, {
      skewY: targetSkew,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  lenisInstance.on('scroll', onScroll);

  return () => {
    lenisInstance.off('scroll', onScroll);
    gsap.set(elements, { skewY: 0 });
  };
};
