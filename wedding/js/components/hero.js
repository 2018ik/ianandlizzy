/* ── Monogram Hero ── */
function MonogramHero() {
  const [ready, setReady] = useState(false);
  const cardRef = useRef(null);
  const monogramRef = useRef(null);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Watercolor drag-paint effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let rafId = null;

    // Resize canvas to match section
    const resize = () => {
      const r = section.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    // Fade loop — very slowly clear the canvas each frame
    let fadeAlpha = 0;
    const fade = () => {
      if (fadeAlpha > 0) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
        fadeAlpha = Math.max(0, fadeAlpha - 0.004);
      }
      rafId = requestAnimationFrame(fade);
    };
    rafId = requestAnimationFrame(fade);

    // Bloom colors — warm watercolor palette
    const blooms = [
      'rgba(210, 180, 165, 0.08)',
      'rgba(190, 155, 140, 0.07)',
      'rgba(232, 207, 201, 0.09)',
      'rgba(200, 170, 150, 0.06)',
      'rgba(220, 195, 175, 0.08)',
    ];

    const paintBloom = (x, y) => {
      const color = blooms[Math.floor(Math.random() * blooms.length)];
      const r = 40 + Math.random() * 60;
      const wobbleX = x + (Math.random() - 0.5) * 18;
      const wobbleY = y + (Math.random() - 0.5) * 18;

      ctx.globalCompositeOperation = 'source-over';
      const grad = ctx.createRadialGradient(wobbleX, wobbleY, 0, wobbleX, wobbleY, r);
      grad.addColorStop(0, color);
      grad.addColorStop(0.4, color.replace(/[\d.]+\)$/, '0.04)'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Slight ellipse wobble for organic feel
      ctx.ellipse(wobbleX, wobbleY, r * (0.85 + Math.random() * 0.3), r * (0.85 + Math.random() * 0.3), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    };

    const getPos = (e) => {
      const rect = section.getBoundingClientRect();
      if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e) => {
      isDragging = true;
      const { x, y } = getPos(e);
      lastX = x; lastY = y;
      // Start fading slowly when dragging
      fadeAlpha = 0.03;
      paintBloom(x, y);
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const { x, y } = getPos(e);
      const dist = Math.hypot(x - lastX, y - lastY);
      // Paint every ~12px of movement
      if (dist > 12) {
        const steps = Math.ceil(dist / 12);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          paintBloom(lastX + (x - lastX) * t, lastY + (y - lastY) * t);
        }
        lastX = x; lastY = y;
      }
    };

    const onUp = () => {
      isDragging = false;
      // Fade out gently after release
      fadeAlpha = 0.06;
    };

    section.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    section.addEventListener('touchstart', onDown, { passive: true });
    section.addEventListener('touchmove', onMove, { passive: true });
    section.addEventListener('touchend', onUp);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
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
  const verses = [
    { text: "Let him kiss me with the kisses of his mouth: for thy love is better than wine.", ref: "1:2" },
    { text: "Draw me, we will run after thee.", ref: "1:4" },
    { text: "I am my beloved's and my beloved is mine.", ref: "6:3" },
    { text: "Come, my beloved, let us go forth into the field... there will I give thee my loves.", ref: "7:12" },
    { text: "Who is this that cometh up from the wilderness, leaning upon her beloved?", ref: "8:5" },
  ];
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '56px',
      paddingBottom: '48px',
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
    }}>

      {/* Watercolor paint canvas — sits behind all content, events captured by section */}
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

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
          fontFamily: "'Space Grotesk', sans-serif",
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
          color: '#1a1714',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          opacity: ready ? 1 : 0,
          transform: ready ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease 1.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 1.1s',
        }}>
          {Math.max(0, Math.floor((new Date('2026-10-11') - new Date()) / 86400000))}
        </span>
      </div>

      {/* Top meta row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '420px',
        padding: '0 4px',
        marginBottom: '28px',
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#b0a898',
        }}>Ian &amp; Lizzy</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '10px',
          fontWeight: 300,
          letterSpacing: '0.2em',
          color: '#b0a898',
        }}>Oct 11, 2026</span>
      </div>

      {/* Portrait card — tilt-3D wrapper */}
      <div ref={cardRef} style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        opacity: ready ? 1 : 0,
        willChange: 'transform',
        transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
      }}>
        {/* Photo */}
        <img
          src="images/2.webp"
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
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '9px',
            fontWeight: 300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(248,245,240,0.5)',
            writingMode: 'vertical-rl',
            paddingBottom: '4px',
          }}>Washington, D.C.</span>
        </div>
      </div>

      {/* Marquee band */}
      {(() => {
        const items = [
          "I am my beloved's and my beloved is mine",
          "Ian & Lizzy",
          "Draw me, we will run after thee",
          "October 11 · 2026",
          "Let him kiss me with the kisses of his mouth",
          "Washington, D.C.",
          "Come, my beloved, let us go forth",
          "Ian & Lizzy",
          "Who is this that cometh up from the wilderness",
          "October 11 · 2026",
        ];
        const sep = <span style={{
          display: 'inline-block',
          margin: '0 28px',
          color: '#c8bfb5',
          fontSize: '8px',
          verticalAlign: 'middle',
        }}>✦</span>;
        const row = items.map((t, i) => (
          <span key={i} style={{
            fontFamily: i % 2 === 0 ? "'Fraunces', Georgia, serif" : "'Space Grotesk', sans-serif",
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
        fontFamily: "'Fraunces', Georgia, serif",
        fontWeight: 300,
        fontStyle: 'italic',
        fontSize: '18px',
        color: '#7a7068',
        marginTop: '24px',
        letterSpacing: '0.02em',
        opacity: ready ? 1 : 0,
        transform: ready ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s',
      }}>
        Welcome, [Guest name]!
      </p>

      {/* Scroll indicator */}
      <div className="scroll-indicator-v" style={{
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.6s ease 1s',
      }}>
        <span>Scroll</span>
        <div className="scroll-indicator-line" />
      </div>
    </section>
  );
}
