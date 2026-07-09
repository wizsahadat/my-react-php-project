import React, { useState, useRef, useEffect } from 'react';
import { searchMedicines, Medicine, CartItem } from '../data/api';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onNavigate: (page: string, extra?: any) => void;
  currentPage: string;
  user?: { name: string; email: string; role?: string } | null;
  onLogout?: () => void;
  onOpenRx?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cart, onOpenCart, onOpenLogin, onNavigate, currentPage, user, onLogout, onOpenRx }) => {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<Medicine[]>([]);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(() => { searchMedicines(query).then(setResults); }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(13,159,110,0.12)',
      padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
      height: '72px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)'
    }}>

      {/* Logo */}
      <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #0d9f6e, #076b49)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 12px rgba(13,159,110,0.3)' }}>🌿</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg, #0d9f6e, #076b49)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediCare</div>
          <div style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '0.1em', fontWeight: 600, marginTop: -2 }}>FOR BETTER HEALTH</div>
        </div>
      </button>

      {/* Search */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: 520, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: focused ? '#fff' : '#f7fdf9', border: `2px solid ${focused ? '#0d9f6e' : 'rgba(13,159,110,0.2)'}`, borderRadius: 50, padding: '0 1rem', transition: 'all 0.2s', boxShadow: focused ? '0 0 0 4px rgba(13,159,110,0.1)' : 'none' }}>
          <span style={{ fontSize: 16, marginRight: 8 }}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)}
            placeholder="Generic name বা Brand নাম লিখুন..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '10px 0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#0d1117' }} />
          {query && <button onClick={() => { setQuery(''); setResults([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 18 }}>×</button>}
        </div>
        {focused && results.length > 0 && (
          <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(13,159,110,0.15)', overflow: 'hidden', zIndex: 2000 }}>
            {results.map(m => (
              <button key={m.medicine_id}
                onClick={() => { onNavigate('productDetail', m); setQuery(''); setFocused(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #f0f0f0', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f7fdf9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💊</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0d1117' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{m.generic_name} · {m.company}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 700, color: '#0d9f6e', fontSize: '0.9rem' }}>৳{m.price}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
        {['home', 'products', 'categories'].map(p => (
          <button key={p} onClick={() => onNavigate(p)}
            style={{ background: currentPage === p ? 'rgba(13,159,110,0.1)' : 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: currentPage === p ? '#0d9f6e' : '#4a5568', transition: 'all 0.2s', textTransform: 'capitalize' }}
            onMouseEnter={e => { if (currentPage !== p) e.currentTarget.style.background = '#f7fdf9'; }}
            onMouseLeave={e => { if (currentPage !== p) e.currentTarget.style.background = 'none'; }}
          >{p.charAt(0).toUpperCase() + p.slice(1)}</button>
        ))}
        <button onClick={() => onNavigate('ai')}
          style={{ background: currentPage === 'ai' ? 'linear-gradient(135deg, #0d9f6e, #076b49)' : 'rgba(13,159,110,0.08)', border: `1.5px solid ${currentPage === 'ai' ? 'transparent' : 'rgba(13,159,110,0.3)'}`, cursor: 'pointer', padding: '8px 14px', borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: currentPage === 'ai' ? '#fff' : '#0d9f6e', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 14 }}>✨</span> AI Assistant
        </button>
      </div>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>

        {/* 📷 Prescription Button */}
        <button onClick={onOpenRx} title="প্রেসক্রিপশন পাঠান"
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'linear-gradient(135deg,#6366f1,#4f46e5)', border:'none', borderRadius:11, cursor:'pointer', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.82rem', boxShadow:'0 4px 12px rgba(99,102,241,0.35)', transition:'all 0.2s', flexShrink:0 }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-1px)';}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';}}
        >
          <span style={{ fontSize:17 }}>📷</span>
          <span style={{ whiteSpace:'nowrap' }}>Rx পাঠান</span>
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#f0fdf4', border: '1.5px solid rgba(13,159,110,0.2)', borderRadius: 10, padding: '6px 14px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#0d9f6e' }}>
              👤 {user.name.split(' ')[0]}
            </div>
            <button onClick={onLogout} style={{ background: 'none', border: '1.5px solid #fee2e2', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.78rem', color: '#ef4444', transition: 'all 0.2s' }}>Logout</button>
          </div>
        ) : (
          <button onClick={onOpenLogin}
            style={{ background: 'none', border: '2px solid rgba(13,159,110,0.3)', borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#0d9f6e', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(13,159,110,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >Login</button>
        )}

        <button onClick={onOpenCart}
          style={{ background: 'linear-gradient(135deg, #0d9f6e, #076b49)', border: 'none', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#fff', boxShadow: '0 4px 14px rgba(13,159,110,0.35)', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
          🛒
          {cartCount > 0 && <span style={{ background: '#f43f5e', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{cartCount}</span>}
          Cart
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
