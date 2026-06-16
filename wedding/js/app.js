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
        <OrderOfEvents />
        <OurStory />
        <Registry />
        <FAQs />
        <Footer />
      </div>
    </WeddingContentContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('wedding-root'));
root.render(<App />);
