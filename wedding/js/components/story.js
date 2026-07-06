/* ── Photos by year — shown in the open space beside each chapter ── */
const STORY_HOVER_PHOTOS = {
  '2008': ['images/childhood_photo.PNG'],
  '2017': ['images/qipao.jpg', 'images/ian_chinese.jpg'],
  '2022': ['images/wide.webp'],
  '2024': ['images/FUL_CP.jpg', 'images/IMG_7578.webp'],
  '2025': ['images/ricecat1.jpg', 'images/ricecat2.jpg'],
  '2026': ['images/1.webp', 'images/engagement9.JPG'],
};

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
function StoryEntry({ s, i, groups = [] }) {
  // Separate observer on the photos themselves so they animate when *they* enter
  // the viewport — the chapter is tall and triggers its reveal long before its
  // top-anchored photos are actually on screen.
  const [photosRef, photosVisible] = useReveal({ threshold: 0.15, rootMargin: '0px 0px -28% 0px' });
  const year = String(s.year);
  const chapterPhotos = STORY_HOVER_PHOTOS[year] || [];     // mobile (own photos)
  const hasMobilePhotos = chapterPhotos.length > 0;
  const hasDesktopPhotos = groups.length > 0;               // desktop rail (may be merged)
  const sections = Array.isArray(s.sections) && s.sections.length
    ? s.sections
    : [{ label: 'Together', text: s.body }];

  // Chapter 3 sits on the RIGHT half (photos to the left) and keeps its two POVs
  // side by side; chapter 4 breaks out to the LEFT half (photos flip right).
  // Chapters 1 & 2 and 5 & 6 stay paired in the right-aligned 2-column grid.
  const isSplit = i === 2;
  const isRightHalf = i === 2;
  const isLeftHalf = i === 3;
  const gridSpan = (isRightHalf || isLeftHalf) ? { gridColumn: '1 / -1' } : undefined;

  let photoIndex = 0;
  return (
    <div className={`story-chapter ${isSplit ? 'story-chapter-split' : ''} ${isLeftHalf ? 'story-chapter-left' : ''} ${isRightHalf ? 'story-chapter-right' : ''}`}
         style={gridSpan}>
      {hasDesktopPhotos && (
        <div ref={photosRef}
             className={`story-desktop-photos ${groups.length > 1 ? 'stacked' : ''} ${photosVisible ? 'visible' : ''}`}>
          {groups.map((group, gi) => (
            <div key={gi} className={`story-photo-group ${group.length > 1 ? 'multi' : ''}`}>
              {group.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Ian and Lizzy"
                  style={{ transitionDelay: `${(photoIndex++) * 0.12}s` }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="story-entry">
        <div className="story-watermark">{s.year}</div>

        <div className="story-chapter-head">
          <span className="eyebrow story-chapter-kicker">
            <span>Chapter {s.chapter}</span>
          </span>
          <span className="story-year">{s.year}</span>
        </div>

        {hasMobilePhotos && (
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
  const [galleryRef, galleryVisible] = useReveal({ threshold: 0.05 });

  const stories = content.story.entries;

  // Desktop photo rail per chapter. Paired rows merge: chapter 2's photos stack
  // under chapter 1's, chapter 6's under chapter 5's (each chapter is one group).
  const photoOf = (idx) => STORY_HOVER_PHOTOS[String(stories[idx] && stories[idx].year)] || [];
  const groupsFor = (i) => {
    if (i === 1 || i === 5) return [];                      // shown under the paired chapter
    if (i === 0) return [photoOf(0), photoOf(1)].filter((g) => g.length);
    if (i === 3) return photoOf(3).map((src) => [src]);      // stack chapter 4 photos vertically
    if (i === 4) return [photoOf(4), photoOf(5)].filter((g) => g.length);
    const own = photoOf(i);
    return own.length ? [own] : [];
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

      <h2 style={{
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
            <StoryEntry key={s.year} s={s} i={i} groups={groupsFor(i)} />
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
