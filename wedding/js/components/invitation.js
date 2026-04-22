/* ── Invitation ── */
function Invitation() {
  const [photoRef, photoVisible] = useReveal({ threshold: 0.08 });
  const [cardRef, cardVisible] = useReveal({ threshold: 0.12 });
  const photoElRef = useRef(null);

  // Slow parallax on sticky photo
  useEffect(() => {
    const el = photoElRef.current;
    if (!el) return;
    const onScroll = () => {
      const section = el.closest('#invitation');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      el.style.transform = `translateY(${progress * -60}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="invitation" style={{ background: '#f8f5f0' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 clamp(24px, 5vw, 64px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 100px)' }}
             className="invitation-grid">

          {/* Left: sticky photo with parallax */}
          <div ref={photoRef} style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '100%',
              overflow: 'hidden',
              clipPath: photoVisible ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
              transition: 'clip-path 1.3s cubic-bezier(0.76, 0, 0.24, 1)',
            }}>
              <img
                ref={photoElRef}
                src="images/1.webp"
                alt="Ian and Lizzy"
                className="editorial-photo"
                style={{
                  display: 'block',
                  width: '100%',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  willChange: 'transform',
                }}
              />
            </div>
          </div>

          {/* Right: scrolling panels */}
          <div>

            {/* Panel 1 — invitation details */}
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 'clamp(60px, 8vh, 100px) 0' }}>
              <div ref={cardRef} style={{
                width: '100%',
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? 'translateY(0)' : 'translateY(28px)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
              }}>

                {/* Eyebrow */}
                <span className="eyebrow" style={{ display: 'block', marginBottom: '32px' }}>You're Invited</span>

                {/* Venue name */}
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 'clamp(40px, 5.5vw, 72px)',
                  color: '#1a1714',
                  lineHeight: 1.0,
                  margin: '0 0 32px 0',
                  letterSpacing: '-0.02em',
                }}>
                  DAR<br />Headquarters
                </h2>

                {/* Thin rule */}
                <div style={{ width: '40px', height: '1px', background: '#b0a898', marginBottom: '32px' }} />

                {/* Address */}
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 300,
                  fontSize: '12px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#7a7068',
                  margin: '0 0 8px 0',
                  lineHeight: 1.8,
                }}>
                  1776 D Street NW<br />Washington, DC 20006
                </p>

                {/* Date */}
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 'clamp(20px, 2.2vw, 26px)',
                  color: '#1a1714',
                  margin: '28px 0 8px 0',
                }}>
                  October 11, 2026
                </p>

                {/* Time + dress code */}
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 300,
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#b0a898',
                }}>4:00 PM · Black Tie Optional</span>

              </div>
            </div>

            {/* Panel 2 — second photo */}
            <div style={{
              padding: 'clamp(16px, 2vh, 28px) 0 clamp(80px, 12vh, 140px)',
            }}>
              <div className="photo-placeholder editorial-photo"
                   style={{ width: '100%', aspectRatio: '4/3', borderRadius: '2px' }} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
