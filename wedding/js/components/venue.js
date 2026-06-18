/* ── Venue ── */
function Venue() {
  const content = useContent();
  const v = content.venue;
  const [textRef, textVisible] = useReveal({ threshold: 0.1 });
  const [photoRef, photoVisible] = useReveal({ threshold: 0.05 });
  const magnetRef = useMagnet(0.3);

  return (
    <section id="venue" style={{ background: '#f8f5f0', overflow: 'hidden', minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', minHeight: '100vh' }}
           className="md:grid grid-cols-1">

        {/* Left text column */}
        <div ref={textRef}
             className={`reveal ${textVisible ? 'visible' : ''}`}
             style={{
               padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,80px)',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               borderRight: '1px solid #e0d8ce',
             }}>
          <span className="eyebrow" style={{ marginBottom: '28px' }}>{v.eyebrow}</span>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(36px, 5vw, 60px)',
            color: '#6b2d3e',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 28px 0',
          }}>
            {v.venueName.map((line, i) => (
              <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
            ))}
          </h2>

          <div style={{
            width: '40px',
            height: '1px',
            background: '#b0a898',
            margin: '0 0 28px 0',
          }} />

          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '13px',
            letterSpacing: '0.08em',
            color: '#7a7068',
            lineHeight: 1.7,
            marginBottom: '8px',
          }}>
            {v.addressLines.map((line, i) => (
              <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
            ))}
          </p>

          <div style={{ marginTop: '48px' }}>
            <a ref={magnetRef}
               href={v.directionsUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="magnetic-btn">
              {v.directionsLabel}
            </a>
          </div>

          {/* Portrait placeholder */}
          <div className="photo-placeholder-light"
               style={{ borderRadius: '2px', aspectRatio: '5/6', marginTop: '48px', overflow: 'hidden' }} />
        </div>

        {/* Right: full-height photo */}
        <div ref={photoRef}
             className={`clip-reveal ${photoVisible ? 'visible' : ''}`}
             style={{ transitionDelay: '0.15s' }}>
          <div className="photo-placeholder"
               style={{ height: '100%', minHeight: '600px' }} />
        </div>
      </div>
    </section>
  );
}
