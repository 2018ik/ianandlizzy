/* ── App ── */
function App() {
  const [content, setContent] = useState(loadCachedContent);

  useEffect(() => {
    // Lenis smooth scroll — only needed once there's a scrollable page.
    if (!content) return;
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    }
  }, [content]);

  // Scroll-driven background for the schedule/story/registry block. The gradient
  // layer is fixed to the viewport (background-attachment: fixed) so it doesn't
  // scroll, and we recolor it as the section passes — the base color morphs from
  // the invitation pink to the footer champagne. We keep the layer near-uniform
  // (one base color + faint fixed blooms) so the top seam never shows a mismatch.
  const gradientRef = useRef(null);
  useEffect(() => {
    if (!content) return;
    const el = gradientRef.current;
    if (!el) return;

    const START = [214, 184, 188]; // #d6b8bc — invitation pink
    const END   = [248, 245, 240]; // #f8f5f0 — footer champagne
    const lerp = (a, b, t) => Math.round(a + (b - a) * t);
    const mix = (t) => `rgb(${lerp(START[0], END[0], t)}, ${lerp(START[1], END[1], t)}, ${lerp(START[2], END[2], t)})`;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
      el.style.backgroundColor = mix(p);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
        <div ref={gradientRef} style={{
          backgroundColor: '#d6b8bc',
          // Faint blooms, fixed to the viewport so they don't scroll. Kept low
          // opacity and pushed toward the lower half so they never tint the top
          // seam. The base color underneath is recolored on scroll (see effect).
          backgroundImage: `
            radial-gradient(60% 50% at 82% 80%, rgba(243, 222, 165, 0.16), transparent),
            radial-gradient(55% 45% at 12% 92%, rgba(214, 195, 197, 0.14), transparent)
          `,
          backgroundAttachment: 'fixed',
        }}>
          <OrderOfEvents />
          <OurStory />
          <Registry />
        </div>
        <FAQs />
        <RSVP />
        <Footer />
      </div>
    </WeddingContentContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('wedding-root'));
root.render(<App />);
