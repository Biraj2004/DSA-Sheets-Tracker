/**
 * Smooth, snappy scroll-to-top utility with dynamic duration (180ms - 360ms)
 * and quartic ease-out curve.
 * 
 * Prevents sluggish native browser smooth scrolling while ensuring 60fps/120fps
 * responsiveness across all viewports and devices.
 */

export interface ScrollToTopOptions {
  /** Target vertical scroll position (default: 0) */
  top?: number;
  /** Explicit duration in ms (if omitted, dynamically computed based on distance) */
  duration?: number;
  /** Callback fired once scrolling reaches target */
  onComplete?: () => void;
  /** Force animation even if prefers-reduced-motion is active (default: false) */
  force?: boolean;
}

interface ActiveScrollState {
  animationId: number;
  targetTop: number;
  cleanup: () => void;
}

let activeScroll: ActiveScrollState | null = null;

/**
 * Returns true if a fast smooth scroll animation is currently in progress.
 */
export function isFastSmoothScrolling(): boolean {
  return activeScroll !== null;
}

/**
 * Cancels any active fast smooth scroll animation immediately.
 */
export function cancelFastSmoothScroll(): void {
  if (activeScroll) {
    if (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(activeScroll.animationId);
    }
    activeScroll.cleanup();
    activeScroll = null;
  }
}

/**
 * Scrolls the window to the top (or specified target) smoothly and quickly.
 */
export function scrollToTopFastSmooth(options: ScrollToTopOptions = {}): void {
  if (typeof window === 'undefined') return;

  const targetTop = options.top ?? 0;
  const startY = window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
  const distance = Math.abs(startY - targetTop);

  // If already at or within 1px of target, jump clean and finish
  if (distance <= 1) {
    cancelFastSmoothScroll();
    window.scrollTo(0, targetTop);
    options.onComplete?.();
    return;
  }

  // If an animation is already running towards the exact same target, let it continue
  if (activeScroll && activeScroll.targetTop === targetTop) {
    return;
  }

  // Cancel any existing animation with a different target
  cancelFastSmoothScroll();

  // Respect user's OS preference for reduced motion
  if (
    !options.force &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.scrollTo(0, targetTop);
    options.onComplete?.();
    return;
  }

  // Dynamic duration: snappy ~180ms for short scrolls, up to 360ms for huge distances
  const duration =
    options.duration ??
    Math.min(360, Math.max(180, Math.round(Math.sqrt(distance) * 8.5)));

  const html = document.documentElement;
  const prevScrollBehavior = html?.style?.scrollBehavior;
  // Disable CSS scroll-behavior: smooth during JS frame animation to prevent frame conflicts
  if (html?.style) {
    html.style.scrollBehavior = 'auto';
  }

  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  // Quartic ease-out: responsive initial velocity with buttery soft landing
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  const cleanup = () => {
    if (html?.style && prevScrollBehavior !== undefined) {
      html.style.scrollBehavior = prevScrollBehavior;
    }
    window.removeEventListener('wheel', cancelOnUserInteraction, passiveOptions);
    window.removeEventListener('touchmove', cancelOnUserInteraction, passiveOptions);
    window.removeEventListener('pointerdown', cancelOnUserInteraction, passiveOptions);
    window.removeEventListener('keydown', cancelOnKeyDown);
  };

  const cancelOnUserInteraction = () => {
    cancelFastSmoothScroll();
  };

  const cancelOnKeyDown = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
      cancelOnUserInteraction();
    }
  };

  const passiveOptions: AddEventListenerOptions = { passive: true };
  window.addEventListener('wheel', cancelOnUserInteraction, passiveOptions);
  window.addEventListener('touchmove', cancelOnUserInteraction, passiveOptions);
  window.addEventListener('pointerdown', cancelOnUserInteraction, passiveOptions);
  window.addEventListener('keydown', cancelOnKeyDown);

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const currentY = startY + (targetTop - startY) * easedProgress;

    window.scrollTo(0, currentY);

    if (progress < 1) {
      if (activeScroll) {
        activeScroll.animationId = window.requestAnimationFrame(step);
      }
    } else {
      window.scrollTo(0, targetTop);
      const onComplete = options.onComplete;
      cancelFastSmoothScroll();
      onComplete?.();
    }
  };

  activeScroll = {
    animationId: window.requestAnimationFrame(step),
    targetTop,
    cleanup,
  };
}
