import { useCallback } from 'react';
import { 
  smoothScrollTo, 
  smoothScrollToTop, 
  smoothScrollToElement, 
  smoothScrollToSelector,
  SmoothScrollOptions 
} from './smoothScroll';

/**
 * React Hook for Smooth Scrolling
 * Provides smooth scrolling functionality with easy-to-use methods
 */
export const useSmoothScroll = () => {
  /**
   * Smooth scroll to a specific target
   */
  const scrollTo = useCallback((
    target: string | HTMLElement | number,
    options?: SmoothScrollOptions
  ) => {
    smoothScrollTo(target, options);
  }, []);

  /**
   * Smooth scroll to top of the page
   */
  const scrollToTop = useCallback((options?: SmoothScrollOptions) => {
    smoothScrollToTop(options);
  }, []);

  /**
   * Smooth scroll to a specific element by ID
   */
  const scrollToElement = useCallback((
    elementId: string,
    options?: SmoothScrollOptions
  ) => {
    smoothScrollToElement(elementId, options);
  }, []);

  /**
   * Smooth scroll to a specific element by selector
   */
  const scrollToSelector = useCallback((
    selector: string,
    options?: SmoothScrollOptions
  ) => {
    smoothScrollToSelector(selector, options);
  }, []);

  /**
   * Smooth scroll to a specific section
   */
  const scrollToSection = useCallback((
    sectionName: string,
    options?: SmoothScrollOptions
  ) => {
    const section = document.querySelector(`[data-section="${sectionName}"]`);
    if (section) {
      smoothScrollTo(section, options);
    }
  }, []);

  /**
   * Smooth scroll with offset (useful for fixed headers)
   */
  const scrollToWithOffset = useCallback((
    target: string | HTMLElement | number,
    offset: number = 80,
    options?: Omit<SmoothScrollOptions, 'offset'>
  ) => {
    smoothScrollTo(target, { ...options, offset });
  }, []);

  return {
    scrollTo,
    scrollToTop,
    scrollToElement,
    scrollToSelector,
    scrollToSection,
    scrollToWithOffset,
  };
};
