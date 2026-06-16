/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

const { useState, useEffect, useRef, useCallback } = React;

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
  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? window.scrollY / h : 0);
        ticking = false;
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
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

    const setHeight = () => {
      if (isMobile()) {
        wrapper.style.height = '';
        track.style.transform = '';
        return;
      }
      const shift = track.scrollWidth - window.innerWidth;
      wrapper.style.height = `${window.innerHeight + Math.max(0, shift)}px`;
    };

    // Defer one frame so React has finished painting
    const rafId = requestAnimationFrame(setHeight);
    window.addEventListener('resize', setHeight);

    const onScroll = () => {
      if (isMobile()) return;
      const top = -wrapper.getBoundingClientRect().top;
      const max = wrapper.offsetHeight - window.innerHeight;
      if (top <= 0) { track.style.transform = 'translateX(0)'; return; }
      if (top >= max) { track.style.transform = `translateX(${-(track.scrollWidth - window.innerWidth)}px)`; return; }
      track.style.transform = `translateX(${-top}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setHeight);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return [wrapperRef, trackRef];
}
