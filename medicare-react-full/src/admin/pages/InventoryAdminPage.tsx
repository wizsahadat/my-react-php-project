import React, { useEffect, useState, useCallback } from 'react';
import { adminInventory } from '../../data/api';

type Filter = 'all' | 'low' | 'out';

const InventoryAdminPage: React.FC = () => {
  const [items,      setItems]      = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState<Filter>('all');
  const [stats,      setStats]      = useState({ total_count:0, low_count:0, out_count:0, total_value:0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminInventory(search, filter);
      setItems(data.items || []);
      setStats({
        total_count: data.total_count || 0,
        low_count:   data.low_count   || 0,
        out_count:   data.out_count   || 0,
        total_value: data.total_value || 0,
      });
    } catch {}
    setLoading(false);
  }, [search, filter]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const stockStatus = (stock: number) => {
    if (stock === 0) return { label:'স্টক শেষ', color:'#dc2626', bg:'rgba(220,38,38,0.1)', dot:'#dc2626' };
    if (stock < 15)  return { label:'কম স্টক',   color:'#d97706', bg:'rgba(217,119,6,0.1)',  dot:'#d97706' };
    return               { label:'পর্যাপ্ত',     color:'#059669', bg:'rgba(5,150,105,0.1)',  dot:'#059669' };
  };

  return (
    <div style={{ padding:'2rem', fontFamily:'DM Sans,sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.6rem', color:'#0d1117', margin:0 }}>🏪 ইনভেন্টরি</h1>
        <p style={{ color:'#888', fontSize:'0.85rem', margin:'4px 0 0' }}>Real-time স্টক পরিমাণ — Medicines টেবিল থেকে</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { label:'মোট আইটেম',  value: stats.total_count,                         color:'#6366f1', icon:'📦', clickFilter: 'all' as Filter },
          { label:'কম স্টক',    value: stats.low_count,                           color:'#d97706', icon:'⚠️', clickFilter: 'low' as Filter },
          { label:'স্টক শেষ',   value: stats.out_count,                           color:'#dc2626', icon:'🔴', clickFilter: 'out' as Filter },
          { label:'মোট মূল্য',  value: `৳${Number(stats.total_value).toLocaleString('en-IN')}`, color:'#059669', icon:'💰', clickFilter: 'all' as Filter },
        ].map(s => (
          <div key={s.label}
            onClick={() => setFilter(s.clickFilter)}
            style={{ background:'#fff', borderRadius:16, padding:'1.1rem 1.3rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', borderLeft:`4px solid ${s.color}`, cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow='0 6px 20px rgba(0,0,0,0.1)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow='0 2px 8px rgba(0,0,0,0.06)';}}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:24 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize:'1.4rem', fontWeight:800, color:s.color, fontFamily:'Syne,sans-serif', lineHeight:1.1 }}>{s.value}</div>
                <div style={{ fontSize:'0.75rem', color:'#888', marginTop:2 }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display:'flex', gap:10, marginBottom:'1.25rem', flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:220, display:'flex', alignItems:'center', gap:8, background:'#fff', border:'2px solid rgba(13,159,110,0.2)', borderRadius:12, padding:'8px 14px' }}>
          <span>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="ওষুধের নাম বা Generic নাম খুঁজুন..."
            style={{ flex:1, border:'none', outline:'none', fontFamily:'DM Sans,sans-serif', fontSize:'0.88rem', background:'transparent' }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {([['all','সব'],['low','কম স্টক'],['out','শেষ']] as [Filter,string][]).map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              style={{ padding:'9px 18px', borderRadius:11, border:'none', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.82rem',
                background: filter===v ? '#0d9f6e' : '#f3f4f6',
                color:      filter===v ? '#fff'    : '#555',
                boxShadow:  filter===v ? '0 4px 12px rgba(13,159,110,0.25)' : 'none',
                transition: 'all 0.2s'
              }}>{l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.07)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
              {['#','MEDICINE NAME','GENERIC / CATEGORY','COMPANY','CURRENT STOCK','PRICE','STATUS'].map(h => (
                <th key={h} style={{ padding:'13px 16px', textAlign:'left', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.72rem', color:'#aaa', letterSpacing:'0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#aaa' }}>⏳ লোড হচ্ছে...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:'3rem', color:'#aaa' }}>কোনো তথ্য পাওয়া যায়নি</td></tr>
            ) : items.map(item => {
              const s = stockStatus(item.stock);
              return (
                <tr key={item.medicine_id} style={{ borderBottom:'1px solid #f3f4f6', transition:'background 0.15s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#fafbfc';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='';}}
                >
                  <td style={{ padding:'13px 16px', color:'#ddd', fontSize:'0.75rem', fontWeight:700 }}>#{item.medicine_id}</td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.88rem', color:'#0d1117' }}>{item.name}</div>
                    <div style={{ fontSize:'0.72rem', color:'#aaa', marginTop:2 }}>{item.type}</div>
                  </td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ fontSize:'0.82rem', color:'#6366f1', fontStyle:'italic' }}>{item.generic_name || '—'}</div>
                    {item.category_name && <div style={{ fontSize:'0.72rem', color:'#aaa', marginTop:2 }}>📁 {item.category_name}</div>}
                  </td>
                  <td style={{ padding:'13px 16px', fontSize:'0.83rem', color:'#555' }}>{item.company || '—'}</td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:s.dot, flexShrink:0 }} />
                      <span style={{ fontWeight:800, fontSize:'1rem', color:s.dot }}>{item.stock}</span>
                      <span style={{ fontSize:'0.72rem', color:'#aaa' }}>Units</span>
                    </div>
                    {/* Mini bar */}
                    <div style={{ marginTop:5, height:4, background:'#f3f4f6', borderRadius:20, overflow:'hidden', width:80 }}>
                      <div style={{ height:'100%', background:s.dot, borderRadius:20, width:`${Math.min(100, (item.stock / 100) * 100)}%`, transition:'width 0.4s' }} />
                    </div>
                  </td>
                  <td style={{ padding:'13px 16px', fontWeight:800, color:'#0d9f6e', fontFamily:'Syne,sans-serif', fontSize:'0.9rem' }}>৳{item.price}</td>
                  <td style={{ padding:'13px 16px' }}>
                    <span style={{ background:s.bg, color:s.color, borderRadius:20, padding:'5px 14px', fontSize:'0.78rem', fontWeight:700, display:'inline-block' }}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && items.length > 0 && (
          <div style={{ padding:'0.85rem 1.5rem', borderTop:'1px solid #f3f4f6', background:'#fafbfc', fontSize:'0.8rem', color:'#aaa', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>মোট <strong style={{color:'#0d9f6e'}}>{items.length}</strong>টি আইটেম দেখাচ্ছে</span>
            <span>সর্বনিম্ন স্টক: <strong style={{color:'#dc2626'}}>{items[0]?.stock ?? 0}</strong> units</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryAdminPage;
