import React, { useState, useEffect, useRef } from 'react';

/* -------------------------------------------------------------------------
   DriveGuard AI — Premium Landing Page
   A floating panel design with wave SVG graphics and smooth animations.
   Clicking "EXPLORE DRIVEGUARD" enters the main dashboard.
   ------------------------------------------------------------------------- */

export default function LandingPage({ onEnter }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* Trigger entrance animations after mount */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* Close mobile menu on ESC */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const transition = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <div id="landing-root" style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#EEEEEE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(1rem, 3vw, 2.5rem)',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>

      {/* ── Background abstract geometry ── */}
      <BackgroundGeometry />

      {/* ── Main floating panel ── */}
      <div id="landing-panel" style={{
        width: '100%',
        maxWidth: '1140px',
        minHeight: 'min(760px, 92vh)',
        backgroundColor: '#FAFAFA',
        borderRadius: '10px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 2,
      }}>

        {/* ── Panel header / nav ── */}
        <LandingNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} onEnter={onEnter} mounted={mounted} />

        {/* ── Hero content ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(2.5rem, 5vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Badge */}
          <div style={{
            ...transition(0.1),
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.9rem',
            border: '1px solid #CCCCCC',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            color: '#888888',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '2.25rem',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#171717', display: 'inline-block' }} />
            AI-Powered Driver Safety
          </div>

          {/* Main heading */}
          <h1 style={{
            ...transition(0.2),
            fontFamily: "'Manrope', sans-serif",
            fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#111111',
            margin: '0 0 1.25rem',
          }}>
            Stay Alert.<br />Drive Safer.
          </h1>

          {/* Subtitle */}
          <p style={{
            ...transition(0.35),
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)',
            fontWeight: 600,
            color: '#555555',
            letterSpacing: '0.03em',
            margin: '0 0 1rem',
            textTransform: 'uppercase',
          }}>
            Intelligent Driver Safety Monitoring
          </p>

          {/* Description */}
          <p style={{
            ...transition(0.45),
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)',
            color: '#888888',
            lineHeight: 1.7,
            maxWidth: '500px',
            margin: '0 0 2.75rem',
          }}>
            An AI-powered system that monitors driver fatigue and distraction
            in real time, helping make every journey safer.
          </p>

          {/* CTA button */}
          <div style={transition(0.6)}>
            <CTAButton onEnter={onEnter} />
          </div>

          {/* Supporting micro-text */}
          <p style={{
            ...transition(0.75),
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            color: '#AAAAAA',
            marginTop: '1.5rem',
            letterSpacing: '0.02em',
          }}>
            No cloud · On-device · Instant alerts
          </p>
        </div>

        {/* ── Wave graphics (panel bottom) ── */}
        <WaveGraphics />

      </div>
    </div>
  );
}

/* ── Navigation ── */
function LandingNav({ menuOpen, setMenuOpen, onEnter, mounted }) {
  const transition = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transition: `opacity 0.5s ease ${delay}s`,
  });

  const links = ['Home', 'Features', 'About', 'Contact'];

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2rem',
      borderBottom: '1px solid #EBEBEB',
      position: 'relative',
      zIndex: 20,
      backgroundColor: '#FAFAFA',
    }}>
      {/* Logo */}
      <div style={{
        ...transition(0),
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
      }}
        onClick={onEnter}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onEnter(); }}
        aria-label="DriveGuard AI — Go to dashboard"
      >
        <div style={{
          width: '28px', height: '28px',
          backgroundColor: '#111111',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <circle cx="12" cy="12" r="3" fill="white" stroke="white" />
          </svg>
        </div>
        <span style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: '#111111',
          letterSpacing: '-0.01em',
        }}>DriveGuard AI</span>
      </div>

      {/* Desktop nav links */}
      <nav id="landing-desktop-nav" style={{
        ...transition(0.1),
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
      }}>
        {links.map((link, i) => (
          <NavLink key={link} label={link} isActive={link === 'Home'} onClick={link === 'Home' ? undefined : onEnter} />
        ))}
        {/* Hamburger */}
        <button
          id="landing-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            width: '32px', height: '32px',
            background: 'none', border: '1px solid #DDDDDD',
            borderRadius: '5px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '4px', padding: '0',
          }}
        >
          <span style={{ width: '14px', height: '1.5px', backgroundColor: '#555', display: 'block', transition: 'transform 0.2s, opacity 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ width: '14px', height: '1.5px', backgroundColor: '#555', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ width: '14px', height: '1.5px', backgroundColor: '#555', display: 'block', transition: 'transform 0.2s, opacity 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#FAFAFA',
          borderBottom: '1px solid #EBEBEB',
          padding: '1rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          zIndex: 100,
          boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
        }}>
          {links.map((link) => (
            <button
              key={link}
              onClick={() => { setMenuOpen(false); if (link !== 'Home') onEnter(); }}
              style={{
                background: 'none', border: 'none',
                padding: '0.75rem 0',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9375rem',
                fontWeight: link === 'Home' ? 600 : 400,
                color: link === 'Home' ? '#111111' : '#555555',
                cursor: 'pointer',
                textAlign: 'left',
                borderBottom: '1px solid #F0F0F0',
              }}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      {/* Responsive hide/show */}
      <style>{`
        @media (max-width: 600px) {
          #landing-desktop-nav { gap: 1rem !important; }
          #landing-desktop-nav > a { display: none; }
        }
      `}</style>
    </header>
  );
}

/* ── Inline nav link ── */
function NavLink({ label, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        fontWeight: isActive ? 600 : 400,
        color: isActive ? '#111111' : hovered ? '#111111' : '#777777',
        textDecoration: 'none',
        transition: 'color 0.15s',
        borderBottom: isActive ? '1.5px solid #111111' : '1.5px solid transparent',
        paddingBottom: '1px',
      }}
    >
      {label}
    </a>
  );
}

