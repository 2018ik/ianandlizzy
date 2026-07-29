/* ── RSVP ── */
const RSVP_ENDPOINT = 'https://bold-glade-8858.kang43.workers.dev/rsvp';

function RSVPDropdown({ id, value, options, onChange, inputStyle, placeholder = 'Select one' }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div
      className="rsvp-dropdown"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        id={id}
        type="button"
        className="rsvp-dropdown-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        style={inputStyle}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className="rsvp-dropdown-chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="rsvp-dropdown-menu" role="listbox" aria-labelledby={id}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className="rsvp-dropdown-option"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RSVP() {
  const content = useContent();
  const [form, setForm] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    churchMeeting: 'unsure',
    note: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [errorMessage, setErrorMessage] = useState('');
  const errorRef = React.useRef(null);

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

  React.useEffect(() => {
    if (status === 'error' && errorRef.current) {
      errorRef.current.focus();
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status, errorMessage]);

  const clearError = () => {
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const set = (k) => (e) => {
    clearError();
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };
  const setValue = (k) => (value) => {
    clearError();
    setForm((f) => ({ ...f, [k]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || !form.name.trim() || !form.attending) return;
    setStatus('sending');
    setErrorMessage('');
    try {
      if (RSVP_ENDPOINT) {
        const res = await fetch(RSVP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          let message = 'Something went wrong — please try again.';
          try {
            const data = await res.json();
            if (data && data.error) message = data.error;
          } catch (parseError) {
            // Keep the default message if the Worker does not return JSON.
          }
          throw new Error(message);
        }
      }
      setStatus('done');
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong — please try again.');
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
      <div className="oval-border-container"  style={{ left: 'clamp(8px, 3vw, 60px)', top: '16%' }}>
        <img src="images/engagement11.jpg" alt="" aria-hidden="true" className="side-photo oval-photo"
           />
      </div>
      <div className="oval-border-container" style={{ right: 'clamp(8px, 3vw, 60px)', top: '46%' }}>
        <img src="images/engagement10.jpg" alt="" aria-hidden="true" className="side-photo oval-photo"
            />
      </div>

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

      <div style={{ maxWidth: '60rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

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
              <label style={labelStyle} htmlFor="rsvp-name">Full name <span aria-hidden="true">*</span></label>
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
                <label style={labelStyle} htmlFor="rsvp-attending">Attending <span aria-hidden="true">*</span></label>
                <RSVPDropdown
                  id="rsvp-attending"
                  value={form.attending}
                  onChange={setValue('attending')}
                  inputStyle={inputStyle}
                  placeholder="Please choose"
                  options={[
                    { value: 'yes', label: 'Joyfully accepts' },
                    { value: 'no', label: 'Regretfully declines' },
                  ]}
                />
                <input
                  tabIndex="-1"
                  aria-hidden="true"
                  value={form.attending}
                  onChange={() => {}}
                  required
                  style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="rsvp-guests">Guests</label>
                <RSVPDropdown
                  id="rsvp-guests"
                  value={form.guests}
                  onChange={setValue('guests')}
                  inputStyle={inputStyle}
                  options={['1', '2'].map((n) => ({ value: n, label: n }))}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle} htmlFor="rsvp-church-meeting">Will you attend the church wedding meeting on October 17?</label>
              <RSVPDropdown
                id="rsvp-church-meeting"
                value={form.churchMeeting}
                onChange={setValue('churchMeeting')}
                inputStyle={inputStyle}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                  { value: 'unsure', label: 'Not sure yet' },
                ]}
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="rsvp-note">Song request or a note</label>
              <input id="rsvp-note" type="text" value={form.note} onChange={set('note')}
                     placeholder="Optional" style={inputStyle} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              {status === 'error' && (
                <div
                  ref={errorRef}
                  role="alert"
                  tabIndex="-1"
                  style={{
                    maxWidth: '44rem',
                    margin: '0 auto 24px',
                    padding: '18px 20px',
                    textAlign: 'left',
                    background: '#f8f5f0',
                    border: '2px solid #d8b347',
                    boxShadow: '0 18px 45px rgba(0, 0, 0, 0.2)',
                    outline: 'none',
                  }}
                >
                  <p style={{
                    fontFamily: "'Fragment Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#6b2d3e',
                    margin: '0 0 10px',
                  }}>RSVP not sent</p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '20px',
                    lineHeight: 1.45,
                    color: '#321923',
                    margin: 0,
                  }}>{errorMessage || 'Something went wrong. Please check your RSVP and try again.'}</p>
                </div>
              )}
              <button type="submit" className="magnetic-btn"
                      disabled={status === 'sending'}
                      style={{ cursor: status === 'sending' ? 'default' : 'pointer', opacity: status === 'sending' ? 0.6 : 1 }}>
                {status === 'sending' ? 'Sending…' : status === 'error' ? 'Try again →' : 'Send RSVP →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
