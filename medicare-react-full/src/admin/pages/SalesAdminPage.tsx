import React, { useState } from 'react';

const monthly = [
  { month:'জানু',  sale:42500, orders:38 },
  { month:'ফেব্রু', sale:38200, orders:34 },
  { month:'মার্চ', sale:55800, orders:52 },
  { month:'এপ্রিল',sale:61200, orders:58 },
  { month:'মে',    sale:49700, orders:44 },
  { month:'জুন',   sale:72300, orders:67 },
];

const topMeds = [
  { name:'Napa Extra',  sold:320, revenue:3840,  percent:28 },
  { name:'Seclo 20',    sold:218, revenue:1744,  percent:19 },
  { name:'Losartan 50', sold:196, revenue:3528,  percent:17 },
  { name:'Metformin',   sold:175, revenue:700,   percent:15 },
  { name:'Cetirizine',  sold:142, revenue:710,   percent:12 },
];

const SalesAdminPage: React.FC = () => {
  const [period, setPeriod] = useState('monthly');
  const maxSale = Math.max(...monthly.map(m=>m.sale));
  const totalRevenue = monthly.reduce((s,m)=>s+m.sale,0);
  const totalOrders  = monthly.reduce((s,m)=>s+m.orders,0);

  return (
    <div style={{ padding:'2rem', fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ marginBottom:'1.75rem' }}>
        <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.5rem', color:'#0d1117', margin:0 }}>💰 বিক্রির হিসাব</h1>
        <p style={{ color:'#888', fontSize:'0.85rem', margin:'4px 0 0' }}>Revenue ও Sales Report</p>
      </div>

      {/* Big Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.75rem' }}>
        {[
          { label:'মোট রেভিনিউ (৬ মাস)', value:`৳${totalRevenue.toLocaleString()}`, color:'#0d9f6e', icon:'💰', sub:'+12.4%' },
          { label:'মোট অর্ডার',           value:totalOrders,                          color:'#6366f1', icon:'📦', sub:'এই মাস' },
          { label:'গড় অর্ডার মূল্য',     value:`৳${Math.round(totalRevenue/totalOrders)}`, color:'#d97706', icon:'📊', sub:'per order' },
          { label:'সেরা মাস',             value:'জুন',                                 color:'#ec4899', icon:'🏆', sub:`৳72,300` },
        ].map(s=>(
          <div key={s.label} style={{ background:'#fff', borderRadius:18, padding:'1.3rem', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', borderTop:`4px solid ${s.color}` }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.color, fontFamily:'Syne,sans-serif' }}>{s.value}</div>
            <div style={{ fontSize:'0.78rem', color:'#666', marginTop:3 }}>{s.label}</div>
            <div style={{ fontSize:'0.72rem', color:'#aaa', marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem' }}>
        {/* Bar Chart */}
        <div style={{ background:'#fff', borderRadius:18, padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1rem', margin:'0 0 1.25rem', color:'#0d1117' }}>মাসওয়ারি বিক্রি</h3>
          <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:180 }}>
            {monthly.map(m=>{
              const h = Math.round((m.sale / maxSale) * 150);
              return (
                <div key={m.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div style={{ fontSize:'0.7rem', color:'#0d9f6e', fontWeight:700 }}>৳{(m.sale/1000).toFixed(0)}k</div>
                  <div style={{ width:'100%', height:h, background:'linear-gradient(180deg,#0d9f6e,#076b49)', borderRadius:'8px 8px 4px 4px', transition:'height 0.3s', position:'relative', cursor:'pointer' }}
                    title={`${m.month}: ৳${m.sale.toLocaleString()}`}
                  />
                  <div style={{ fontSize:'0.75rem', color:'#888', fontWeight:600 }}>{m.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Medicines */}
        <div style={{ background:'#fff', borderRadius:18, padding:'1.5rem', boxShadow:'0 2px 12px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1rem', margin:'0 0 1.25rem', color:'#0d1117' }}>সেরা বিক্রিত ওষুধ</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {topMeds.map((m,i)=>(
              <div key={m.name}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:20, height:20, background:['#0d9f6e','#6366f1','#d97706','#ec4899','#0ea5e9'][i], borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.65rem', fontWeight:800, flexShrink:0 }}>{i+1}</span>
                    <span style={{ fontSize:'0.82rem', fontWeight:600 }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize:'0.78rem', color:'#0d9f6e', fontWeight:700 }}>{m.sold} পিস</span>
                </div>
                <div style={{ background:'#f3f4f6', borderRadius:20, height:7, overflow:'hidden' }}>
                  <div style={{ width:`${m.percent}%`, height:'100%', background:['#0d9f6e','#6366f1','#d97706','#ec4899','#0ea5e9'][i], borderRadius:20, transition:'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAdminPage;
