import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      background: 'linear-gradient(160deg, #0a2e1e 0%, #0d4a32 60%, #0a3d28 100%)',
      padding: '4rem 2rem 0',
      color: 'rgba(255,255,255,0.75)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: '3rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20
              }}>🌿</div>
              <span style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: '1.2rem', color: '#fff'
              }}>MediCare Pharmacy</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: 280 }}>
              Bangladesh's most reliable online pharmacy. Genuine medicines, detailed drug info, and fast delivery.
            </p>
          
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              color: '#fff', marginBottom: '1.25rem', fontSize: '0.95rem'
            }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Home', page: 'home' },
                { label: 'Products', page: 'products' },
                { label: 'Categories', page: 'categories' },
                { label: 'AI Assistant', page: 'ai' },
              ].map(link => (
                <button key={link.label}
                  onClick={() => onNavigate(link.page)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: link.page === 'ai' ? '#4ade80' : 'rgba(255,255,255,0.6)',
                    fontSize: '0.88rem', textAlign: 'left', padding: 0,
                    transition: 'color 0.2s', fontFamily: 'DM Sans, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = link.page === 'ai' ? '#4ade80' : 'rgba(255,255,255,0.6)'; }}
                >
                  {link.page === 'ai' && <span style={{ fontSize: 12 }}>✨</span>}
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              color: '#fff', marginBottom: '1.25rem', fontSize: '0.95rem'
            }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Cardiology', 'Antibiotics', 'Neurology', 'Vitamins', 'Respiratory'].map(cat => (
                <button key={cat}
                  onClick={() => onNavigate('categories')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem',
                    textAlign: 'left', padding: 0, transition: 'color 0.2s',
                    fontFamily: 'DM Sans, sans-serif'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >{cat}</button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              color: '#fff', marginBottom: '1.25rem', fontSize: '0.95rem'
            }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📍', text: 'Siddhirgonj, Narayangonj' },
                { icon: '📞', text: '+880 1827505973' },
                { icon: '✉️', text: 'wizsahadat@gmail.com' },
                { icon: '🕐', text: 'Open 24/7' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: '1.25rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)'
        }}>
          <span>© 2026 MediCare Pharmacy — All Rights Reserved</span>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
