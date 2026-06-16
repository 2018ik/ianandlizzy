/* ── Order of Events ── */
function OrderOfEvents() {
  const content = useContent();
  const hScrollRef = useHorizontalScroll();
  const events = content.schedule.events;

  return (
    <section id="schedule" style={{ background: '#f8f5f0', overflow: 'hidden' }}>
      {/* Section header above the scroll track */}
      <div style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px) 0',
        display: 'flex',
        alignItems: 'baseline',
        gap: '20px',
      }}>
        <span className="eyebrow">{content.schedule.eyebrow}</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '10px',
          color: '#b0a898',
          letterSpacing: '0.15em',
        }}>— Scroll →</span>
      </div>

      {/* Horizontal scroll track */}
      <div ref={hScrollRef} className="h-scroll-container">
        {/* Left padding card */}
        <div style={{ flexShrink: 0, width: 'clamp(24px, 6vw, 80px)' }} />

        {events.map((evt, i) => (
          <div key={evt.label}
               className="h-scroll-card"
               style={{ alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                        paddingTop: i % 2 === 0 ? 'clamp(12px,1.5vh,20px)' : '0',
                        paddingBottom: i % 2 === 1 ? 'clamp(12px,1.5vh,20px)' : '0' }}>
            <div className="event-watermark">{evt.time.split(' ')[0]}</div>
            <img src={evt.img} alt={evt.label} style={{
              display: 'block',
              width: 'clamp(120px, 18vw, 220px)',
              height: 'auto',
              marginBottom: '20px',
              position: 'relative',
            }} />
            <div className="event-label">{evt.label}</div>
            <span className="event-time-label">{evt.time} · {evt.date}</span>
          </div>
        ))}

        {/* Right padding */}
        <div style={{ flexShrink: 0, width: 'clamp(80px, 12vw, 160px)' }} />
      </div>
    </section>
  );
}
