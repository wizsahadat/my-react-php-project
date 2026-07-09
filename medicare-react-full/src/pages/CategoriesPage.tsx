import React, { useState, useEffect } from 'react';
import { fetchCategories, Category } from '../data/api';
import Footer from '../components/Footer';

interface CategoriesPageProps {
  onNavigate: (page: string, extra?: any) => void;
}

const categoryIcons: Record<string, string> = {
  'Cardiology': '❤️', 'Allergy': '🤧', 'Neurology': '🧠',
  'Antibiotics': '💊', 'Vitamins': '🍎', 'Respiratory': '🫁',
  'Orthopedic': '🦴', 'Eye Care': '👁️', 'Paracetamol': '💊',
  'Gastroenterologist': '🫀', 'default': '💉'
};
const categoryColors: Record<string, { bg: string; accent: string }> = {
  'Cardiology':       { bg: '#fee2e2', accent: '#ef4444' },
  'Allergy':          { bg: '#fef3c7', accent: '#f59e0b' },
  'Neurology':        { bg: '#ede9fe', accent: '#8b5cf6' },
  'Antibiotics':      { bg: '#fce7f3', accent: '#ec4899' },
  'Vitamins':         { bg: '#d1fae5', accent: '#10b981' },
  'Respiratory':      { bg: '#e0f2fe', accent: '#0ea5e9' },
  'Orthopedic':       { bg: '#fef9c3', accent: '#eab308' },
  'Eye Care':         { bg: '#f3e8ff', accent: '#a855f7' },
  'Gastroenterologist':{ bg: '#ffedd5', accent: '#f97316' },
  'default':          { bg: '#f0fdf4', accent: '#0d9f6e' }
};

const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(cats => { setCategories(cats); setLoading(false); });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fdf9' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1040, #3b1f7a)', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.2)', color: '#a78bfa', borderRadius: 50, padding: '5px 16px', marginBottom: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Browse by Category</div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '0.75rem' }}>Medicine Categories</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>আপনার প্রয়োজন অনুযায়ী medicine খুঁজুন</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => {
              const icon = categoryIcons[cat.name] || categoryIcons.default;
              const colors = categoryColors[cat.name] || categoryColors.default;
              return (
                <button key={cat.category_id}
                  onClick={() => onNavigate('products', { categoryId: cat.category_id })}
                  style={{ background: '#fff', border: '2px solid rgba(13,159,110,0.1)', borderRadius: 24, padding: '2rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 16px 40px ${colors.accent}20`; el.style.borderColor = colors.accent + '50'; el.style.background = colors.bg + '40'; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'none'; el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; el.style.borderColor = 'rgba(13,159,110,0.1)'; el.style.background = '#fff'; }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#0d1117', marginBottom: 6 }}>{cat.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}88)`, width: `${Math.min(100, (cat.medicine_count / 210) * 100)}%` }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#888', flexShrink: 0 }}>{cat.medicine_count}</span>
                    </div>
                  </div>
                  <div style={{ color: colors.accent, fontSize: 20, flexShrink: 0 }}>→</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default CategoriesPage;
