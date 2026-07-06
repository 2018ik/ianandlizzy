/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

const { useState, useEffect, useRef, useCallback } = React;

/* ── Lenis smooth scroll — single scroll source ──
   One Lenis instance runs one requestAnimationFrame loop and emits a single
   'scroll' event per frame. Every scroll-reactive effect subscribes through
   onLenisScroll / useLenis instead of registering its own window 'scroll'
   listener, so the whole page reacts off one consolidated source. Lenis scrolls
   the real document, so window.scrollY and getBoundingClientRect stay accurate.

   No velocity/parallax work is added here, and smooth scrolling is disabled —
   this is purely listener consolidation. Lenis passes native scroll through
   untouched (zero feel change) while giving us one scroll event source, so
   per-frame cost matches the previous rAF-throttled handlers. */
let _lenisResolved = false;
let _lenisInstance = null;
function getLenis() {
  if (_lenisResolved) return _lenisInstance;
  _lenisResolved = true;
  if (typeof Lenis === 'undefined') return null; // CDN failed → native fallback
  _lenisInstance = new Lenis({ smoothWheel: false, smoothTouch: false });
  const raf = (time) => {
    _lenisInstance.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return _lenisInstance;
}

/* Subscribe a callback to scroll. Returns an unsubscribe fn. Uses Lenis when
   available; otherwise falls back to the previous rAF-throttled native listener
   so behaviour is identical if the library ever fails to load. */
function onLenisScroll(callback) {
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', callback);
    return () => lenis.off('scroll', callback);
  }
  let raf = null;
  const handler = () => {
    if (raf == null) raf = requestAnimationFrame(() => { raf = null; callback(); });
  };
  window.addEventListener('scroll', handler, { passive: true });
  return () => {
    if (raf != null) cancelAnimationFrame(raf);
    window.removeEventListener('scroll', handler);
  };
}

/* Hook form: runs the callback once on mount, on every scroll frame, and on
   resize. */
function useLenis(callback, deps = []) {
  useEffect(() => {
    callback();
    const unsub = onLenisScroll(callback);
    const onResize = () => callback();
    window.addEventListener('resize', onResize);
    return () => {
      unsub();
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ── Intersection Observer for scroll reveals ── */
function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const threshold = options.threshold ?? 0.12;
  const rootMargin = options.rootMargin ?? '0px';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
}

/* ── Scroll progress (0-1) ── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useLenis(() => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(h > 0 ? window.scrollY / h : 0);
  });
  return progress;
}

/* ── Magnetic button ── */
function useMagnet(strength = 0.35) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'transform 0.1s ease';
    };
    const reset = () => {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', reset);
    };
  }, [strength]);
  return ref;
}

/* ── Pinned horizontal scroll (sticky wrapper + translateX) ── */
function usePinnedHScroll() {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const isMobile = () => window.innerWidth < 768;

    // How much vertical scroll the horizontal pass is stretched over. 1 = the
    // track moves 1:1 with scroll (original feel); higher = a longer pin so the
    // cards drift by more slowly and are easier to take in. Tune to taste.
    const SLOW = 2.5;

    const setHeight = () => {
      if (isMobile()) {
        wrapper.style.height = '';
        track.style.transform = '';
        return;
      }
      const shift = track.scrollWidth - window.innerWidth;
      wrapper.style.height = `${window.innerHeight + Math.max(0, shift) * SLOW}px`;
    };

    // Defer one frame so React has finished painting
    const rafId = requestAnimationFrame(setHeight);
    window.addEventListener('resize', setHeight);

    const onScroll = () => {
      if (isMobile()) return;
      const top = -wrapper.getBoundingClientRect().top;
      const max = wrapper.offsetHeight - window.innerHeight;
      const shift = track.scrollWidth - window.innerWidth;
      if (top <= 0) { track.style.transform = 'translateX(0)'; return; }
      if (top >= max) { track.style.transform = `translateX(${-shift}px)`; return; }
      // Spread the full horizontal shift over the (SLOW×) longer pin.
      track.style.transform = `translateX(${-(top / SLOW)}px)`;
    };

    const unsubScroll = onLenisScroll(onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setHeight);
      unsubScroll();
    };
  }, []);

  return [wrapperRef, trackRef];
}
