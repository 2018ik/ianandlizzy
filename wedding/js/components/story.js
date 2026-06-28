/* ── Hover photos by year — revealed in the open left area on hover ── */
const STORY_HOVER_PHOTOS = {
  '2008': ['images/childhood_photo.PNG'],
  '2017': ['images/qipao.jpg', 'images/ian_chinese.jpg'],
  '2024': ['images/FUL_CP.jpg'],
  '2025': ['images/ricecat1.jpg', 'images/ricecat2.jpg'],
  '2026': ['images/1.webp', 'images/engagement9.JPG'],
};

/* ── Story Entry (extracted so hooks work correctly) ── */
function StoryEntry({ s, i, onHover, active }) {
  const [entryRef, entryVisible] = useReveal({ threshold: 0.12 });
  const isLeft = i % 2 === 0;
  const year = String(s.year);
  const hasHoverPhotos = !!STORY_HOVER_PHOTOS[year];
  return (
    <div ref={entryRef}
         onMouseEnter={() => hasHoverPhotos && onHover(year)}
         onMouseLeave={() => hasHoverPhotos && onHover(null)}
         style={{ gridColumn: isLeft ? 1 : 2 }}>
      <div className={`story-entry clip-reveal-v ${entryVisible ? 'visible' : ''}`}
           style={{
             padding: 'clamp(16px, 2vh, 28px) 0',
             borderTop: 'none',
             transitionDelay: `${(i % 2) * 0.1}s`,
           }}>
        <div className="story-watermark">{s.year}</div>
        {/* Active chapter — whose photos are currently shown — gets a gold dot
            and warms in colour so it's clear which one is highlighted. */}
        <span className="eyebrow" style={{
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: active ? '#B3841A' : undefined,
          transition: 'color 0.35s ease',
        }}>
          <span>Chapter {s.chapter}</span>
          {hasHoverPhotos && (
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#B3841A',
              opacity: active ? 1 : 0,
              transform: active ? 'scale(1)' : 'scale(0.4)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }} />
          )}
        </span>
        <span style={{
          fontFamily: "'Fragment Mono', monospace",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.2em',
          color: active ? '#B3841A' : '#b0a898',
          transition: 'color 0.35s ease',
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
  const [hoveredYear, setHoveredYear] = useState(null);
  const [hoverHint, setHoverHint] = useState(true);

  const stories = content.story.entries;

  // Show the first chapter's photos by default so visitors see what hovering
  // does; hovering any year takes over, and leaving falls back to the default.
  const defaultYear = Object.keys(STORY_HOVER_PHOTOS)[0];
  const activeYear = hoveredYear ?? defaultYear;

  const handleHover = (year) => {
    setHoveredYear(year);
    if (year) setHoverHint(false); // they've discovered it
  };

  useEffect(() => {
    const t = setTimeout(() => setHoverHint(false), 9000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="story" style={{
      background: 'transparent',
      padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,80px)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>

      {/* Hover photos — every year reveals into the same open area on the left,
          left of the timeline table and above the gallery (so they don't march
          down the page with each entry). All sets stay mounted and cross-fade.
          The band spans exactly the empty space: from the content's left edge to
          the table's left edge (the table is 34rem wide, right-aligned), so the
          photos sit centred in that gap regardless of viewport width. */}
      <div style={{
        position: 'absolute',
        left: 'clamp(24px, 6vw, 80px)',
        right: 'calc(clamp(24px, 6vw, 80px) + 34rem)',
        top: '36%',
        transform: 'translateY(-50%)',
        height: 'min(58vh, 520px)',
        pointerEvents: 'none',
        width: 'min(46%, 780px)',
        zIndex: 1,
      }}>
        {Object.entries(STORY_HOVER_PHOTOS).map(([year, imgs]) => {
          const on = activeYear === year;
          return (
            <div key={year} style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(16px, 2vw, 36px)',
            }}>
              {imgs.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt="Ian and Lizzy"
                  style={{
                    maxWidth: imgs.length > 1 ? '47%' : (src.includes('FUL_CP') ? '68%' : '82%'),
                    maxHeight: '100%',
                    height: 'auto',
                    border: '6px solid #B3841A',
                    boxShadow: '0 16px 36px rgba(80, 50, 40, 0.22)',
                    opacity: on ? 1 : 0,
                    transform: on ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.94)',
                    transition: `opacity 0.5s ease ${idx * 0.08}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s`,
                  }}
                />
              ))}
            </div>
          );
        })}

        {/* Transient hint — hover a year to reveal its photos */}
        <div className="ui-hint" style={{
          position: 'absolute',
          bottom: '-36px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: hoverHint ? 0.7 : 0,
          transition: 'opacity 0.8s ease',
        }}>
          <span className="ui-hint-bob">✦ hover each year</span>
        </div>
      </div>

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

      <div style={{ maxWidth: '34rem', marginLeft: 'auto', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
        {/* Alternating two-column timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 36px' }}
             className="story-grid">
          {stories.map((s, i) => (
            <StoryEntry key={s.year} s={s} i={i} onHover={handleHover} active={String(s.year) === activeYear} />
          ))}
        </div>
      </div>

      {/* Photo gallery — full-width, original sizing */}
      <div style={{ maxWidth: '64rem', margin: '0 auto', marginTop:'200px', width: '100%' }}>
        <div ref={galleryRef}
             className={`reveal story-gallery ${galleryVisible ? 'visible' : ''}`}
             style={{
               marginTop: 'clamp(48px, 6vh, 80px)',
               display: 'flex',
               gap: '12px',
               alignItems: 'flex-start',
             }}>
          {['engagement4', 'engagement8', 'engagement7', 'engagement5'].map((name, i) => (
            /* Dreamy soft-glow (Orton) — a blurred bright copy blended over the
               sharp photo on hover. */
            <div key={name} className="orton-wrap"
                 style={{
                   flex: '1',
                   width: '0',
                   aspectRatio: '3/4',
                   alignSelf: 'flex-start',
                   marginTop: i % 2 === 0 ? '0' : 'clamp(32px, 5vw, 64px)',
                 }}>
              <img src={`images/${name}.jpg`} alt="Ian and Lizzy" className="orton-base" />
              <img src={`images/${name}.jpg`} alt="" aria-hidden="true" className="orton-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
