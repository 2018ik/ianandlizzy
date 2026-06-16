/* ── FAQ Item ── */
function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className="faq-row-modern">
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '40px 1fr 24px',
          alignItems: 'center',
          gap: '24px',
          padding: 'clamp(20px, 3vh, 28px) clamp(16px, 4vw, 40px)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        aria-expanded={open}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '10px',
          fontWeight: 300,
          letterSpacing: '0.2em',
          color: '#b0a898',
        }}>{num}</span>
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400,
          fontSize: 'clamp(17px, 2vw, 21px)',
          color: '#1a1714',
          lineHeight: 1.3,
        }}>{question}</span>
        <div className={`faq-cross ${open ? 'open' : ''}`} />
      </button>
      <div className={`faq-body-wrap ${open ? 'open' : ''}`}>
        <div className="faq-body-inner">
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '15px',
            lineHeight: 1.75,
            color: '#7a7068',
            padding: `0 clamp(16px, 4vw, 40px) clamp(20px, 3vh, 28px) calc(40px + clamp(16px, 4vw, 40px) + 24px)`,
          }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── FAQs ── */
function FAQs() {
  const content = useContent();
  const faqs = content.faq.items;

  const [titleRef, titleVisible] = useReveal({ threshold: 0.2 });

  return (
    <section id="faqs" style={{ background: '#f0ebe3', padding: 'clamp(60px,8vh,100px) 0', position: 'relative', overflow: 'hidden' }}>
      {/* Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 'clamp(100px, 20vw, 200px)',
        fontWeight: 300,
        fontStyle: 'italic',
        color: '#1a1714',
        opacity: 0.04,
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>FAQs</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 clamp(16px,6vw,80px)', marginBottom: 'clamp(32px,4vh,52px)' }}>
          <h2 ref={titleRef}
              className={`reveal ${titleVisible ? 'visible' : ''}`}
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(40px, 6vw, 72px)',
                color: '#1a1714',
                letterSpacing: '-0.02em',
                margin: 0,
              }}>
            {content.faq.title}
          </h2>
        </div>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