/* ── CTA Button ── */
function CTAButton({ onEnter }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      id="landing-cta-btn"
      onClick={onEnter}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.875rem 2.25rem',
        backgroundColor: hovered ? '#333333' : '#111111',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transform: pressed ? 'scale(0.97) translateY(1px)' : hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 8px 24px rgba(0,0,0,0.22)'
          : '0 2px 8px rgba(0,0,0,0.12)',
        transition: 'background-color 0.15s, transform 0.15s, box-shadow 0.15s',
      }}
    >
      Explore DriveGuard
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/* ── Animated wave SVG graphics ── */
function WaveGraphics() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        borderRadius: '10px',
      }}
    >
      {/* Bottom-left wave cluster */}
      <svg
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-40px',
          width: 'clamp(300px, 45%, 560px)',
          height: 'auto',
          opacity: 0.45,
        }}
        viewBox="0 0 560 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-40 300 C80 260, 160 200, 280 220 S440 280, 600 240" stroke="#AAAAAA" strokeWidth="1.2" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 6 -4; 0 0" dur="8s" repeatCount="indefinite" />
        </path>
        <path d="M-40 275 C100 235, 180 170, 300 190 S460 255, 620 215" stroke="#BBBBBB" strokeWidth="0.9" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -4 6; 0 0" dur="10s" repeatCount="indefinite" />
        </path>
        <path d="M-40 250 C120 210, 200 145, 320 165 S480 230, 640 190" stroke="#CCCCCC" strokeWidth="0.75" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 -3; 0 0" dur="12s" repeatCount="indefinite" />
        </path>
        <path d="M-40 225 C90 185, 170 125, 290 148 S450 215, 610 170" stroke="#BBBBBB" strokeWidth="0.9" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -3 5; 0 0" dur="9s" repeatCount="indefinite" />
        </path>
        <path d="M-40 200 C110 160, 190 100, 310 125 S470 190, 630 150" stroke="#CCCCCC" strokeWidth="0.65" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 4 -6; 0 0" dur="14s" repeatCount="indefinite" />
        </path>
        <path d="M-40 175 C130 140, 210 80, 330 108 S490 165, 650 130" stroke="#DDDDDD" strokeWidth="0.5" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -5 4; 0 0" dur="11s" repeatCount="indefinite" />
        </path>
        <path d="M-40 150 C150 118, 230 60, 350 88 S510 142, 670 110" stroke="#CCCCCC" strokeWidth="0.6" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 3 -5; 0 0" dur="13s" repeatCount="indefinite" />
        </path>
        <path d="M-40 320 C60 285, 150 240, 260 260 S420 300, 580 270" stroke="#999999" strokeWidth="1.4" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -4 -3; 0 0" dur="7s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Bottom-right wave cluster */}
      <svg
        style={{
          position: 'absolute',
          bottom: '-30px',
          right: '-40px',
          width: 'clamp(300px, 45%, 560px)',
          height: 'auto',
          opacity: 0.45,
          transform: 'scaleX(-1)',
        }}
        viewBox="0 0 560 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-40 300 C80 260, 160 200, 280 220 S440 280, 600 240" stroke="#AAAAAA" strokeWidth="1.2" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -5 -4; 0 0" dur="9s" repeatCount="indefinite" />
        </path>
        <path d="M-40 275 C100 235, 180 170, 300 190 S460 255, 620 215" stroke="#BBBBBB" strokeWidth="0.9" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 4 5; 0 0" dur="11s" repeatCount="indefinite" />
        </path>
        <path d="M-40 250 C120 210, 200 145, 320 165 S480 230, 640 190" stroke="#CCCCCC" strokeWidth="0.75" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -4 -3; 0 0" dur="13s" repeatCount="indefinite" />
        </path>
        <path d="M-40 225 C90 185, 170 125, 290 148 S450 215, 610 170" stroke="#BBBBBB" strokeWidth="0.9" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 4; 0 0" dur="8s" repeatCount="indefinite" />
        </path>
        <path d="M-40 200 C110 160, 190 100, 310 125 S470 190, 630 150" stroke="#CCCCCC" strokeWidth="0.65" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -3 -6; 0 0" dur="15s" repeatCount="indefinite" />
        </path>
        <path d="M-40 175 C130 140, 210 80, 330 108 S490 165, 650 130" stroke="#DDDDDD" strokeWidth="0.5" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 3; 0 0" dur="10s" repeatCount="indefinite" />
        </path>
        <path d="M-40 150 C150 118, 230 60, 350 88 S510 142, 670 110" stroke="#CCCCCC" strokeWidth="0.6" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; -4 -5; 0 0" dur="12s" repeatCount="indefinite" />
        </path>
        <path d="M-40 320 C60 285, 150 240, 260 260 S420 300, 580 270" stroke="#999999" strokeWidth="1.4" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 4 -4; 0 0" dur="6s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Center bottom subtle wisp — ties both sides together */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(240px, 40%, 420px)',
          height: 'auto',
          opacity: 0.2,
        }}
        viewBox="0 0 420 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 140 Q105 100, 210 120 T420 100" stroke="#888888" strokeWidth="1" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -6; 0 0" dur="10s" repeatCount="indefinite" />
        </path>
        <path d="M0 120 Q105 80, 210 100 T420 80" stroke="#AAAAAA" strokeWidth="0.75" fill="none">
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" dur="12s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

