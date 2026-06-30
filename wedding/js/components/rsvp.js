/* ── RSVP ── */
const RSVP_ENDPOINT = 'https://bold-glade-8858.kang43.workers.dev/rsvp';

function RSVP() {
  const content = useContent();
  const [form, setForm] = useState({ name: '', email: '', attending: 'yes', guests: '1', note: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  // Gold confetti burst for the thank-you moment — small rectangular flecks
  // that pop radially outward in shades of gold.
  const petals = React.useMemo(() => {
    const colors = ['#B3841A', '#c79a24', '#a67615', '#d8b347', '#e6c965'];
    return Array.from({ length: 38 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 240;
      return {
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist - 50, // slight upward bias
        r: Math.random() * 720 - 360,
        w: 2 + Math.random() * 2,
        h: 7 + Math.random() * 6,
        delay: Math.random() * 0.22,
        duration: 1.1 + Math.random() * 0.9,
        color: colors[i % colors.length],
      };
    });
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || !form.name.trim()) return;
    setStatus('sending');
    try {
      if (RSVP_ENDPOINT) {
        const res = await fetch(RSVP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('bad status');
      }
      setStatus('done');
    } catch (err) {
      setStatus('error');
    }
  };

  const labelStyle = {
    fontFamily: "'Fragment Mono', monospace",
    fontSize: '10px',
    fontWeight: 500,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(248, 245, 240, 0.75)',
    display: 'block',
    marginBottom: '10px',
  };
  const inputStyle = {
    width: '100%',
    padding: '12px 0',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '18px',
    color: '#f8f5f0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(248, 245, 240, 0.4)',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  return (
    <section id="rsvp"
             style={{
               background: '#6b2d3e',
               padding: 'clamp(72px, 10vh, 130px) clamp(24px, 6vw, 80px)',
               position: 'relative',
               overflow: 'hidden',
             }}>
      <img src="images/engagement11.jpg" alt="" aria-hidden="true" className="side-photo"
           style={{ left: 'clamp(8px, 3vw, 60px)', top: '16%' }} />
      <img src="images/engagement10.jpg" alt="" aria-hidden="true" className="side-photo"
           style={{ right: 'clamp(8px, 3vw, 60px)', top: '46%' }} />


      {status === 'done' && (
        <div className="rsvp-petals" aria-hidden="true">
          {petals.map((p, i) => (
            <span key={i} className="rsvp-petal" style={{
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--r': `${p.r}deg`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }} />
          ))}
        </div>
      )}

      <div style={{ maxWidth: '40rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <h2 style={{
          fontFamily: "'Pinyon Script', cursive",
          fontWeight: 400,
          fontSize: 'clamp(56px, 8vw, 96px)',
          color: '#f8f5f0',
          lineHeight: 0.95,
          margin: '0 0 12px 0',
        }}>RSVP</h2>

        {status === 'done' ? (
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 2.4vw, 26px)',
            color: '#f8f5f0',
            lineHeight: 1.6,
            marginTop: '32px',
          }}>
            Thank you — your response has been received.<br />We can’t wait to celebrate with you.
          </p>
        ) : (
          <form onSubmit={submit} style={{
            marginTop: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            textAlign: 'left',
          }}>

            <div>
              <label style={labelStyle} htmlFor="rsvp-name">Full name</label>
              <input id="rsvp-name" type="text" value={form.name} onChange={set('name')}
                     placeholder="Your name" style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle} htmlFor="rsvp-email">Email</label>
              <input id="rsvp-email" type="email" value={form.email} onChange={set('email')}
                     placeholder="you@example.com" style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="rsvp-row">
              <div>
                <label style={labelStyle} htmlFor="rsvp-attending">Attending</label>
                <select id="rsvp-attending" value={form.attending} onChange={set('attending')}
                        style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="yes">Joyfully accepts</option>
                  <option value="no">Regretfully declines</option>
                </select>
              </div>
              <div>
                <label style={labelStyle} htmlFor="rsvp-guests">Guests</label>
                <select id="rsvp-guests" value={form.guests} onChange={set('guests')}
                        style={{ ...inputStyle, cursor: 'pointer' }}>
                  {['1', '2', '3', '4', '5'].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle} htmlFor="rsvp-note">Song request or a note</label>
              <input id="rsvp-note" type="text" value={form.note} onChange={set('note')}
                     placeholder="Optional" style={inputStyle} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <button type="submit" className="magnetic-btn"
                      disabled={status === 'sending'}
                      style={{ cursor: status === 'sending' ? 'default' : 'pointer', opacity: status === 'sending' ? 0.6 : 1 }}>
                {status === 'sending' ? 'Sending…' : 'Send RSVP →'}
              </button>
              {status === 'error' && (
                <p style={{
                  fontFamily: "'Fragment Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  color: '#b08a7a',
                  marginTop: '16px',
                }}>Something went wrong — please try again.</p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
