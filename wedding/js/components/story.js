/* ── Hover photos by year — revealed in the open left area on hover ── */
const STORY_HOVER_PHOTOS = {
  '2008': ['images/childhood_photo.PNG'],
  '2017': ['images/qipao.jpg', 'images/ian_chinese.jpg'],
  '2022': ['images/wide.webp'],
  '2024': ['images/FUL_CP.jpg'],
  '2025': ['images/ricecat1.jpg', 'images/ricecat2.jpg'],
  '2026': ['images/1.webp', 'images/engagement9.JPG'],
};

const STORY_SESSION_KEY = 'ian-lizzy-last-story-chapter';

function StoryParagraphs({ text }) {
  const paragraphs = Array.isArray(text) ? text : String(text || '').split(/\n\s*\n/);
  return (
    <>
      {paragraphs.filter(Boolean).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  );
}

/* ── Story Entry (extracted so hooks work correctly) ── */
function StoryEntry({ s, i, onHover, active }) {
  const [entryRef, entryVisible] = useReveal({ threshold: 0.12 });
  const year = String(s.year);
  const chapterPhotos = STORY_HOVER_PHOTOS[year] || [];
  const hasHoverPhotos = chapterPhotos.length > 0;
  const sections = Array.isArray(s.sections) && s.sections.length
    ? s.sections
    : [{ label: 'Together', text: s.body }];

  return (
    <div ref={entryRef}
         onMouseEnter={() => onHover(year)}
         className={`story-chapter ${active ? 'active' : ''}`}>
      {hasHoverPhotos && (
        <div className={`story-desktop-photos ${chapterPhotos.length > 1 ? 'multi' : ''}`}>
          {chapterPhotos.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Ian and Lizzy"
              style={{ transitionDelay: `${idx * 0.08}s` }}
            />
          ))}
        </div>
      )}

      <div className={`story-entry clip-reveal-v ${entryVisible ? 'visible' : ''}`}
           style={{
             transitionDelay: `${(i % 2) * 0.1}s`,
           }}>
        <div className="story-watermark">{s.year}</div>

        <div className="story-chapter-head">
          <span className="eyebrow story-chapter-kicker">
            <span>Chapter {s.chapter}</span>
            {hasHoverPhotos && <span className="story-active-dot" />}
          </span>
          <span className="story-year">{s.year}</span>
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400,
          fontSize: 'clamp(17px, 1.6vw, 22px)',
          color: '#6b2d3e',
          lineHeight: 1.5,
          margin: '0 0 clamp(20px, 2.5vw, 30px)',
        }}>
          {s.body}
        </p>

        {hasHoverPhotos && (
          <div className={`story-mobile-photos ${chapterPhotos.length > 1 ? 'multi' : ''}`}>
            {chapterPhotos.map((src) => (
              <img key={src} src={src} alt="Ian and Lizzy" />
            ))}
          </div>
        )}

        <div className="story-pov-list">
          {sections.map((section, index) => (
            <article key={`${section.label}-${index}`} className="story-pov">
              <span>{section.label}</span>
              <StoryParagraphs text={section.text} />
            </article>
          ))}
        </div>
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
  const defaultYear = String(stories[0]?.year || Object.keys(STORY_HOVER_PHOTOS)[0]);
  const storyYears = stories.map((s) => String(s.year));
  const [activeYear, setActiveYear] = useState(() => {
    try {
      const savedYear = window.sessionStorage.getItem(STORY_SESSION_KEY);
      return storyYears.includes(savedYear) ? savedYear : defaultYear;
    } catch (error) {
      return defaultYear;
    }
  });

  const handleHover = (year) => {
    setActiveYear(year);
    try {
      window.sessionStorage.setItem(STORY_SESSION_KEY, year);
    } catch (error) {
      // Some privacy modes disable sessionStorage; the in-memory state still works.
    }
  };

  return (
    <section id="story" style={{
      background: 'transparent',
      padding: 'clamp(60px,8vh,100px) clamp(24px,6vw,80px)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
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

      <div className="story-chapters-wrap">
        <div className="story-grid">
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
