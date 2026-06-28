/* ── Registry ── */
function Registry() {
  const [textRef, textVisible] = useReveal({ threshold: 0.1 });
  const [cardRef, cardVisible] = useReveal({ threshold: 0.1 });

  return (
    <section id="registry" style={{
      background: 'transparent',
      padding: 'clamp(80px, 10vh, 120px) clamp(24px, 6vw, 80px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative photos flanking the content */}
      <img src="images/engagement10.jpg" alt="" aria-hidden="true" className="side-photo"
           style={{ left: 'clamp(8px, 3vw, 60px)', top: '14%' }} />
      <img src="images/engagement11.jpg" alt="" aria-hidden="true" className="side-photo"
           style={{ right: 'clamp(8px, 3vw, 60px)', bottom: '12%' }} />

      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Text block */}
        <div ref={textRef} style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: '32px' }}>Registry</span>

          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(24px, 3.2vw, 40px)',
            color: '#6b2d3e',
            lineHeight: 1.45,
            margin: '0 auto 52px',
            maxWidth: '36rem',
            letterSpacing: '-0.01em',
          }}>
            Your presence is enough of a gift for us! But for those who still want to help out, you can contribute to this fund:
          </p>

          <div style={{ width: '40px', height: '1px', background: '#b0a898', margin: '0 auto 64px' }} />
        </div>

        {/* Product card */}
        <div ref={cardRef} style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: 'clamp(32px, 4vw, 56px)',
            boxShadow: '0 2px 48px rgba(26,23,20,0.07)',
            maxWidth: '460px',
            width: '100%',
          }}>
            <img
              src="images/avp.png"
              alt="Apple Vision Pro"
              style={{
                display: 'block',
                width: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: "'Fragment Mono', monospace",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#6b2d3e',
            }}>Apple Vision Pro</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '15px',
              color: '#b0a898',
              letterSpacing: '0.02em',
            }}>$3,499.00</span>
          </div>
        </div>

      </div>
    </section>
  );
}
