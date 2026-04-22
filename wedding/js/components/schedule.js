/* ── Order of Events ── */
function OrderOfEvents() {
  const hScrollRef = useHorizontalScroll();
  const events = [
    { time: '4:00 PM', label: 'Ceremony' },
    { time: '5:00 PM', label: 'Cocktail Hour' },
    { time: '6:00 PM', label: 'Dinner' },
    { time: '7:00 PM', label: 'Reception' },
  ];

  return (
    <section id="schedule" style={{ background: '#f8f5f0', overflow: 'hidden' }}>
      {/* Section header above the scroll track */}
      <div style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px) 0',
        display: 'flex',
        alignItems: 'baseline',
        gap: '20px',
      }}>
        <span className="eyebrow">Order of Events</span>
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
                        paddingTop: i % 2 === 0 ? 'clamp(60px,10vh,120px)' : '0',
                        paddingBottom: i % 2 === 1 ? 'clamp(60px,10vh,120px)' : '0' }}>
            <div className="event-watermark">{evt.time.split(' ')[0]}</div>
            <div className="event-label">{evt.label}</div>
            <span className="event-time-label">{evt.time}</span>
          </div>
        ))}

        {/* Right padding */}
        <div style={{ flexShrink: 0, width: 'clamp(24px, 6vw, 80px)' }} />
      </div>
    </section>
  );
}
