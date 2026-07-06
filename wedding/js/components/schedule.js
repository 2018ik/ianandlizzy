/* ── Order of Events ── */
function OrderOfEvents() {
  const content = useContent();
  const [wrapperRef, trackRef] = usePinnedHScroll();
  const stickyRef = useRef(null);
  const cardRefs = useRef([]);
  const events = content.schedule.events;

  // Scroll-driven entrance. The pinned section used to hard-cut in because a
  // simple IntersectionObserver reveal fired the instant the 100vh element
  // peeked from the bottom — the fade was over before it pinned. Instead we map
  // the section's approach to the top of the viewport into a 0→1 progress and
  // drive opacity + a staggered per-card rise off that, so it visibly cross-fades
  // and gains depth as it settles into the pin.
  useEffect(() => {
    const sticky = stickyRef.current;
    const wrapper = wrapperRef.current;
    if (!sticky || !wrapper) return;

    const onScroll = () => {
      const vh = window.innerHeight;
      const desktop = window.innerWidth >= 768;
      const rect = wrapper.getBoundingClientRect();
      const top = rect.top;
      // p: 0 while the section is still a full viewport below the top, 1 once it
      // reaches the top and pins. Fade plays over the last ~85vh of approach.
      const p = Math.max(0, Math.min(1, 1 - top / (vh * 0.85)));

      sticky.style.opacity = p;
      sticky.style.transform = `translateY(${(1 - p) * 40}px)`;

      // Horizontal scroll progress through the pinned section (0 at pin start,
      // 1 at the end). This drives a "focus" that travels across ALL cards in
      // sequence — the leftmost card is active at the start, the rightmost at
      // the end — rather than only the ones that cross screen-center.
      const maxScroll = wrapper.offsetHeight - vh;
      const hp = maxScroll > 0 ? Math.max(0, Math.min(1, -top / maxScroll)) : 0;
      const n = cardRefs.current.length;
      const activeIndex = hp * (n - 1);

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const restY = i % 2 === 0 ? -60 : 60;
        // Each card lags the one before it, so they rise into the zig-zag in
        // sequence rather than all at once (adds depth, fixes the flat look).
        const cp = Math.max(0, Math.min(1, (p - i * 0.04) / 0.55));
        card.style.opacity = cp;

        // Active-card focus (desktop only): the card nearest the traveling
        // active index scales up; peaks fully on each card in turn. Scale only.
        let scale = 1;
        if (desktop) {
          const near = Math.max(0, 1 - Math.abs(i - activeIndex));
          scale = 1 + near * near * 0.32;
        }
        card.style.transform = `translateY(${restY + (1 - cp) * 48}px) scale(${scale.toFixed(4)})`;
      });
    };

    onScroll();
    const unsubScroll = onLenisScroll(onScroll);
    window.addEventListener('resize', onScroll);
    return () => {
      unsubScroll();
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="schedule" style={{ background: 'transparent' }}>
      {/* Wrapper height is set by JS to equal 100vh + horizontal scroll distance */}
      <div ref={wrapperRef}>
        <div ref={stickyRef} className="h-scroll-sticky" style={{ opacity: 0 }}>

          {/* Header — stays fixed while cards scroll past */}
          <div style={{
            padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px) 0',
            display: 'flex',
            alignItems: 'baseline',
            gap: '20px',
            flexShrink: 0,
          }}>
            <span className="eyebrow">{content.schedule.eyebrow}</span>
          </div>

          {/* Track — translateX is applied here by the hook */}
          <div ref={trackRef} className="h-scroll-track">
            <div style={{ flexShrink: 0, width: 'clamp(24px, 6vw, 80px)' }} />

            {events.map((evt, i) => (
              <div key={evt.label}
                   ref={el => cardRefs.current[i] = el}
                   className="h-scroll-card"
                   style={{ transform: i % 2 === 0 ? 'translateY(-60px)' : 'translateY(60px)' }}>
                <div className="event-watermark">{evt.time.split(' ')[0]}</div>
                <img src={evt.img} alt={evt.label} style={{
                  display: 'block',
                  width: 'clamp(100px, 15vw, 180px)',
                  height: 'auto',
                  marginBottom: '20px',
                  position: 'relative',
                  mixBlendMode: 'multiply',
                }} />
                <div className="event-label">{evt.label}</div>
                {/* <span className="event-time-label">{evt.time} · {evt.date}</span> */}
              </div>
            ))}

            <div style={{ flexShrink: 0, width: 'clamp(80px, 12vw, 160px)' }} />
          </div>

        </div>
      </div>
    </section>
  );
}
