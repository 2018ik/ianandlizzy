/* ── Dot Nav ── */
const DOT_SECTIONS = [
  { id: 'home',       label: 'Home' },
  { id: 'invitation', label: 'Invitation' },
  { id: 'schedule',   label: 'Schedule' },
  { id: 'story',      label: 'Our Story' },
  { id: 'registry',   label: 'Registry' },
  { id: 'faq',        label: 'FAQ' },
];
// Only show the nav on these sections
const DOT_NAV_VISIBLE_ON = new Set(['home', 'invitation']);

function DotNav() {
  const [activeId, setActiveId] = useState('home');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const els = DOT_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveId(id);
          setVisible(DOT_NAV_VISIBLE_ON.has(id));
        }
      });
    }, { threshold: 0.4 });
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'auto' });
  };

  // On the invitation section, tint the nav to match the cream accent
  const onInvitation = activeId === 'invitation';
  const lineColor   = onInvitation ? '#fff3ddff' : '#c8bfb5';
  const activeColor = onInvitation ? '#fff3ddff' : '#7a6a5a';
  const dotBorder   = onInvitation ? '#fff3ddff' : '#c8bfb5';

  return (
    <div className="dot-nav" style={{
      position: 'fixed',
      left: 'clamp(16px, 3vw, 48px)',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 90,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity 0.5s ease',
    }}>

      {/* Top hairline */}
      <div style={{ width: '1px', height: '32px', background: lineColor, transition: 'background 0.5s ease' }} />

      {/* "Home" label — only shown on home section */}
      {activeId === 'home' && <span style={{
        fontFamily: "'Fragment Mono', monospace",
        fontSize: '8px',
        fontWeight: 500,
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        color: '#b0a898',
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)',
        transition: 'opacity 0.3s ease',
        userSelect: 'none',
      }}>Home</span>}

      {/* Dots */}
      {DOT_SECTIONS.map(s => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          title={s.label}
          style={{
            width: activeId === s.id ? '6px' : '4px',
            height: activeId === s.id ? '6px' : '4px',
            borderRadius: '50%',
            background: activeId === s.id ? activeColor : 'transparent',
            border: `1px solid ${activeId === s.id ? activeColor : dotBorder}`,
            padding: 0,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}
          aria-label={`Go to ${s.label}`}
        />
      ))}

      {/* Bottom hairline */}
      <div style={{ width: '1px', height: '32px', background: lineColor, transition: 'background 0.5s ease' }} />
    </div>
  );
}

/* ── Scroll Progress Bar ── */
function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div className="scroll-progress" style={{ width: `${progress * 100}%` }} />
  );
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    return onLenisScroll(onScroll);
  }, []);

  useEffect(() => {
    const ids = ['invitation', 'schedule', 'story', 'registry', 'faqs'];
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-35% 0px -35% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  const links = [
    { href: '#invitation', label: 'Details',  id: 'invitation' },
    { href: '#schedule',   label: 'Schedule', id: 'schedule' },
    { href: '#story',      label: 'Story',    id: 'story' },
    { href: '#registry',   label: 'Registry', id: 'registry' },
    { href: '#faqs',       label: 'FAQs',     id: 'faqs' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`nav-modern ${scrolled ? 'scrolled' : ''}`}>
        <a href="/" style={{
          fontFamily: "'Fragment Mono', monospace",
          fontSize: '9px',
          fontWeight: 500,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#7a7068',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
          padding: '8px 4px',
          position: 'relative',
          zIndex: 2,
          opacity: 1,
          transition: 'opacity 0.4s ease',
        }}>← Our Room</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px', position: 'relative', zIndex: 2 }}>
          {/* Section links — only revealed once scrolled */}
          <div className="nav-links" style={{
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? 'auto' : 'none',
            transition: 'opacity 0.4s ease',
          }}>
            {links.map(l => (
              <a key={l.id} href={l.href}
                 className={`nav-link-modern ${activeSection === l.id ? 'active' : ''}`}>
                {l.label}
              </a>
            ))}
          </div>
          {/* RSVP — always visible and clickable */}
          <a href="#rsvp" className="nav-link-rsvp">RSVP</a>
        </div>
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>
      {/* Mobile overlay */}
      <div className={`nav-overlay ${menuOpen ? 'open' : ''}`}>
        {links.map(l => (
          <a key={l.id} href={l.href} onClick={closeMenu}>{l.label}</a>
        ))}
        <a href="#rsvp" onClick={closeMenu}>RSVP</a>
      </div>
    </>
  );
}
