/* ── Footer ── */
function Footer() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  return (
    <footer ref={ref}
            className={`reveal ${visible ? 'visible' : ''}`}
            style={{
              background: '#f8f5f0',
              borderTop: '1px solid #e0d8ce',
              padding: 'clamp(48px,6vh,72px) clamp(24px,6vw,80px)',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '24px',
            }}>
      {/* Left */}
      <div>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 4vw, 44px)',
          color: '#1a1714',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>Ian &amp; Lizzy</p>
      </div>

      {/* Center: watermark monogram */}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontStyle: 'italic',
        fontSize: 'clamp(60px, 10vw, 100px)',
        color: '#1a1714',
        opacity: 0.07,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        userSelect: 'none',
      }}>IL</div>

      {/* Right */}
      <div style={{ textAlign: 'right' }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 300,
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: '#7a7068',
          margin: '0 0 4px 0',
          textTransform: 'uppercase',
        }}>October 11, 2026</p>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 300,
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: '#b0a898',
          margin: 0,
          textTransform: 'uppercase',
        }}>Washington, D.C.</p>
      </div>
    </footer>
  );
}
