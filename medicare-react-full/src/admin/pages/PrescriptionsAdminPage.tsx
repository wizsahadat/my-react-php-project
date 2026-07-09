import React, { useEffect, useState, useCallback } from 'react';

const RX_API = 'http://localhost/medicare-backend/api/prescriptions.php';

const STATUS_MAP: Record<string,{label:string;color:string;bg:string}> = {
  pending:  { label:'অপেক্ষমান', color:'#d97706', bg:'rgba(217,119,6,0.1)'  },
  reviewed: { label:'রিভিউড',    color:'#6366f1', bg:'rgba(99,102,241,0.1)' },
  approved: { label:'অনুমোদিত',  color:'#059669', bg:'rgba(5,150,105,0.1)'  },
  rejected: { label:'বাতিল',     color:'#dc2626', bg:'rgba(220,38,38,0.1)'  },
};

const PrescriptionsAdminPage: React.FC = () => {
  const [rxList,   setRxList]   = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');
  const [counts,   setCounts]   = useState<Record<string,number>>({});
  const [selected, setSelected] = useState<any|null>(null);
  const [note,     setNote]     = useState('');
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? `${RX_API}?action=list` : `${RX_API}?action=list&status=${filter}`;
      const res  = await fetch(url, { credentials:'include' });
      const data = await res.json();
      setRxList(data.prescriptions || []);
      setCounts(data.counts || {});
    } catch {}
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    setSaving(true);
    try {
      const res  = await fetch(`${RX_API}?action=update`, {
        method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
        body: JSON.stringify({ id, status, admin_note: note }),
      });
      const data = await res.json();
      if (data.success) { setMsg('✅ আপডেট হয়েছে'); setSelected(null); setNote(''); load(); setTimeout(()=>setMsg(''),3000); }
    } catch {}
    setSaving(false);
  };

  const total = Object.values(counts).reduce((a,b)=>a+b, 0);

  return (
    <div style={{ padding:'2rem', fontFamily:'DM Sans,sans-serif' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.5rem', color:'#0d1117', margin:0 }}>📋 প্রেসক্রিপশন</h1>
          <p style={{ color:'#888', fontSize:'0.85rem', margin:'4px 0 0' }}>Real-time — সব প্রেসক্রিপশন রিভিউ করুন</p>
        </div>
        {msg && <span style={{ background:'#d1fae5', color:'#065f46', padding:'7px 16px', borderRadius:10, fontSize:'0.83rem', fontWeight:700 }}>{msg}</span>}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { key:'all',      label:'মোট',       value:total,               color:'#6366f1', icon:'📋' },
          { key:'pending',  label:'অপেক্ষমান', value:counts.pending||0,  color:'#d97706', icon:'⏳' },
          { key:'approved', label:'অনুমোদিত',  value:counts.approved||0, color:'#059669', icon:'✅' },
          { key:'rejected', label:'বাতিল',     value:counts.rejected||0, color:'#dc2626', icon:'❌' },
        ].map(s=>(
          <div key={s.key} onClick={()=>setFilter(s.key)}
            style={{ background:'#fff', borderRadius:16, padding:'1.1rem 1.3rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', borderLeft:`4px solid ${s.color}`, cursor:'pointer', transition:'all 0.2s', opacity: filter===s.key?1:0.8 }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';}}
          >
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:24 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.color, fontFamily:'Syne,sans-serif', lineHeight:1.1 }}>{s.value}</div>
                <div style={{ fontSize:'0.75rem', color:'#888' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:'1.25rem' }}>
        {[['all','সব'],['pending','অপেক্ষমান'],['reviewed','রিভিউড'],['approved','অনুমোদিত'],['rejected','বাতিল']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            style={{ padding:'7px 16px', borderRadius:20, border:'none', cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'0.8rem', background:filter===v?'#0d9f6e':'#f3f4f6', color:filter===v?'#fff':'#555', transition:'all 0.2s' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:18, boxShadow:'0 2px 16px rgba(0,0,0,0.07)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
              {['#','ছবি','রোগীর নাম','ফোন','ঠিকানা','মেয়াদ','তারিখ','স্ট্যাটাস','অ্যাকশন'].map(h=>(
                <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.72rem', color:'#aaa', letterSpacing:'0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ textAlign:'center', padding:'3rem', color:'#aaa' }}>⏳ লোড হচ্ছে...</td></tr>
            ) : rxList.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign:'center', padding:'3rem', color:'#aaa' }}>কোনো প্রেসক্রিপশন নেই</td></tr>
            ) : rxList.map(rx=>{
              const s = STATUS_MAP[rx.status] || STATUS_MAP.pending;
              return (
                <tr key={rx.id} style={{ borderBottom:'1px solid #f3f4f6', transition:'background 0.15s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#fafbfc';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='';}}
                >
                  <td style={{ padding:'12px 14px', color:'#ccc', fontSize:'0.78rem' }}>#{rx.id}</td>
                  <td style={{ padding:'12px 14px' }}>
                    {rx.image_url ? (
                      <img src={rx.image_url} alt="rx"
                        style={{ width:48, height:48, objectFit:'cover', borderRadius:10, border:'1.5px solid #e5e7eb', cursor:'pointer' }}
                        onClick={()=>window.open(rx.image_url,'_blank')}
                        title="ক্লিক করলে বড় দেখবে" />
                    ) : <span style={{ fontSize:32 }}>📋</span>}
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ fontWeight:700, fontSize:'0.88rem', color:'#0d1117' }}>{rx.patient_name}</div>
                    {rx.user_email && <div style={{ fontSize:'0.72rem', color:'#aaa', marginTop:2 }}>{rx.user_email}</div>}
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:'0.85rem', color:'#555' }}>{rx.phone}</td>
                  <td style={{ padding:'12px 14px', fontSize:'0.78rem', color:'#555', maxWidth:140 }}>
                    {rx.location ? (
                      <div style={{ display:'flex', alignItems:'flex-start', gap:4 }}>
                        <span>📍</span>
                        <span style={{ wordBreak:'break-word', lineHeight:1.4 }}>{rx.location.length > 40 ? rx.location.slice(0,40)+'...' : rx.location}</span>
                      </div>
                    ) : <span style={{ color:'#ccc' }}>—</span>}
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:'0.82rem', color:'#555' }}>
                    {rx.duration ? <span style={{ background:'#eff6ff', color:'#2563eb', borderRadius:8, padding:'3px 10px', fontSize:'0.78rem', fontWeight:600 }}>{rx.duration}</span> : '—'}
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:'0.78rem', color:'#888' }}>
                    {new Date(rx.created_at).toLocaleDateString('bn-BD')}
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ background:s.bg, color:s.color, borderRadius:20, padding:'4px 12px', fontSize:'0.75rem', fontWeight:700 }}>{s.label}</span>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={()=>{setSelected(rx);setNote(rx.admin_note||'');}}
                      style={{ padding:'6px 14px', background:'#dbeafe', color:'#1d4ed8', border:'none', borderRadius:9, cursor:'pointer', fontWeight:700, fontSize:'0.78rem' }}>
                      👁️ রিভিউ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── REVIEW MODAL ── */}
      {selected && (
        <div onClick={e=>{if(e.target===e.currentTarget){setSelected(null);setNote('');}}}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', zIndex:9500, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'#fff', borderRadius:22, width:'100%', maxWidth:680, maxHeight:'90vh', overflow:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.3)' }}>

            <div style={{ padding:'1.25rem 1.75rem', background:'linear-gradient(135deg,#0a2e1e,#0d9f6e)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:'1.05rem' }}>
                📋 প্রেসক্রিপশন রিভিউ — #{selected.id}
              </div>
              <button onClick={()=>{setSelected(null);setNote('');}}
                style={{ width:32, height:32, borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            </div>

            <div style={{ padding:'1.75rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
              {/* Left: image */}
              <div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', color:'#888', textTransform:'uppercase', marginBottom:10 }}>প্রেসক্রিপশন ছবি</div>
                {selected.image_url ? (
                  <a href={selected.image_url} target="_blank" rel="noreferrer">
                    <img src={selected.image_url} alt="prescription"
                      style={{ width:'100%', borderRadius:14, border:'2px solid #e5e7eb', objectFit:'contain', maxHeight:300, background:'#f8fafc', cursor:'zoom-in' }} />
                  </a>
                ) : <div style={{ width:'100%', height:200, background:'#f3f4f6', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:48 }}>📋</div>}
                <div style={{ fontSize:'0.72rem', color:'#aaa', marginTop:6, textAlign:'center' }}>ক্লিক করলে বড় দেখবে</div>
              </div>

              {/* Right: details */}
              <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                {[
                  { icon:'👤', label:'রোগীর নাম',  val:selected.patient_name },
                  { icon:'📞', label:'ফোন',         val:selected.phone },
                  { icon:'📍', label:'ঠিকানা',      val:selected.location||'দেওয়া হয়নি' },
                  { icon:'⏳', label:'মেয়াদ',       val:selected.duration||'উল্লেখ নেই' },
                  { icon:'📝', label:'নোট',         val:selected.notes||'কিছু নেই' },
                  { icon:'🕐', label:'সময়',         val:new Date(selected.created_at).toLocaleString('bn-BD') },
                ].map(d=>(
                  <div key={d.label} style={{ background:'#f8fafc', borderRadius:10, padding:'0.7rem 0.9rem' }}>
                    <div style={{ fontSize:'0.7rem', color:'#aaa', fontWeight:600, textTransform:'uppercase', marginBottom:3 }}>{d.icon} {d.label}</div>
                    <div style={{ fontSize:'0.85rem', color:'#0d1117', fontWeight:600, wordBreak:'break-word' }}>{d.val}</div>
                  </div>
                ))}
                {/* GPS map link */}
                {selected.lat && selected.lng && (
                  <a href={`https://maps.google.com/?q=${selected.lat},${selected.lng}`} target="_blank" rel="noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:6, background:'#eff6ff', borderRadius:10, padding:'0.7rem 0.9rem', color:'#2563eb', textDecoration:'none', fontSize:'0.83rem', fontWeight:700 }}>
                    🗺️ Google Maps এ দেখুন
                  </a>
                )}
              </div>
            </div>

            {/* Admin action */}
            <div style={{ padding:'0 1.75rem 1.75rem' }}>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', color:'#888', textTransform:'uppercase', marginBottom:8 }}>Admin নোট</div>
              <textarea value={note} onChange={e=>setNote(e.target.value)} rows={2}
                placeholder="রোগীর জন্য নোট লিখুন (optional)..."
                style={{ width:'100%', boxSizing:'border-box', padding:'10px 13px', border:'1.5px solid #e5e7eb', borderRadius:11, fontFamily:'DM Sans,sans-serif', fontSize:'0.88rem', outline:'none', resize:'vertical', marginBottom:'1rem', background:'#fafafa' }} />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.6rem' }}>
                {[
                  { s:'reviewed', label:'রিভিউ করা হয়েছে', color:'#6366f1', bg:'rgba(99,102,241,0.1)', icon:'👁️' },
                  { s:'approved', label:'অনুমোদন দিন',      color:'#059669', bg:'rgba(5,150,105,0.1)',  icon:'✅' },
                  { s:'rejected', label:'বাতিল করুন',        color:'#dc2626', bg:'rgba(220,38,38,0.1)', icon:'❌' },
                ].map(a=>(
                  <button key={a.s} onClick={()=>updateStatus(selected.id, a.s)} disabled={saving}
                    style={{ padding:'10px 6px', background:a.bg, border:`1.5px solid ${a.color}30`, borderRadius:11, cursor:saving?'wait':'pointer', color:a.color, fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.78rem', textAlign:'center', transition:'all 0.2s' }}>
                    {a.icon}<br/>{a.label}
                  </button>
                ))}
                <button onClick={()=>{setSelected(null);setNote('');}}
                  style={{ padding:'10px 6px', background:'#f3f4f6', border:'1.5px solid #e5e7eb', borderRadius:11, cursor:'pointer', color:'#555', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.78rem' }}>
                  ✕<br/>বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsAdminPage;
