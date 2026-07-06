/* ── Registry ── */
const REGISTRY_URL = 'https://www.amazon.com/registries/gl/guest-view/2Z3F40FB313SJ?ref_=cm_sw_r_cp_ud_ggr-subnav-share_Y06GAP15F03CVBJGNNQX';
const REGISTRY_COPY = 'Your presence is a gift to us! If you would still like to help us begin this next chapter, we have put together a registry.';
const REGISTRY_WORDS = REGISTRY_COPY.split(' ');

function Registry() {
  const sectionRef = useRef(null);
  const [textRef, textVisible] = useReveal({ threshold: 0.1 });
  const [cardRef, cardVisible] = useReveal({ threshold: 0.1 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const clamp = (value) => Math.max(0, Math.min(1, value));
    const start = [107, 45, 62];
    const end = [179, 132, 26];
    const mixColor = (amount) => {
      const t = clamp(amount);
      const rgb = start.map((channel, index) => Math.round(channel + (end[index] - channel) * t));
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    };
    const apply = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / travel);
      section.style.setProperty('--registry-scroll', progress.toFixed(4));
      REGISTRY_WORDS.forEach((_, index) => {
        const startAt = REGISTRY_WORDS.length > 1 ? index / (REGISTRY_WORDS.length - 1) : 0;
        const tone = clamp((progress - startAt * 0.78) * 5);
        section.style.setProperty(`--registry-word-tone-${index}`, tone.toFixed(4));
        section.style.setProperty(`--registry-word-color-${index}`, mixColor(tone));
      });
    };

    apply();
    const unsubScroll = onLenisScroll(apply);
    window.addEventListener('resize', apply);
    return () => {
      unsubScroll();
      window.removeEventListener('resize', apply);
    };
  }, []);

  return (
    <section ref={sectionRef} id="registry" className="registry-scroll-lock" style={{
      background: 'transparent',
      position: 'relative',
    }}>
      <div className="registry-layout">
        <div className="registry-copy">

          {/* Text block */}
          <div ref={textRef} style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '32px' }}>Registry</span>

            <p className="registry-color-copy" style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(24px, 3.2vw, 40px)',
              lineHeight: 1.45,
              margin: '0 0 44px',
              maxWidth: '36rem',
              letterSpacing: '-0.01em',
            }}>
              {REGISTRY_WORDS.map((word, index) => (
                <React.Fragment key={`${word}-${index}`}>
                  <span
                    className="registry-color-word"
                    style={{
                      '--word-tone': `var(--registry-word-tone-${index}, 0)`,
                      '--word-color': `var(--registry-word-color-${index}, #6b2d3e)`,
                    }}
                  >
                    {word}
                  </span>
                  {index < REGISTRY_WORDS.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </p>

            <div style={{ width: '40px', height: '1px', background: '#b0a898', margin: '0 0 54px' }} />
          </div>

          {/* Registry link */}
          <a ref={cardRef}
             href={REGISTRY_URL}
             target="_blank"
             rel="noopener noreferrer"
             style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            textDecoration: 'none',
            color: 'inherit',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}>
            <span className="registry-link-label" style={{
              fontFamily: "'Fragment Mono', monospace",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}>View on Amazon →</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: '15px',
              color: '#b0a898',
              letterSpacing: '0.02em',
            }}>Opens Amazon in a new tab</span>
          </a>
        </div>

        <div className="registry-photo-wrap" aria-hidden="true">
          <img
            src="images/engagement12.jpg"
            alt=""
            className="registry-feature-photo"
          />
        </div>
      </div>
    </section>
  );
}