/* ── Background abstract geometry (outside the panel) ── */
function BackgroundGeometry() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-left circle */}
        <circle cx="6%" cy="10%" r="140" fill="none" stroke="#CCCCCC" strokeWidth="1" opacity="0.7">
          <animate attributeName="r" values="140;148;140" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="6%" cy="10%" r="90" fill="none" stroke="#CCCCCC" strokeWidth="0.75" opacity="0.5">
          <animate attributeName="r" values="90;96;90" dur="14s" repeatCount="indefinite" />
        </circle>

        {/* Top-right half-circle arc */}
        <path d="M 85vw,0 Q 105vw,8vh, 100vw,20vh" fill="none" stroke="#C8C8C8" strokeWidth="1.2" opacity="0.6" />
        <path d="M 88vw,0 Q 108vw,10vh, 103vw,24vh" fill="none" stroke="#D4D4D4" strokeWidth="0.8" opacity="0.4" />

        {/* Bottom-left diagonal line */}
        <line x1="0" y1="90%" x2="12%" y2="100%" stroke="#CCCCCC" strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="84%" x2="8%" y2="100%" stroke="#CCCCCC" strokeWidth="0.75" opacity="0.4" />

        {/* Bottom-right geometric squares */}
        <rect x="90%" y="78%" width="80" height="80" fill="none" stroke="#C8C8C8" strokeWidth="1" opacity="0.4" transform="rotate(20, 90%, 78%)" />
        <rect x="92%" y="82%" width="50" height="50" fill="none" stroke="#CCCCCC" strokeWidth="0.75" opacity="0.3" transform="rotate(20, 92%, 82%)" />

        {/* Center-left subtle cross */}
        <line x1="2%" y1="48%" x2="5%" y2="48%" stroke="#C4C4C4" strokeWidth="1" opacity="0.6" />
        <line x1="3.5%" y1="46%" x2="3.5%" y2="50%" stroke="#C4C4C4" strokeWidth="1" opacity="0.6" />

        {/* Center-right dot grid */}
        {[0, 1, 2].map(r => [0, 1, 2].map(c => (
          <circle
            key={`${r}-${c}`}
            cx={`${91 + c * 2}%`}
            cy={`${44 + r * 2}%`}
            r="1.5"
            fill="#C4C4C4"
            opacity="0.5"
          />
        )))}
      </svg>
    </div>
  );
}
