/* ── Footer ── */
function Footer() {
  const content = useContent();
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
          color: '#6b2d3e',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>{content.footer.names}</p>
      </div>

      {/* Center: watermark monogram */}
      <img className="footer-calla-lily" src="images/calla-lily.png" style={{width:"90px", color:"#7a7068"}}/>

      {/* Right */}
      <div style={{ textAlign: 'right' }}>
        <p style={{
          fontFamily: "'Fragment Mono', monospace",
          fontWeight: 300,
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: '#7a7068',
          margin: '0 0 4px 0',
          textTransform: 'uppercase',
        }}>{content.footer.dateLabel}</p>
        <p style={{
          fontFamily: "'Fragment Mono', monospace",
          fontWeight: 300,
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: '#b0a898',
          margin: 0,
          textTransform: 'uppercase',
        }}>{content.footer.location}</p>
      </div>
    </footer>
  );
}
