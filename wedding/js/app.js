/* ── App ── */
function App() {
  useEffect(() => {
    // Lenis smooth scroll
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    }
  }, []);

  return (
    <div style={{ background: '#f8f5f0' }}>
      <ScrollProgress />
      <DotNav />
      <Nav />
      <MonogramHero />
      <Invitation />
      <OrderOfEvents />
      <Venue />
      <OurStory />
      <FAQs />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('wedding-root'));
root.render(<App />);
