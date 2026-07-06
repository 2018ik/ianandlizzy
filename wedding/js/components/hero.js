function getCalendarDaysUntil(dateString) {
  const [year, month, day] = String(dateString || '').split('-').map(Number);
  if (!year || !month || !day) return 0;

  const now = new Date();
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const targetUtc = Date.UTC(year, month - 1, day);

  return Math.max(0, Math.round((targetUtc - todayUtc) / 86400000));
}

/* ── Monogram Hero ── */
function MonogramHero() {
  const content = useContent();
  const daysAway = getCalendarDaysUntil(content.meta.countdownDate);
  const [ready, setReady] = useState(false);
  // Transient "drag to paint" hint — appears near the cursor after the visitor
  // has hovered the canvas for ~2s without painting, then fades away.
  const [paintHint, setPaintHint] = useState(false);
  const cardRef = useRef(null);
  const monogramRef = useRef(null);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Cursor-following hint: reveal after a 2s dwell over the section, follow the
  // cursor while shown, and dismiss for good once the visitor paints (or leaves).
  useEffect(() => {
    const section = sectionRef.current;
    const hintEl = hintRef.current;
    if (!section || !hintEl) return;

    let showTimer = null;
    let hideTimer = null;
    let started = false;
    let dismissed = false;

    const place = (e) => {
      hintEl.style.left = `${e.clientX}px`;
      hintEl.style.top = `${e.clientY}px`;
    };
    const onMove = (e) => {
      place(e);
      if (dismissed || started) return;
      started = true;
      showTimer = setTimeout(() => {
        setPaintHint(true);
        hideTimer = setTimeout(() => { setPaintHint(false); dismissed = true; }, 8000);
      }, 1000);
    };
    const onLeave = () => {
      clearTimeout(showTimer);
      started = false;
      setPaintHint(false);
    };
    const onDown = () => {
      dismissed = true;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      setPaintHint(false);
    };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    section.addEventListener('mousedown', onDown);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      section.removeEventListener('mousedown', onDown);
    };
  }, []);

  // Monet brush-reveal effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let rafId = null;

    const BG = '#f8f5f0';

    // Fill canvas with background color to hide Monet beneath
    const resize = () => {
      const r = section.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    // Fade loop — slowly re-covers revealed areas with background
    let fadeAlpha = 1.0;
    let isVisible = true;
    const fade = () => {
      if (!isVisible) { rafId = null; return; }
      if (fadeAlpha > 0) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(248,245,240,${fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        fadeAlpha = Math.max(0, fadeAlpha - 0.3);
      }
      rafId = requestAnimationFrame(fade);
    };
    const visObs = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) rafId = requestAnimationFrame(fade);
    }, { threshold: 0 });
    visObs.observe(section);
    rafId = requestAnimationFrame(fade);

    // Paint a directional brushstroke that erases the background to reveal Monet
    const paintBrush = (x, y, dx, dy) => {
      const angle = Math.atan2(dy, dx);
      const speed = Math.hypot(dx, dy);
      const len = Math.max(58, Math.min(200, speed * 3.5));
      const width = 8 + Math.random() * 30;

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Core stroke — soft radial gradient gives feathered edge
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, len);
      grad.addColorStop(0,   'rgba(0,0,0,0.14)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.06)');
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, len, width * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bristle strands — scattered thin ellipses that fan out from the stroke
      for (let i = 0; i < 5; i++) {
        const ox = (Math.random() - 0.5) * len * 0.5;
        const oy = (Math.random() - 0.5) * width * 0.5;
        const bLen = len * (0.15 + Math.random() * 0.25);
        const bW   = 1 + Math.random() * 1.5;
        ctx.globalAlpha = 0.12 + Math.random() * 0.11;
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.ellipse(ox, oy, bLen, bW, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const canAutoPaint = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autoPaintTimers = [];
    const paintAutoStroke = (points) => {
      let delay = 0;
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1];
        const [x2, y2] = points[i];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / 18));
        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          autoPaintTimers.push(setTimeout(() => {
            paintBrush(x1 + dx * t, y1 + dy * t, dx, dy);
            fadeAlpha = 0.02;
          }, delay));
          delay += 18;
        }
      }
    };

    if (canAutoPaint) {
      autoPaintTimers.push(setTimeout(() => {
        const w = canvas.width;
        const h = canvas.height;
        paintAutoStroke([
          [w * 0.12, h * 0.34],
          [w * 0.24, h * 0.34],
          [w * 0.38, h * 0.34],
          [w * 0.52, h * 0.34],
        ]);
      }, 520));
      autoPaintTimers.push(setTimeout(() => {
        const w = canvas.width;
        const h = canvas.height;
        paintAutoStroke([
          [w * 0.58, h * 0.67],
          [w * 0.70, h * 0.67],
          [w * 0.82, h * 0.67],
          [w * 0.92, h * 0.67],
        ]);
      }, 980));
    }

    const getPos = (e) => {
      const rect = section.getBoundingClientRect();
      if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e) => {
      isDragging = true;
      const { x, y } = getPos(e);
      lastX = x; lastY = y;
      fadeAlpha = 0.02;
      paintBrush(x, y, 1, 0);
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const { x, y } = getPos(e);
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist > 8) {
        const steps = Math.ceil(dist / 8);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          paintBrush(lastX + dx * t, lastY + dy * t, dx, dy);
        }
        lastX = x; lastY = y;
        fadeAlpha = 0.01;
      }
    };

    const onUp = () => {
      isDragging = false;
      fadeAlpha = 0.05;
    };

    section.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    section.addEventListener('touchstart', onDown, { passive: true });
    section.addEventListener('touchmove', onMove, { passive: true });
    section.addEventListener('touchend', onUp);

    return () => {
      cancelAnimationFrame(rafId);
      autoPaintTimers.forEach(clearTimeout);
      ro.disconnect();
      visObs.disconnect();
      section.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      section.removeEventListener('touchstart', onDown);
      section.removeEventListener('touchmove', onMove);
      section.removeEventListener('touchend', onUp);
    };
  }, []);

  // Tilt-3D on mouse move
  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const mono = monogramRef.current;
    if (!section || !card || !mono) return;

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 8;
      const rotY = dx * 8;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.transition = 'transform 0.1s ease';
      // Monogram moves opposite direction for parallax depth
      mono.style.transform = `translate(${-dx * 10}px, ${-dy * 6}px)`;
      mono.style.transition = 'transform 0.1s ease';
    };

    const handleLeave = () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
      mono.style.transform = 'translate(0px, 0px)';
      mono.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, [ready]);

  // Cycling verses
  const verses = content.hero.verses;
  const [verseIdx, setVerseIdx] = useState(0);
  const [verseKey, setVerseKey] = useState(0);
  const advanceLock = useRef(false);

  const advanceVerse = () => {
    if (advanceLock.current) return;
    advanceLock.current = true;
    setVerseIdx(i => (i + 1) % verses.length);
    setVerseKey(k => k + 1);
    setTimeout(() => { advanceLock.current = false; }, 450);
  };

  return (
    <section id="home" ref={sectionRef} style={{
      background: '#f8f5f0',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* Monet background — revealed by brush strokes */}
      <img
        src="images/monet.jpg"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Brush reveal canvas — initialized opaque, erased on paint to reveal Monet */}
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Transient hint — appears near the cursor after a short dwell. Fixed to
          the viewport and offset down-right of the pointer. */}
      <div ref={hintRef} className="ui-hint" style={{
        position: 'fixed',
        left: 0,
        top: 0,
        marginLeft: '44px',
        marginTop: '20px',
        zIndex: 60,
        color: '#9c8d7e',
        textShadow: '0 1px 6px rgba(248, 245, 240, 0.9)',
        opacity: paintHint ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        drag to paint
      </div>

      {/* Content layer — sits above the Monet canvas */}
      <div className="hero-content" style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '56px',
        paddingBottom: '48px',
      }}>

      {/* Right panel — days remaining, large sculptural number */}
      <div style={{
        position: 'absolute',
        right: 'clamp(20px, 4vw, 64px)',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '10px',
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.2s ease 0.9s',
      }} className="hero-side-panel">
        {/* Rotated label */}
        <span style={{
          fontFamily: "'Fragment Mono', monospace",
          fontSize: '8px',
          fontWeight: 500,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#b0a898',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          userSelect: 'none',
        }}>Days Away</span>
        {/* Large number */}
        <span style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(56px, 7vw, 96px)',
          color: '#6b2d3e',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease 1.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 1.1s',
        }}>
          {daysAway}
        </span>
      </div>

      {/* Top meta row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: 'min(600px, calc((100vh - 260px) * 0.75))',
        padding: '0 4px',
        marginBottom: '28px',
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>
        <span style={{
          fontFamily: "'Fragment Mono', monospace",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#b0a898',
        }}>{content.meta.names}</span>
        <span style={{
          fontFamily: "'Fragment Mono', monospace",
          fontSize: '10px',
          fontWeight: 300,
          letterSpacing: '0.2em',
          color: '#b0a898',
        }}>{content.meta.dateLabel}</span>
      </div>

      {/* Portrait card — tilt-3D wrapper */}
      <div ref={cardRef} style={{
        position: 'relative',
        width: '100%',
        maxWidth: 'min(600px, calc((100vh - 260px) * 0.75))',
        opacity: ready ? 1 : 0,
        willChange: 'transform',
        transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
      }}>
        {/* Photo */}
        <img
          src="images/engagement1.jpg"
          alt="Ian and Lizzy"
          style={{
            display: 'block',
            width: '100%',
            aspectRatio: '3/4',
            objectFit: 'cover',
            objectPosition: 'center top',
            pointerEvents: 'none',
          }}
        />

        {/* Gradient overlay — stays fixed to card */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '80px 28px 20px',
          background: 'linear-gradient(to top, rgba(26,23,20,0.72) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
          {/* Monogram — moves opposite on tilt for parallax depth */}
          <span ref={monogramRef} style={{
            fontSize: 'clamp(72px, 16vw, 120px)',
            lineHeight: 0.85,
            userSelect: 'none',
            willChange: 'transform',
            display: 'inline-block',
          }}>
            <span style={{
              fontFamily: "'Pinyon Script', cursive",
              color: 'rgba(248,245,240,0.95)',
              position: 'relative',
              zIndex: 1,
            }}>I</span><span style={{
              fontFamily: "'Luxurious Script', cursive",
              color: 'rgba(248,245,240,0.95)',
              marginLeft: '-0.28em',
              position: 'relative',
              zIndex: 0,
            }}>L</span>
          </span>
          <span style={{
            fontFamily: "'Fragment Mono', monospace",
            fontSize: '9px',
            fontWeight: 300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(248,245,240,0.5)',
            writingMode: 'vertical-rl',
            paddingBottom: '4px',
          }}>{content.meta.location}</span>
        </div>
      </div>

      {/* Marquee band */}
      {(() => {
        const items = content.hero.marquee;
        const sep = <span style={{
          display: 'inline-block',
          margin: '0 28px',
          color: '#c8bfb5',
          fontSize: '8px',
          verticalAlign: 'middle',
        }}>✦</span>;
        const row = items.map((t, i) => (
          <span key={i} style={{
            fontFamily: i % 2 === 0 ? "'Cormorant Garamond', Georgia, serif" : "'Fragment Mono', monospace",
            fontStyle: i % 2 === 0 ? 'italic' : 'normal',
            fontWeight: 300,
            fontSize: i % 2 === 0 ? '13px' : '9px',
            letterSpacing: i % 2 === 0 ? '0.01em' : '0.3em',
            textTransform: i % 2 === 0 ? 'none' : 'uppercase',
            color: '#7a7068',
            verticalAlign: 'middle',
          }}>{t}{sep}</span>
        ));
        return (
          <div className="marquee-wrap" style={{
            width: '100%',
            marginTop: '28px',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.8s ease 0.6s',
          }}>
            <div className="marquee-track">
              {row}{row}
            </div>
          </div>
        );
      })()}

      {/* Bottom caption */}
      <p style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 300,
        fontStyle: 'italic',
        fontSize: '20px',
        color: '#7a7068',
        marginTop: '24px',
        letterSpacing: '0.02em',
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s',
      }}>
        {content.hero.guestGreeting}
      </p>

      {/* Mobile-only scroll hint — sits under the greeting */}
      <div className="hero-scroll-mobile" style={{
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.8s ease 0.7s',
      }}>
        <span>Scroll</span>
        <span className="hero-scroll-caret" aria-hidden="true">⌄</span>
      </div>

      {/* Scroll indicator */}
      {/* <div className="scroll-indicator-v" style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.6s ease 1s',
      }}>
        <span>Scroll</span>
        <div className="scroll-indicator-line" />
      </div> */}

      </div>{/* end content layer */}
    </section>
  );
}
