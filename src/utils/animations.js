import { animate, createTimeline, stagger } from 'animejs';

/**
 * Animate the Hero entrance elements with staggered easing
 */
export const animateHeroEntrance = (container) => {
  if (!container) return;

  const tl = createTimeline({
    defaults: {
      ease: 'outExpo',
    },
  });

  tl.add('.hero-pill', {
    opacity: [0, 1],
    translateY: [-20, 0],
    scale: [0.95, 1],
    duration: 700,
  })
    .add(
      '.hero-headline',
      {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 900,
      },
      '-=450'
    )
    .add(
      '.hero-subhead',
      {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
      },
      '-=500'
    )
    .add(
      '.hero-cta-btn',
      {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.95, 1],
        delay: stagger(100),
        duration: 700,
      },
      '-=450'
    )
    .add(
      '.hero-trust-badge',
      {
        opacity: [0, 1],
        translateY: [15, 0],
        delay: stagger(60),
        duration: 600,
      },
      '-=350'
    )
    .add(
      '.hero-hud-card',
      {
        opacity: [0, 1],
        translateY: [35, 0],
        scale: [0.98, 1],
        duration: 1000,
      },
      '-=600'
    );
};

/**
 * Smoothly interpolates numerical values using Anime.js
 */
export const animateCounter = (element, start, end, duration = 1200, decimals = 0, suffix = '') => {
  if (!element) return;

  const obj = { val: start };
  animate(obj, {
    val: end,
    duration: duration,
    ease: 'outQuad',
    onUpdate: () => {
      element.innerHTML = `${obj.val.toFixed(decimals)}${suffix}`;
    },
  });
};

/**
 * Enterprise Card Tilt / Levitation Animation
 */
export const animateCardHover = (card, isEntering) => {
  if (!card) return;

  animate(card, {
    translateY: isEntering ? -4 : 0,
    scale: isEntering ? 1.01 : 1,
    duration: 350,
    ease: 'outQuad',
  });
};
