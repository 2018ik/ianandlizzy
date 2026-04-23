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
             padding: 'clamp(32px, 4vh, 52px) 0',
             borderTop: i >= 2 ? '1px solid #e0d8ce' : 'none',
             transitionDelay: `${(i % 2) * 0.1}s`,
           }}>
        <div className="story-watermark">{s.year}</div>
        <span className="eyebrow" style={{ marginBottom: '12px' }}>Chapter {s.chapter}</span>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400,
          fontSize: 'clamp(18px, 2.2vw, 24px)',
          color: '#1a1714',
          lineHeight: 1.7,
          margin: '0 0 16px 0',
        }}>
          {s.body}
        </p>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          color: '#b0a898',
        }}>{s.year}</span>
      </div>
    </div>
  );
}

/* ── Our Story ── */
function OurStory() {
  const [titleRef, titleVisible] = useReveal({ threshold: 0.2 });
  const [galleryRef, galleryVisible] = useReveal({ threshold: 0.05 });

  const stories = [
    { year: '2008', chapter: '01', body: 'We met when we were like 8 in the church in Dunn Loring.' },
    { year: '2017', chapter: '02', body: 'Then we were in the same Chinese class at TJ.' },
    { year: '2022', chapter: '03', body: 'Then we randomly talked one time.' },
    { year: '2024', chapter: '04', body: 'Then we went to the FTTA and were on the same gospel team.' },
    { year: '2025', chapter: '05', body: 'After the training, we started talking and then dating...' },
    { year: '2026', chapter: '06', body: 'We got engaged on March 8, 2026!' },
  ];

  return (
    <section id="story" style={{ background: '#f8f5f0', padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,80px)' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>

        <h2 ref={titleRef}
            className={`reveal ${titleVisible ? 'visible' : ''}`}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(48px, 7vw, 96px)',
              color: '#1a1714',
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              marginBottom: 'clamp(48px, 7vh, 80px)',
            }}>
          Our Story
        </h2>

        {/* Alternating two-column timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 60px' }}
             className="story-grid">
          {stories.map((s, i) => (
            <StoryEntry key={s.year} s={s} i={i} />
          ))}
        </div>

        {/* Masonry gallery */}
        <div ref={galleryRef}
             className={`masonry-grid reveal ${galleryVisible ? 'visible' : ''}`}
             style={{ marginTop: 'clamp(48px, 6vh, 80px)' }}>
          <div className="masonry-photo photo-placeholder" style={{ aspectRatio: '3/4' }} />
          <div className="masonry-photo photo-placeholder-warm" style={{ aspectRatio: '4/5' }} />
          <div className="masonry-photo photo-placeholder-light" style={{ aspectRatio: '3/4' }} />
          <div className="masonry-photo photo-placeholder" style={{ aspectRatio: '4/3' }} />
          <div className="masonry-photo photo-placeholder-light" style={{ aspectRatio: '3/4' }} />
          <div className="masonry-photo photo-placeholder-warm" style={{ aspectRatio: '3/5' }} />
        </div>
      </div>
    </section>
  );
}
