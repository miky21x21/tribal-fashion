# Smooth Scrolling Implementation

This document explains how smooth scrolling has been implemented in the KINIR tribal fashion website and how to use it.

## Overview

Smooth scrolling provides a polished user experience by animating page scrolling instead of jumping instantly to the target location. The implementation includes both CSS and JavaScript fallbacks for maximum browser compatibility.

## Features

- ✅ **CSS-based smooth scrolling** for modern browsers
- ✅ **JavaScript fallback** for older browsers
- ✅ **Customizable duration and easing** functions
- ✅ **Offset support** for fixed headers
- ✅ **React hooks** for easy integration
- ✅ **Automatic anchor link handling**
- ✅ **Scroll to top button**

## Implementation Details

### 1. CSS Smooth Scrolling

The base smooth scrolling is implemented in `src/app/globals.css`:

```css
html {
  scroll-behavior: smooth;
}

* {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

### 2. JavaScript Utilities

Located in `src/utils/smoothScroll.ts`, providing:

- `smoothScrollTo()` - Main scrolling function
- `smoothScrollToTop()` - Scroll to top of page
- `smoothScrollToElement()` - Scroll to element by ID
- `smoothScrollToSelector()` - Scroll to element by selector
- `enableSmoothScrollingForAnchors()` - Enable smooth scrolling for anchor links

### 3. React Hook

Located in `src/utils/useSmoothScroll.ts`, providing easy-to-use methods:

```typescript
const {
  scrollTo,
  scrollToTop,
  scrollToElement,
  scrollToSelector,
  scrollToSection,
  scrollToWithOffset,
} = useSmoothScroll();
```

## Usage Examples

### Basic Usage

```typescript
import { useSmoothScroll } from '@/utils/useSmoothScroll';

const MyComponent = () => {
  const { scrollToTop, scrollToElement } = useSmoothScroll();

  const handleScrollToTop = () => {
    scrollToTop({ duration: 800, easing: 'easeInOut' });
  };

  const handleScrollToSection = () => {
    scrollToElement('about-section', { duration: 600, easing: 'easeOut' });
  };

  return (
    <div>
      <button onClick={handleScrollToTop}>Scroll to Top</button>
      <button onClick={handleScrollToSection}>Go to About</button>
    </div>
  );
};
```

### Advanced Usage with Options

```typescript
const { scrollToWithOffset } = useSmoothScroll();

// Scroll to element with 80px offset (useful for fixed headers)
scrollToWithOffset('#section-id', 80, {
  duration: 1000,
  easing: 'easeInOut'
});
```

### Easing Functions

Available easing options:
- `'easeInOut'` (default) - Smooth acceleration and deceleration
- `'easeIn'` - Gradual acceleration
- `'easeOut'` - Gradual deceleration
- `'linear'` - Constant speed

### Duration

Customize scroll duration in milliseconds:
- Fast: 300-500ms
- Medium: 600-800ms (default)
- Slow: 900-1200ms

## Components

### SmoothScrollInitializer

Automatically initializes smooth scrolling functionality. Added to the root layout.

### ScrollToTop

A floating button that appears when scrolling down and smoothly scrolls to top when clicked.

### SmoothScrollDemo

Demonstrates various smooth scrolling functionality (can be used for testing).

## Browser Support

- **Modern browsers**: Use CSS `scroll-behavior: smooth`
- **Older browsers**: Fall back to JavaScript implementation
- **Reduced motion**: Respects user preferences for reduced motion

## Performance Considerations

- Uses `requestAnimationFrame` for smooth animations
- Passive event listeners for scroll events
- Efficient easing calculations
- Minimal DOM queries

## Customization

### Adding Custom Easing Functions

```typescript
// In smoothScroll.ts
const customEasing = (t: number): number => {
  // Your custom easing function
  return t * t * (3 - 2 * t);
};

// Add to getEasingFunction switch statement
case 'custom': return customEasing;
```

### Modifying Default Values

```typescript
// In smoothScroll.ts
const defaultOptions: SmoothScrollOptions = {
  duration: 1000, // Change default duration
  easing: 'easeOut', // Change default easing
  offset: 100 // Change default offset
};
```

## Troubleshooting

### Smooth Scrolling Not Working

1. Check if `SmoothScrollInitializer` is imported in layout
2. Verify CSS is loaded properly
3. Check browser console for errors
4. Ensure target elements exist in DOM

### Performance Issues

1. Reduce scroll duration
2. Use simpler easing functions
3. Check for heavy DOM operations during scroll
4. Verify passive event listeners are used

## Best Practices

1. **Use appropriate durations**: 600-800ms for most cases
2. **Respect user preferences**: Check `prefers-reduced-motion`
3. **Provide visual feedback**: Show loading states during scroll
4. **Test on various devices**: Ensure smooth performance on mobile
5. **Use offsets for fixed headers**: Prevent content from being hidden

## Future Enhancements

- [ ] Add scroll progress indicators
- [ ] Implement scroll-triggered animations
- [ ] Add scroll history management
- [ ] Support for horizontal scrolling
- [ ] Custom scroll containers (not just window)

## Contributing

When adding new smooth scrolling features:

1. Update this documentation
2. Add TypeScript types
3. Include fallbacks for older browsers
4. Test on multiple devices
5. Follow existing code patterns
