/* ═══════════════════════════════════════════
   CONTENT CONTEXT + PASSWORD GATE
   ═══════════════════════════════════════════ */

// Your Cloudflare Worker endpoint.
const WORKER_URL = 'https://bold-glade-8858.kang43.workers.dev/';
const CONTENT_CACHE_KEY = 'weddingContent';

const WeddingContentContext = React.createContext(null);
function useContent() {
  return React.useContext(WeddingContentContext);
}

/* Try to restore previously unlocked content for this browser session so a
   reload doesn't re-prompt for the password. */
function loadCachedContent() {
  try {
    const raw = sessionStorage.getItem(CONTENT_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function cacheContent(content) {
  try {
    sessionStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(content));
  } catch (e) {
    /* ignore quota / privacy-mode errors */
  }
}

/* ── Password Gate ── */
function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'loading' || !password.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setStatus('error');
        setErrorMsg('That password didn\u2019t work. Try again?');
        return;
      }
      if (!res.ok) {
        setStatus('error');
        setErrorMsg('Something went wrong. Please try again.');
        return;
      }
      const content = await res.json();
      cacheContent(content);
      onUnlock(content);
    } catch (err) {
      setStatus('error');
      setErrorMsg('Couldn\u2019t reach the server. Check your connection.');
    }
  };

  return (
    <section style={{
      minHeight: '100vh',
      background: '#f8f5f0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(24px, 6vw, 80px)',
      textAlign: 'center',
    }}>
      <span style={{
        fontFamily: "'Pinyon Script', cursive",
        fontSize: 'clamp(64px, 12vw, 110px)',
        color: '#1a1714',
        lineHeight: 0.9,
        marginBottom: '8px',
      }}>I&amp;L</span>

      <span className="eyebrow" style={{ marginBottom: '28px' }}>Please enter the password</span>

      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontStyle: 'italic',
        fontSize: 'clamp(18px, 2.4vw, 24px)',
        color: '#7a7068',
        maxWidth: '32rem',
        lineHeight: 1.6,
        margin: '0 0 36px 0',
      }}>
        The details of our celebration are just behind this little door.
      </p>

      <form onSubmit={submit} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
        width: '100%',
        maxWidth: '360px',
      }}>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder="Password"
          autoComplete="off"
          style={{
            width: '100%',
            padding: '14px 18px',
            fontFamily: "'Fragment Mono', monospace",
            fontSize: '13px',
            letterSpacing: '0.15em',
            textAlign: 'center',
            color: '#1a1714',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${status === 'error' ? '#b08a7a' : '#c8bfb5'}`,
            outline: 'none',
            transition: 'border-color 0.3s ease',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="magnetic-btn"
          style={{
            cursor: status === 'loading' ? 'default' : 'pointer',
            opacity: status === 'loading' ? 0.6 : 1,
          }}>
          {status === 'loading' ? 'Unlocking\u2026' : 'Enter →'}
        </button>

        <span style={{
          fontFamily: "'Fragment Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: '#b08a7a',
          minHeight: '16px',
          opacity: status === 'error' ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}>{errorMsg || '\u00A0'}</span>
      </form>
    </section>
  );
}
