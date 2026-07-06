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
function StoryEntry({ s, i, groups = [], chapterRef }) {
  const year = String(s.year);
  const chapterPhotos = STORY_HOVER_PHOTOS[year] || [];     // mobile (own photos)
  const hasMobilePhotos = chapterPhotos.length > 0;
  const hasDesktopPhotos = groups.length > 0;               // desktop rail (may be merged)
  const sections = Array.isArray(s.sections) && s.sections.length
    ? s.sections
    : [{ label: 'Together', text: s.body }];

  // Every chapter uses the same format: full-width on the RIGHT side of the
  // spine, photos in the rail to the left, and the two POVs (Lizzy / Ian) side
  // by side.
  const isSplit = true;
  const isRightHalf = true;
  const isLeftHalf = false;
  const gridSpan = { gridColumn: '1 / -1' };

  return (
    <div ref={chapterRef}
         className={`story-chapter ${isSplit ? 'story-chapter-split' : ''} ${isLeftHalf ? 'story-chapter-left' : ''} ${isRightHalf ? 'story-chapter-right' : ''}`}
         style={gridSpan}>
      {hasDesktopPhotos && (
        <div className={`story-desktop-photos ${groups.length > 1 ? 'stacked' : ''}`}>
          {groups.map((group, gi) => (
            <div key={gi} className={`story-photo-group ${group.length > 1 ? 'multi' : ''}`}>
              {group.map((src) => (
                <img key={src} src={src} alt="Ian and Lizzy" />
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
  const wrapRef = useRef(null);
  const spineFillRef = useRef(null);
  const chapterEls = useRef([]);
  const nodeEls = useRef([]);

  const stories = content.story.entries;

  // Desktop photo rail per chapter. Each chapter shows only its own photos in
  // the rail to its left. Normally that's a single group (a flex row) so two
  // photos sit side by side; chapter 4 (i === 3) instead stacks its photos
  // vertically — one group per photo, so they fill the rail's flex column.
  const photoOf = (idx) => STORY_HOVER_PHOTOS[String(stories[idx] && stories[idx].year)] || [];
  const groupsFor = (i) => {
    const own = photoOf(i);
    if (!own.length) return [];
    if (i === 3) return own.map((src) => [src]);  // chapter 4: stack vertically
    return [own];                                 // others: side by side
  };

  // ── Timeline spine + scrubbed photo develop / parallax ──
  // One scroll handler drives everything. Reads are batched before writes to
  // avoid layout thrash. The spine (fill + node ignition) runs everywhere; the
  // photo develop and parallax are desktop-only and off for reduced motion.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const fill = spineFillRef.current;
    const nodes = nodeEls.current;
    const chapters = chapterEls.current;
    const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
    const reduce = () => window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let groups = [];
    const collect = () => { groups = Array.from(wrap.querySelectorAll('.story-photo-group')); };
    // Place each year node at its chapter's vertical centre on the spine.
    const layout = () => {
      chapters.forEach((ch, i) => {
        const node = nodes[i];
        if (ch && node) node.style.top = (ch.offsetTop + ch.offsetHeight / 2) + 'px';
      });
    };

    const apply = () => {
      const vh = window.innerHeight;
      const refLine = vh * 0.48;                 // the "playhead" the spine fills to
      const advanced = window.innerWidth >= 768 && !reduce();
      // ── reads ──
      const wr = wrap.getBoundingClientRect();
      const centers = chapters.map((ch) => {
        if (!ch) return null;
        const r = ch.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const gdata = advanced ? groups.map((g) => {
        const r = g.getBoundingClientRect();
        return { g, top: r.top, center: r.top + r.height / 2 };
      }) : null;
      // ── writes ──
      if (fill) fill.style.transform = `scaleY(${clamp((refLine - wr.top) / (wr.height || 1)).toFixed(4)})`;
      nodes.forEach((node, i) => {
        if (node && centers[i] != null) {
          node.classList.toggle('is-lit', Math.abs(centers[i] - refLine) < vh * 0.32);
        }
      });
      if (advanced) {
        gdata.forEach(({ g, top, center }) => {
          // Dual-rate parallax: photos drift against the text beside them.
          const py = clamp((vh / 2 - center) * 0.06, -40, 40);
          g.style.setProperty('--sy', py.toFixed(2) + 'px');
          // Develop: scrub clip-path, blur and grayscale by each group's progress
          // up the screen — the photo wipes in, sharpens, and warms from black &
          // white to full colour as you reach it (reverses on scroll-up).
          const p = clamp((vh - top) / (vh * 0.55));
          const inset = ((1 - p) * 100).toFixed(1);
          const filter = p >= 1
            ? 'none'
            : `blur(${((1 - p) * 12).toFixed(1)}px) grayscale(${(1 - p).toFixed(3)})`;
          g.querySelectorAll('img').forEach((img) => {
            img.style.clipPath = `inset(0 0 ${inset}% 0)`;
            img.style.filter = filter;
          });
        });
      }
    };

    collect();
    layout();
    apply();
    const unsub = onLenisScroll(apply);
    const onResize = () => { collect(); layout(); apply(); };
    window.addEventListener('resize', onResize);
    let ro = null;
    if ('ResizeObserver' in window) { ro = new ResizeObserver(layout); ro.observe(wrap); }
    return () => {
      unsub();
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [stories.length]);

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

      <div className="story-chapters-wrap" ref={wrapRef}>
        <div className="story-spine" aria-hidden="true">
          <div className="story-spine-fill" ref={spineFillRef} />
          {stories.map((s, i) => (
            <span key={s.year} className="story-node" ref={(el) => (nodeEls.current[i] = el)} />
          ))}
        </div>
        <div className="story-grid">
          {stories.map((s, i) => (
            <StoryEntry key={s.year} s={s} i={i} groups={groupsFor(i)}
                        chapterRef={(el) => (chapterEls.current[i] = el)} />
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
