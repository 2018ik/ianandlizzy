/* ── Registry ── */
const REGISTRY_URL = 'https://www.amazon.com/registries/gl/guest-view/2Z3F40FB313SJ?ref_=cm_sw_r_cp_ud_ggr-subnav-share_Y06GAP15F03CVBJGNNQX';

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
      <div className="registry-layout">
        <div className="registry-copy">

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
              margin: '0 0 44px',
              maxWidth: '36rem',
              letterSpacing: '-0.01em',
            }}>
              Your presence is a gift to us! If you would still like to help us begin this next chapter, we have put together a registry.
            </p>

            <div style={{ width: '40px', height: '1px', background: '#b0a898', margin: '0 0 54px' }} />
          </div>

          {/* Registry link */}
          <a ref={cardRef}
             href={REGISTRY_URL}
             target="_blank"
             rel="noopener noreferrer"
             style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            textDecoration: 'none',
            color: 'inherit',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}>
            <span className="registry-link-label" style={{
              fontFamily: "'Fragment Mono', monospace",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}>View on Amazon →</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '15px',
              color: '#b0a898',
              letterSpacing: '0.02em',
            }}>Opens Amazon in a new tab</span>
          </a>
        </div>

        <div className="registry-photo-wrap" aria-hidden="true">
          <img
            src="images/engagement12.jpg"
            alt=""
            className="registry-feature-photo"
          />
        </div>
      </div>
    </section>
  );
}
