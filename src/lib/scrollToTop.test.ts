import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  scrollToTopFastSmooth,
  cancelFastSmoothScroll,
  isFastSmoothScrolling,
} from './scrollToTop';

describe('scrollToTopFastSmooth', () => {
  let scrollY = 0;
  let rafCallbacks: ((time: number) => void)[] = [];
  let rafId = 0;
  const originalWindow = globalThis.window;

  beforeEach(() => {
    scrollY = 0;
    rafCallbacks = [];
    rafId = 0;

    const mockEventTarget = new EventTarget();

    const mockWindow: any = {
      get scrollY() {
        return scrollY;
      },
      set scrollY(val: number) {
        scrollY = val;
      },
      scrollTo: vi.fn((x: number | ScrollToOptions, y?: number) => {
        if (typeof x === 'object') {
          scrollY = x.top ?? 0;
        } else {
          scrollY = y ?? 0;
        }
      }),
      requestAnimationFrame: vi.fn((cb: FrameRequestCallback) => {
        rafId++;
        rafCallbacks.push(cb);
        return rafId;
      }),
      cancelAnimationFrame: vi.fn((_id: number) => {
        rafCallbacks = [];
      }),
      matchMedia: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
      addEventListener: mockEventTarget.addEventListener.bind(mockEventTarget),
      removeEventListener: mockEventTarget.removeEventListener.bind(mockEventTarget),
      dispatchEvent: mockEventTarget.dispatchEvent.bind(mockEventTarget),
    };

    const mockDocument: any = {
      documentElement: {
        scrollTop: 0,
        style: {
          scrollBehavior: 'smooth',
        },
      },
      body: {
        scrollTop: 0,
      },
    };

    globalThis.window = mockWindow;
    globalThis.document = mockDocument;
  });

  afterEach(() => {
    cancelFastSmoothScroll();
    globalThis.window = originalWindow;
    vi.restoreAllMocks();
  });

  it('does nothing if already at target position 0', () => {
    scrollY = 0;
    const onComplete = vi.fn();
    scrollToTopFastSmooth({ onComplete });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(onComplete).toHaveBeenCalled();
    expect(isFastSmoothScrolling()).toBe(false);
  });

  it('initiates smooth scrolling when scrollY > 0', () => {
    scrollY = 1200;
    const onComplete = vi.fn();
    scrollToTopFastSmooth({ duration: 300, onComplete });

    expect(isFastSmoothScrolling()).toBe(true);
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    // Trigger RAF frame 1 (halfway)
    const cb1 = rafCallbacks.shift();
    expect(cb1).toBeDefined();
    cb1!(performance.now() + 150);

    // scrollY should have decreased
    expect(scrollY).toBeLessThan(1200);
    expect(scrollY).toBeGreaterThan(0);

    // Trigger RAF frame 2 (completion)
    const cb2 = rafCallbacks.shift();
    expect(cb2).toBeDefined();
    cb2!(performance.now() + 350);

    expect(scrollY).toBe(0);
    expect(onComplete).toHaveBeenCalled();
    expect(isFastSmoothScrolling()).toBe(false);
  });

  it('respects prefers-reduced-motion: reduce', () => {
    scrollY = 1500;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const onComplete = vi.fn();
    scrollToTopFastSmooth({ onComplete });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(scrollY).toBe(0);
    expect(onComplete).toHaveBeenCalled();
    expect(isFastSmoothScrolling()).toBe(false);
  });

  it('cancels scroll on user interaction', () => {
    scrollY = 1000;
    scrollToTopFastSmooth({ duration: 300 });

    expect(isFastSmoothScrolling()).toBe(true);

    // Simulate wheel event
    window.dispatchEvent(new Event('wheel'));

    expect(isFastSmoothScrolling()).toBe(false);
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });
});
