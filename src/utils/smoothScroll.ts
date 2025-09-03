/**
 * Natural Gliding Smooth Scroll Utility
 * Creates a smooth, gliding scrolling experience that feels natural
 * Optimized for both mobile and desktop devices
 */

// Extend Window interface for custom properties
declare global {
  interface Window {
    currentScrollAnimation?: number;
  }
}

export interface SmoothScrollOptions {
  duration?: number;
  easing?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear' | 'bounce' | 'elastic';
  offset?: number;
}

/**
 * Natural easing functions for smooth gliding
 */
const easingFunctions = {
  easeInOut: (t: number): number => {
    // Natural, smooth acceleration and deceleration
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeIn: (t: number): number => {
    // Gentle start, natural acceleration
    return t * t;
  },
  easeOut: (t: number): number => {
    // Natural deceleration, gentle stop
    return 1 - (1 - t) * (1 - t);
  },
  linear: (t: number): number => {
    // Consistent speed
    return t;
  },
  bounce: (t: number): number => {
    // Playful bounce effect
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
  elastic: (t: number): number => {
    // Natural elastic motion
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
  }
};

/**
 * Natural smooth scroll to a specific element or position
 */
export const smoothScrollTo = (
  target: string | HTMLElement | number,
  options: SmoothScrollOptions = {}
): void => {
  const {
    duration = 800, // Natural duration for smooth gliding
    easing = 'easeInOut', // Natural easing by default
    offset = 0
  } = options;

  // Try CSS smooth scrolling first for natural feel
  if ('scrollBehavior' in document.documentElement.style) {
    try {
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
          return;
        }
      } else if (typeof target === 'number') {
        window.scrollTo({ 
          top: target + offset, 
          behavior: 'smooth',
          left: 0
        });
        return;
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
        return;
      }
    } catch (error) {
      console.log('CSS smooth scrolling failed, using JavaScript fallback');
    }
  }

  // Natural JavaScript smooth scrolling with gliding feel
  const startPosition = window.pageYOffset;
  let targetPosition: number;

  if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (!element) return;
    targetPosition = (element as HTMLElement).offsetTop + offset;
  } else if (typeof target === 'number') {
    targetPosition = target + offset;
  } else if (target instanceof HTMLElement) {
    targetPosition = target.offsetTop + offset;
  } else {
    return;
  }

  const distance = targetPosition - startPosition;
  let startTime: number | null = null;
  let animationId: number;

  const easingFunction = easingFunctions[easing] || easingFunctions.easeInOut;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easingFunction(progress);

    // Smooth, gliding scroll motion
    window.scrollTo(0, startPosition + distance * easedProgress);

    if (timeElapsed < duration) {
      animationId = requestAnimationFrame(animation);
    }
  };

  // Cancel any existing animation
  if (window.currentScrollAnimation) {
    cancelAnimationFrame(window.currentScrollAnimation);
  }

  window.currentScrollAnimation = requestAnimationFrame(animation);
};

/**
 * Natural smooth scroll to top of the page
 */
export const smoothScrollToTop = (options?: SmoothScrollOptions): void => {
  smoothScrollTo(0, { duration: 600, easing: 'easeOut', ...options });
};

/**
 * Natural smooth scroll to a specific element by ID
 */
export const smoothScrollToElement = (
  elementId: string,
  options?: SmoothScrollOptions
): void => {
  smoothScrollTo(`#${elementId}`, { duration: 800, easing: 'easeInOut', ...options });
};

/**
 * Natural smooth scroll to a specific element by selector
 */
export const smoothScrollToSelector = (
  selector: string,
  options?: SmoothScrollOptions
): void => {
  smoothScrollTo(selector, { duration: 800, easing: 'easeInOut', ...options });
};

/**
 * Check if smooth scrolling is supported
 */
export const isSmoothScrollingSupported = (): boolean => {
  return 'scrollBehavior' in document.documentElement.style;
};

/**
 * Enable natural smooth scrolling for all anchor links
 */
export const enableSmoothScrollingForAnchors = (): void => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a[href^="#"]');
    
    if (anchor) {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        // Natural smooth scrolling with appropriate duration
        setTimeout(() => {
          smoothScrollTo(href, { 
            duration: 800, 
            easing: 'easeInOut',
            offset: 80
          });
        }, 50);
      }
    }
  });
};

/**
 * Initialize natural smooth scrolling functionality
 */
export const initSmoothScrolling = (): void => {
  // Enable smooth scrolling for anchor links
  enableSmoothScrollingForAnchors();
  
  // Add smooth scrolling class to body
  document.body.classList.add('smooth-scroll-force');
  
  // Add smooth scrolling to all scrollable elements
  const scrollableElements = document.querySelectorAll('div, section, article, main, nav, footer');
  scrollableElements.forEach(element => {
    element.classList.add('scroll-container');
  });

  console.log('✅ Natural smooth scrolling initialized for gliding experience');
};
