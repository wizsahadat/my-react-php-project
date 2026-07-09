import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchFeatured, Category, Medicine, CartItem } from '../data/api';
import MedicineCard from '../components/MedicineCard';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

interface HomePageProps {
  onNavigate: (page: string, extra?: any) => void;
  onAddToCart: (item: CartItem) => void;
}

const categoryIcons: Record<string, string> = {
  'Cardiology': '❤️', 'Allergy': '🤧', 'Neurology': '🧠',
  'Antibiotics': '💊', 'Vitamins': '🍎', 'Respiratory': '🫁',
  'Orthopedic': '🦴', 'Eye Care': '👁️', 'Paracetamol': '💊',
  'Gastroenterologist': '🫀', 'Diabetes': '🩺', 'default': '💉'
};
const categoryColors: Record<string, string> = {
  'Cardiology': '#fee2e2', 'Allergy': '#fef3c7', 'Neurology': '#ede9fe',
  'Antibiotics': '#fce7f3', 'Vitamins': '#d1fae5', 'Respiratory': '#e0f2fe',
  'Orthopedic': '#fef9c3', 'Eye Care': '#f3e8ff', 'default': '#f0fdf4'
};

const features = [
  { icon: '🛡️', title: '100% Genuine Medicines', desc: 'সরকার অনুমোদিত, licensed companies থেকে সংগৃহীত সকল medicine।', color: '#0d9f6e', bg: '#d1fae5' },
  { icon: '📋', title: 'Detailed Drug Information', desc: 'Dosage, side effects, contraindications, generic name সহ বিস্তারিত তথ্য।', color: '#8b5cf6', bg: '#ede9fe' },
  { icon: '🚚', title: 'Fast Home Delivery', desc: 'ঢাকায় ২৪ ঘণ্টা এবং অন্যান্য শহরে ৭২ ঘণ্টার মধ্যে নিশ্চিত delivery।', color: '#f97316', bg: '#ffedd5' },
  { icon: '🔍', title: 'Smart Search', desc: 'Generic name বা brand name দিয়ে দ্রুত medicine খুঁজুন।', color: '#0ea5e9', bg: '#e0f2fe' },
  { icon: '👨‍⚕️', title: 'Pharmacist Consultation', desc: 'Expert pharmacist থেকে পরামর্শ নিন বিনামূল্যে।', color: '#ec4899', bg: '#fce7f3' },
  { icon: '🔒', title: 'Secure Payments', desc: 'bKash, Nagad, Card সহ নিরাপদ payment options।', color: '#10b981', bg: '#d1fae5' },
];

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onAddToCart }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchFeatured()]).then(([cats, meds]) => {
      setCategories(cats);
      setFeatured(meds);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero onNavigate={onNavigate} />

      {/* Categories */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(13,159,110,0.1)', color: '#0d9f6e', borderRadius: 50, padding: '5px 16px', marginBottom: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Browse by Category</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0d1117', marginBottom: '0.75rem' }}>Medicine Categories</h2>
            <p style={{ color: '#888' }}>আপনার প্রয়োজন অনুযায়ী medicine খুঁজুন</p>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {categories.map((cat) => {
                const icon = categoryIcons[cat.name] || categoryIcons.default;
                const color = categoryColors[cat.name] || categoryColors.default;
                return (
                  <button key={cat.category_id}
                    onClick={() => onNavigate('products', { categoryId: cat.category_id })}
                    style={{ background: '#fff', border: '2px solid rgba(13,159,110,0.1)', borderRadius: 20, padding: '1.5rem 1rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s' }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 16px 36px rgba(13,159,110,0.15)'; el.style.background = color; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.transform = 'none'; el.style.boxShadow = 'none'; el.style.background = '#fff'; }}
                  >
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: color, margin: '0 auto 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{icon}</div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#0d1117', marginBottom: 4 }}>{cat.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>{cat.medicine_count} medicines</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: '5rem 2rem', background: '#f7fdf9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(13,159,110,0.1)', color: '#0d9f6e', borderRadius: 50, padding: '5px 16px', marginBottom: '0.75rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Featured</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#0d1117' }}>Popular Medicines</h2>
              <p style={{ color: '#888', marginTop: 4 }}>Click করুন — Dosage, Side Effects, Generic Name সহ বিস্তারিত দেখুন</p>
            </div>
            <button onClick={() => onNavigate('products')} style={{ background: 'none', border: '2px solid #0d9f6e', borderRadius: 12, padding: '10px 20px', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#0d9f6e', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0d9f6e'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#0d9f6e'; }}
            >View All →</button>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading medicines...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {featured.length > 0 ? featured.map(m => (
                <MedicineCard key={m.medicine_id} medicine={m} onAddToCart={onAddToCart} onView={(med) => onNavigate('productDetail', med)} />
              )) : (
                <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center' }}>কোনো featured medicine নেই।</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(13,159,110,0.1)', color: '#0d9f6e', borderRadius: 50, padding: '5px 16px', marginBottom: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Why Medicare</div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0d1117' }}>আমাদের বিশেষত্ব</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '2px solid rgba(13,159,110,0.08)', borderRadius: 20, padding: '1.75rem', borderTop: `4px solid ${f.color}`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${f.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0d1117', marginBottom: '0.5rem', fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default HomePage;
