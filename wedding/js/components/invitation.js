/* ── Invitation ── */
function Invitation() {
  const content = useContent();
  const inv = content.invitation;
  const [photoRef, photoVisible] = useReveal({ threshold: 0.08 });
  const [cardRef, cardVisible] = useReveal({ threshold: 0.12 });

  return (
    <section id="invitation" className="limewash-bg">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        {/* Left half: engagement2 centered on the limewash texture */}
        <div ref={photoRef} style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          backgroundImage: 'url(images/limewash_pink.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div style={{
            width: '100%',
            display:'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            clipPath: photoVisible ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
            transition: 'clip-path 1.3s cubic-bezier(0.76, 0, 0.24, 1)',
          }}>
            <img
              src="images/engagement2.jpg"
              alt="Ian and Lizzy"
              className="editorial-photo"
              style={{
                display: 'block',
                width: '70%',
                aspectRatio: '3/4',
                objectFit: 'cover',
                objectPosition: 'center top',
                border: '6px solid #B3841A',
              }}
            />
          </div>
        </div>

        {/* Right half: sticky text, then photo scrolls past */}
        <div>

          {/* Panel 1 — sticky invitation text */}
          <div style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            zIndex: 1,
            background: '#d6b8bc',
            padding: '0 clamp(32px, 5vw, 72px)',
          }}>
            <div ref={cardRef} style={{
              width: '100%',
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
            }}>

              {/* Eyebrow */}
              <span className="eyebrow" style={{ color: '#fff3ddff', display: 'block', marginBottom: '32px' }}>{inv.eyebrow}</span>

              {/* Venue name */}
              <h2 style={{
                fontFamily: "'Pinyon Script', cursive",
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: 'clamp(52px, 7vw, 90px)',
                color: '#6b2d3e',
                lineHeight: 1.0,
                margin: '0 0 32px 0',
                letterSpacing: '-0.02em',
              }}>
                {inv.venueName.map((line, i) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </h2>

              {/* Thin rule */}
              <div style={{ width: '40px', height: '1px', background: '#fff3ddff', marginBottom: '32px' }} />

              {/* Address */}
              <p style={{
                fontFamily: "'Fragment Mono', monospace",
                fontWeight: 300,
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#fff3ddff',
                margin: '0 0 8px 0',
                lineHeight: 1.8,
              }}>
                {inv.addressLines.map((line, i) => (
                  <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>
                ))}
              </p>

              {/* Date */}
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 2.2vw, 26px)',
                color: '#6b2d3e',
                margin: '28px 0 8px 0',
              }}>
                {inv.date}
              </p>

              {/* Time + dress code */}
              <span style={{
                fontFamily: "'Fragment Mono', monospace",
                fontWeight: 300,
                fontSize: '10px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#fff3ddff',
              }}>{inv.timeAndDressCode}</span>

            </div>
          </div>

          {/* Panel 2 — photo scrolls up past the stuck text, pushed to the right */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            paddingBottom: 'clamp(80px, 100vh, 800px)',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 'clamp(32px, 5vw, 72px)',
          }}>
            <img
              src="images/engagement3.jpg"
              alt="Ian and Lizzy"
              className="editorial-photo"
              style={{
                display: 'block',
                width: '50%',
                aspectRatio: '4/3',
                objectFit: 'cover',
                borderRadius: '2px',
                border: '6px solid #B3841A',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
