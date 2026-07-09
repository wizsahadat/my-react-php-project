import React, { useState, useEffect, useCallback } from 'react';
import { fetchMedicines, fetchCategories, Category, Medicine, CartItem } from '../data/api';
import MedicineCard from '../components/MedicineCard';
import Footer from '../components/Footer';

interface ProductsPageProps {
  onAddToCart: (item: CartItem) => void;
  onViewMedicine: (medicine: Medicine) => void;
  initialCategoryId?: number;
  onNavigate: (page: string, extra?: any) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onAddToCart, onViewMedicine, initialCategoryId, onNavigate }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>(initialCategoryId || '');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMedicines({
        q: search,
        category: categoryFilter || undefined,
        type: typeFilter || undefined,
        sort: sortBy,
        page
      });
      setMedicines(data.medicines);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch { setMedicines([]); }
    setLoading(false);
  }, [search, categoryFilter, typeFilter, sortBy, page]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7fdf9' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a2e1e, #0d9f6e)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '0.5rem' }}>All Medicines</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>{total} medicine available</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8, background: '#f7fdf9', border: '2px solid rgba(13,159,110,0.2)', borderRadius: 12, padding: '8px 14px' }}>
            <span>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Medicine বা generic name..."
              style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', flex: 1 }} />
          </div>

          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value ? Number(e.target.value) : ''); setPage(1); }} style={selStyle}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
          </select>

          <div style={{ display: 'flex', gap: 6 }}>
            {[['ALL', ''], ['OTC', 'OTC'], ['RX', 'Prescription']].map(([label, val]) => (
              <button key={label} onClick={() => { setTypeFilter(val); setPage(1); }} style={{
                padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem',
                background: typeFilter === val ? '#0d9f6e' : '#f3f4f6',
                color: typeFilter === val ? '#fff' : '#666', transition: 'all 0.2s'
              }}>{label}</button>
            ))}
          </div>

          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} style={selStyle}>
            <option value="name">Name A-Z</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Loading medicines...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: 20 }}>
            <div style={{ fontSize: 48, marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#0d1117', marginBottom: 8 }}>কোনো medicine পাওয়া যায়নি</h3>
            <p style={{ color: '#888' }}>অন্য keyword বা filter চেষ্টা করুন</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {medicines.map(m => (
                <MedicineCard key={m.medicine_id} medicine={m} onAddToCart={onAddToCart} onView={onViewMedicine} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: p === page ? '#0d9f6e' : '#fff',
                    color: p === page ? '#fff' : '#555',
                    fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s'
                  }}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

const selStyle: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 12, border: '2px solid rgba(13,159,110,0.2)',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#0d1117',
  background: '#f7fdf9', cursor: 'pointer', outline: 'none'
};

export default ProductsPage;
