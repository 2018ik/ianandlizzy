/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */

const { useState, useEffect, useRef, useCallback } = React;

/* ── Intersection Observer for scroll reveals ── */
function useReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: options.threshold || 0.12, rootMargin: options.rootMargin || '0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Scroll progress (0-1) ── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
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

/* ── Horizontal scroll (converts wheel Y → scrollLeft) ── */
function useHorizontalScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e) => {
      if (window.innerWidth < 768) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 1.5;
    };
    // Drag-to-scroll
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const mouseDown = (e) => {
      isDown = true;
      el.classList.add('is-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const mouseUp = () => { isDown = false; el.classList.remove('is-grabbing'); };
    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };
    el.addEventListener('wheel', handler, { passive: false });
    el.addEventListener('mousedown', mouseDown);
    el.addEventListener('mouseup', mouseUp);
    el.addEventListener('mouseleave', mouseUp);
    el.addEventListener('mousemove', mouseMove);
    return () => {
      el.removeEventListener('wheel', handler);
      el.removeEventListener('mousedown', mouseDown);
      el.removeEventListener('mouseup', mouseUp);
      el.removeEventListener('mouseleave', mouseUp);
      el.removeEventListener('mousemove', mouseMove);
    };
  }, []);
  return ref;
}
