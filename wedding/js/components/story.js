/* ── Story Entry (extracted so hooks work correctly) ── */
function StoryEntry({ s, i }) {
  const [entryRef, entryVisible] = useReveal({ threshold: 0.12 });
  const isLeft = i % 2 === 0;
  return (
    <div ref={entryRef}
         style={{
           gridColumn: isLeft ? 1 : 2,
         }}>
      <div className={`story-entry clip-reveal-v ${entryVisible ? 'visible' : ''}`}
           style={{
             padding: 'clamp(16px, 2vh, 28px) 0',
             borderTop: 'none',
             transitionDelay: `${(i % 2) * 0.1}s`,
           }}>
        <div className="story-watermark">{s.year}</div>
        <span className="eyebrow" style={{ marginBottom: '8px' }}>Chapter {s.chapter}</span>
        <span style={{
          fontFamily: "'Fragment Mono', monospace",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          color: '#b0a898',
        }}>{s.year}</span>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400,
          fontSize: 'clamp(12px, 1.3vw, 15px)',
          color: '#6b2d3e',
          lineHeight: 1.7,
          margin: '12px 0 10px 0',
        }}>
          {s.body}
        </p>
      </div>
    </div>
  );
}

/* ── Our Story ── */
function OurStory() {
  const content = useContent();
  const [titleRef, titleVisible] = useReveal({ threshold: 0.2 });
  const [galleryRef, galleryVisible] = useReveal({ threshold: 0.05 });

  const stories = content.story.entries;

  return (
    <section id="story" style={{
      background: '#f8f5f0',
      padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,80px)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>

      <h2 ref={titleRef}
          className={`reveal ${titleVisible ? 'visible' : ''}`}
          style={{
            fontFamily: "'Pinyon Script', cursive",
            fontWeight: 400,
            fontStyle: 'normal',
            fontSize: 'clamp(64px, 9vw, 120px)',
            color: '#6b2d3e',
            lineHeight: 0.9,
            letterSpacing: '0em',
            marginBottom: 0,
          }}>
        {content.story.title}
      </h2>

      <div style={{ maxWidth: '34rem', marginLeft: 'auto', marginTop: 'auto' }}>
        {/* Alternating two-column timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 36px' }}
             className="story-grid">
          {stories.map((s, i) => (
            <StoryEntry key={s.year} s={s} i={i} />
          ))}
        </div>
      </div>

      {/* Photo gallery — full-width, original sizing */}
      <div style={{ maxWidth: '64rem', margin: '0 auto', width: '100%' }}>
        <div ref={galleryRef}
             className={`reveal ${galleryVisible ? 'visible' : ''}`}
             style={{
               marginTop: 'clamp(48px, 6vh, 80px)',
               display: 'flex',
               gap: '12px',
               alignItems: 'flex-start',
             }}>
          {['engagement4', 'engagement8', 'engagement7', 'engagement5'].map((name, i) => (
            <img
              key={name}
              src={`images/${name}.jpg`}
              alt="Ian and Lizzy"
              className="masonry-photo"
              style={{
                flex: '1',
                width: '0',
                aspectRatio: '3/4',
                objectFit: 'cover',
                marginTop: i % 2 === 0 ? '0' : 'clamp(32px, 5vw, 64px)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
