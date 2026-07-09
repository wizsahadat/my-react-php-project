import React, { useState } from 'react';

const services = [
  { id:1, name:'হোম ডেলিভারি',    nameEn:'Home Delivery',      icon:'🚚', status:true,  desc:'ঢাকার মধ্যে ২৪ ঘণ্টায় ডেলিভারি', charge:'৳50',  orders:148 },
  { id:2, name:'প্রেসক্রিপশন রিভিউ',nameEn:'Prescription Review',icon:'📋', status:true,  desc:'অভিজ্ঞ ফার্মাসিস্ট দ্বারা রিভিউ', charge:'বিনামূল্যে', orders:89 },
  { id:3, name:'AI ওষুধ সহায়তা',  nameEn:'AI Medicine Helper', icon:'🤖', status:true,  desc:'AI দ্বারা ওষুধ সম্পর্কে পরামর্শ',  charge:'বিনামূল্যে', orders:212 },
  { id:4, name:'ডিসকাউন্ট কার্ড',  nameEn:'Discount Card',      icon:'🎟️', status:false, desc:'নিয়মিত গ্রাহকদের জন্য বিশেষ ছাড়', charge:'৳200/বছর', orders:34 },
  { id:5, name:'জরুরি ডেলিভারি',   nameEn:'Express Delivery',   icon:'⚡', status:false, desc:'২-৩ ঘণ্টায় ডেলিভারি (ঢাকা)',     charge:'৳120', orders:0 },
];

const ServicesAdminPage: React.FC = () => {
  const [list, setList] = useState(services);
  const toggle = (id: number) => setList(prev => prev.map(s => s.id===id ? {...s, status:!s.status} : s));

  return (
    <div style={{ padding:'2rem', fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ marginBottom:'1.75rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.5rem', color:'#0d1117', margin:0 }}>⚙️ সেবাসমূহ</h1>
          <p style={{ color:'#888', fontSize:'0.85rem', margin:'4px 0 0' }}>সব সেবা চালু/বন্ধ ও ম্যানেজ করুন</p>
        </div>
        <button style={{ padding:'10px 22px', background:'linear-gradient(135deg,#0d9f6e,#076b49)', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.88rem', boxShadow:'0 4px 12px rgba(13,159,110,0.3)' }}>
          + নতুন সেবা যোগ
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.75rem' }}>
        {[
          { label:'মোট সেবা',    value:list.length,                        color:'#6366f1' },
          { label:'চালু সেবা',   value:list.filter(s=>s.status).length,   color:'#059669' },
          { label:'বন্ধ সেবা',   value:list.filter(s=>!s.status).length,  color:'#dc2626' },
        ].map(s=>(
          <div key={s.label} style={{ background:'#fff', borderRadius:16, padding:'1.1rem 1.3rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:'1.6rem', fontWeight:800, color:s.color, fontFamily:'Syne,sans-serif' }}>{s.value}</div>
            <div style={{ fontSize:'0.8rem', color:'#666', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Service Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
        {list.map(svc=>(
          <div key={svc.id} style={{
            background:'#fff', borderRadius:18,
            boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
            border:`2px solid ${svc.status ? 'rgba(13,159,110,0.2)' : 'rgba(0,0,0,0.06)'}`,
            padding:'1.4rem', transition:'all 0.2s',
            opacity: svc.status ? 1 : 0.7
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:48, height:48, borderRadius:14, background: svc.status ? 'rgba(13,159,110,0.1)' : '#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
                  {svc.icon}
                </div>
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.92rem', color:'#0d1117' }}>{svc.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'#aaa' }}>{svc.nameEn}</div>
                </div>
              </div>
              {/* Toggle */}
              <div onClick={() => toggle(svc.id)}
                style={{ width:46, height:26, borderRadius:13, background: svc.status ? '#0d9f6e' : '#d1d5db', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
                <div style={{ position:'absolute', top:3, left: svc.status ? 23 : 3, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>

            <p style={{ fontSize:'0.82rem', color:'#666', margin:'0 0 0.85rem', lineHeight:1.6 }}>{svc.desc}</p>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ background: svc.status ? '#f0fdf4' : '#f3f4f6', color: svc.status ? '#059669' : '#888', borderRadius:8, padding:'4px 12px', fontSize:'0.8rem', fontWeight:700 }}>
                {svc.charge}
              </span>
              <span style={{ fontSize:'0.78rem', color:'#aaa' }}>{svc.orders} ব্যবহার</span>
            </div>

            <div style={{ display:'flex', gap:8, marginTop:'0.85rem', paddingTop:'0.75rem', borderTop:'1px solid #f3f4f6' }}>
              <button style={{ flex:1, padding:'7px', background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:9, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, color:'#555' }}>✏️ এডিট</button>
              <button style={{ padding:'7px 14px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:9, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, color:'#dc2626' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesAdminPage;
