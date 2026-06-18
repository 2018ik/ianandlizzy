/* ── Order of Events ── */
function OrderOfEvents() {
  const content = useContent();
  const [wrapperRef, trackRef] = usePinnedHScroll();
  const events = content.schedule.events;

  return (
    <section id="schedule" style={{ background: '#f0ebe3' }}>
      {/* Wrapper height is set by JS to equal 100vh + horizontal scroll distance */}
      <div ref={wrapperRef}>
        <div className="h-scroll-sticky">

          {/* Header — stays fixed while cards scroll past */}
          <div style={{
            padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px) 0',
            display: 'flex',
            alignItems: 'baseline',
            gap: '20px',
            flexShrink: 0,
          }}>
            <span className="eyebrow">{content.schedule.eyebrow}</span>
            <span style={{
              fontFamily: "'Fragment Mono', monospace",
              fontSize: '10px',
              color: '#b0a898',
              letterSpacing: '0.15em',
            }}>— Scroll →</span>
          </div>

          {/* Track — translateX is applied here by the hook */}
          <div ref={trackRef} className="h-scroll-track">
            <div style={{ flexShrink: 0, width: 'clamp(24px, 6vw, 80px)' }} />

            {events.map((evt, i) => (
              <div key={evt.label}
                   className="h-scroll-card"
                   style={{ transform: i % 2 === 0 ? 'translateY(-60px)' : 'translateY(60px)' }}>
                <div className="event-watermark">{evt.time.split(' ')[0]}</div>
                <img src={evt.img} alt={evt.label} style={{
                  display: 'block',
                  width: 'clamp(100px, 15vw, 180px)',
                  height: 'auto',
                  marginBottom: '20px',
                  position: 'relative',
                }} />
                <div className="event-label">{evt.label}</div>
                <span className="event-time-label">{evt.time} · {evt.date}</span>
              </div>
            ))}

            <div style={{ flexShrink: 0, width: 'clamp(80px, 12vw, 160px)' }} />
          </div>

        </div>
      </div>
    </section>
  );
}
