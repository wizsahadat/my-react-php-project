import React, { useState, useEffect } from 'react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const slides = [
  {
    title: 'Your Health,',
    titleAccent: 'Our Priority',
    subtitle: 'Genuine medicines, and fast doorstep delivery',
    bg: 'linear-gradient(135deg, #0a2e1e 0%, #0d4a32 50%, #125e40 100%)',
    accent: '#0d9f6e',
    emoji: '💊',
    pattern: 'pills'
  },
  {
    title: 'Certified',
    titleAccent: 'Medicines Only',
    subtitle: 'Sourced directly from licensed pharmaceutical companies',
    bg: 'linear-gradient(135deg, #1a1040 0%, #2d1b69 50%, #3b1f7a 100%)',
    accent: '#8b5cf6',
    emoji: '🛡️',
    pattern: 'shield'
  },
  {
    title: 'Fast Delivery',
    titleAccent: 'To Your Door',
    subtitle: '24hrs in Dhaka · 72hrs nationwide — reliable and tracked',
    bg: 'linear-gradient(135deg, #1a0d00 0%, #431407 50%, #7c2d12 100%)',
    accent: '#f97316',
    emoji: '🚚',
    pattern: 'truck'
  }
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[active];

  return (
    <section style={{
      position: 'relative',
      minHeight: '88vh',
      background: slide.bg,
      transition: 'background 0.8s ease',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, ${slide.accent}22 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, ${slide.accent}15 0%, transparent 40%)`,
        transition: 'all 0.8s ease'
      }} />

      {/* Floating pills decoration */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: `${20 + (i % 4) * 15}px`,
          height: `${10 + (i % 3) * 6}px`,
          borderRadius: '50%',
          background: `${slide.accent}${['22', '18', '15', '10'][i % 4]}`,
          left: `${(i * 8.3) % 100}%`,
          top: `${(i * 13.7 + 10) % 90}%`,
          animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
          animationDelay: `${i * 0.3}s`
        }} />
      ))}

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1200, margin: '0 auto', padding: '0 2rem',
        width: '100%'
      }}>
        <div style={{ maxWidth: 700 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${slide.accent}22`,
            border: `1px solid ${slide.accent}44`,
            borderRadius: 50, padding: '6px 16px', marginBottom: '1.5rem',
            animation: 'fadeUp 0.6s ease both'
          }}>
            <span style={{ fontSize: 14 }}>{slide.emoji}</span>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: '0.75rem', color: slide.accent, letterSpacing: '0.08em'
            }}>MEDICARE PHARMACY</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 1.1, color: '#fff',
            marginBottom: '0.5rem',
            animation: 'fadeUp 0.6s ease 0.1s both'
          }}>
            {slide.title}
          </h1>
          <h1 style={{
            fontFamily: 'Instrument Serif, serif', fontStyle: 'italic',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 1.1, color: slide.accent,
            marginBottom: '1.5rem',
            animation: 'fadeUp 0.6s ease 0.2s both'
          }}>
            {slide.titleAccent}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.75)', marginBottom: '2.5rem',
            lineHeight: 1.6, maxWidth: 500,
            animation: 'fadeUp 0.6s ease 0.3s both'
          }}>
            {slide.subtitle}
          </p>

          <div style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap',
            animation: 'fadeUp 0.6s ease 0.4s both'
          }}>
            <button onClick={() => onNavigate('products')} style={{
              background: slide.accent,
              border: 'none', borderRadius: 14,
              padding: '14px 28px', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: '0.95rem', color: '#fff',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: `0 8px 24px ${slide.accent}50`,
              transition: 'all 0.25s'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              💊 Browse Medicines
            </button>
            <button onClick={() => onNavigate('categories')} style={{
              background: 'rgba(255,255,255,0.12)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: 14, padding: '12px 28px', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: '0.95rem', color: '#fff',
              display: 'flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.25s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            >
              📋 View Categories
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '2rem', marginTop: '4rem',
          flexWrap: 'wrap',
          animation: 'fadeUp 0.6s ease 0.5s both'
        }}>
          {[
            { num: '900+', label: 'Medicines' },
            { num: '10', label: 'Categories' },
            { num: '24hr', label: 'Dhaka Delivery' },
            { num: '100%', label: 'Genuine' }
          ].map(stat => (
            <div key={stat.label}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: '1.8rem', color: slide.accent
              }}>{stat.num}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 8
      }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? 28 : 8,
            height: 8, borderRadius: 4,
            background: i === active ? slide.accent : 'rgba(255,255,255,0.3)',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
    </section>
  );
};

export default Hero;
