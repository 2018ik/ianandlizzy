/* ── App ── */
function App() {
  const [content, setContent] = useState(loadCachedContent);

  useEffect(() => {
    const isImageTarget = (target) => target && target.closest && target.closest('img');
    const preventImageDrag = (event) => {
      if (isImageTarget(event.target)) event.preventDefault();
    };
    const preventImageMenu = (event) => {
      if (isImageTarget(event.target)) event.preventDefault();
    };

    document.addEventListener('dragstart', preventImageDrag);
    document.addEventListener('contextmenu', preventImageMenu);
    return () => {
      document.removeEventListener('dragstart', preventImageDrag);
      document.removeEventListener('contextmenu', preventImageMenu);
    };
  }, []);

  // Scroll-driven background for the schedule/story/registry block. We measure
  // the tall wrapper but recolor a separate STICKY layer (bgLayerRef) that holds
  // the background. Using a sticky, GPU-composited layer instead of
  // `background-attachment: fixed` gives the same fixed-feel without the
  // per-frame full-page repaint that makes fixed backgrounds janky (and that iOS
  // ignores entirely). The base colour morphs invitation pink -> footer champagne.
  const gradientRef = useRef(null);
  const bgLayerRef = useRef(null);
  useEffect(() => {
    if (!content) return;
    const wrapper = gradientRef.current;
    const layer = bgLayerRef.current;
    if (!wrapper || !layer) return;

    const START = [214, 184, 188]; // #d6b8bc — invitation pink
    const END   = [248, 245, 240]; // #f8f5f0 — footer champagne
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const mix = (t) => `rgb(${lerp(START[0], END[0], t)}, ${lerp(START[1], END[1], t)}, ${lerp(START[2], END[2], t)})`;

    const apply = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
      layer.style.backgroundColor = mix(p);
    };

    apply();
    const unsubScroll = onLenisScroll(apply);
    window.addEventListener('resize', apply);
    return () => {
      unsubScroll();
      window.removeEventListener('resize', apply);
    };
  }, [content]);

  // Cover/reveal: the FAQ is sticky so the RSVP block can slide up over it. We
  // pin the FAQ *bottom-to-bottom* by setting its sticky `top` to
  // min(0, viewportH − faqHeight): 0 when the FAQ fits on screen, negative when
  // it's taller (e.g. an accordion is open) so it still scrolls through fully
  // before pinning. Recomputed on resize and whenever the FAQ height changes.
  const faqStickyRef = useRef(null);
  useEffect(() => {
    if (!content) return;
    const el = faqStickyRef.current;
    if (!el) return;
    const update = () => {
      if (window.innerWidth < 768) { el.style.top = ''; return; } // desktop only
      el.style.top = Math.min(0, window.innerHeight - el.offsetHeight) + 'px';
    };
    update();
    window.addEventListener('resize', update);
    let ro = null;
    if ('ResizeObserver' in window) { ro = new ResizeObserver(update); ro.observe(el); }
    return () => {
      window.removeEventListener('resize', update);
      if (ro) ro.disconnect();
    };
  }, [content]);

  // Locked: show only the password gate (no informational text yet).
  if (!content) {
    return (
      <div style={{ background: '#f8f5f0' }}>
        <PasswordGate onUnlock={setContent} />
      </div>
    );
  }

  // Unlocked: provide content to every section and reveal with a soft fade.
  return (
    <WeddingContentContext.Provider value={content}>
      <div className="content-reveal" style={{ background: '#f8f5f0' }}>
        <ScrollProgress />
        <DotNav />
        <Nav />
        <MonogramHero />
        <Invitation />
        <div ref={gradientRef} style={{ position: 'relative' }}>
          {/* Sticky, GPU-composited background layer — stays in the viewport like
              a fixed background but without the scroll-repaint cost. The negative
              margin makes it occupy zero net layout height so the sections start
              at the top. Recolored on scroll by the effect above. */}
          <div ref={bgLayerRef} aria-hidden="true" style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            marginBottom: '-100vh',
            zIndex: 0,
            pointerEvents: 'none',
            backgroundColor: '#d6b8bc',
            backgroundImage: `
              radial-gradient(60% 50% at 82% 80%, rgba(243, 222, 165, 0.16), transparent),
              radial-gradient(55% 45% at 12% 92%, rgba(214, 195, 197, 0.14), transparent)
            `,
            willChange: 'transform',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <OrderOfEvents />
            <OurStory />
            <Registry />
          </div>
        </div>
        {/* Cover/reveal: the FAQ pins and the maroon RSVP block slides up over
            it to cover it as you scroll (reverses on scroll-up). Desktop only —
            see the .cover-* rules + the sticky-offset effect above. */}
        <div className="cover-stack">
          <div className="cover-faq" ref={faqStickyRef}>
            <FAQs />
          </div>
          <RSVP />
          <Footer />
        </div>
      </div>
    </WeddingContentContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('wedding-root'));
root.render(<App />);
