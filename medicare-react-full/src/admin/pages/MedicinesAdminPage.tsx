import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  adminMedicines, adminUpdateMedicine, adminDeleteMedicine,
  adminAddMedicine, adminCategories
} from '../../data/api';

const UPLOAD_URL = 'http://localhost/medicare-backend/api/upload.php';
const TYPES = ['OTC', 'PRESCRIPTION', 'CONTROLLED'];

const emptyForm = {
  medicine_id: 0, name: '', generic_name: '', company: '', drug_class: '',
  price: '', stock: '', type: 'OTC', category_id: '',
  dosage_form: '', strength: '', description: '', indications: '',
  dosage: '', side_effects: '', contraindications: '', image: ''
};

const MedicinesAdminPage: React.FC = () => {
  const [medicines,    setMedicines]    = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);
  const [topMsg,       setTopMsg]       = useState('');
  const [topMsgType,   setTopMsgType]   = useState<'ok'|'err'>('ok');

  const [editOpen,     setEditOpen]     = useState(false);
  const [isAdding,     setIsAdding]     = useState(false);
  const [form,         setForm]         = useState<any>({...emptyForm});
  const [saving,       setSaving]       = useState(false);
  const [cats,         setCats]         = useState<{category_id:number;name:string}[]>([]);

  // Modal-level error (shown inside the modal)
  const [modalErr,     setModalErr]     = useState('');

  // Image upload
  const [imgFile,      setImgFile]      = useState<File|null>(null);
  const [imgPreview,   setImgPreview]   = useState<string>('');
  const [imgUploading, setImgUploading] = useState(false);
  const [dragOver,     setDragOver]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notifyTop = (m: string, type: 'ok'|'err' = 'ok') => {
    setTopMsg(m); setTopMsgType(type);
    setTimeout(() => setTopMsg(''), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminMedicines(page, search);
      setMedicines(data.medicines || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { notifyTop('⚠️ Data load error', 'err'); }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  useEffect(() => { adminCategories().then(d => setCats(d.categories || [])); }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setModalErr('শুধু ছবি ফাইল সিলেক্ট করুন'); return; }
    if (file.size > 5 * 1024 * 1024)    { setModalErr('ছবির সাইজ ৫MB এর বেশি হতে পারবে না'); return; }
    setImgFile(file);
    setModalErr('');
    const reader = new FileReader();
    reader.onload = e => setImgPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const openEdit = (med: any) => {
    setForm({
      medicine_id: med.medicine_id, name: med.name || '', generic_name: med.generic_name || '',
      company: med.company || '', drug_class: med.drug_class || '',
      price: String(med.price || ''), stock: String(med.stock ?? ''), type: med.type || 'OTC',
      category_id: String(med.category_id || ''), dosage_form: med.dosage_form || '',
      strength: med.strength || '', description: med.description || '',
      indications: med.indications || '', dosage: med.dosage || '',
      side_effects: med.side_effects || '', contraindications: med.contraindications || '',
      image: med.image || ''
    });
    setImgFile(null); setImgPreview(''); setModalErr('');
    setIsAdding(false); setEditOpen(true);
  };

  const openAdd = () => {
    setForm({...emptyForm});
    setImgFile(null); setImgPreview(''); setModalErr('');
    setIsAdding(true); setEditOpen(true);
  };

  const uploadImage = async (medicine_id: number): Promise<string|null> => {
    if (!imgFile) return null;
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', imgFile);
      fd.append('medicine_id', String(medicine_id));
      const res  = await fetch(`${UPLOAD_URL}?action=medicine_image`, {
        method: 'POST', body: fd, credentials: 'include'
      });
      const data = await res.json();
      setImgUploading(false);
      if (data.success) return data.image_url;
      setModalErr(data.msg || 'Image upload error');
      return null;
    } catch {
      setImgUploading(false);
      return null;
    }
  };

  const handleSave = async () => {
    setModalErr('');

    // Validate
    if (!form.name.trim()) {
      setModalErr('⚠️ Medicine Name অবশ্যই দিতে হবে');
      return;
    }
    const priceVal = parseFloat(form.price);
    if (!form.price || isNaN(priceVal) || priceVal <= 0) {
      setModalErr('⚠️ সঠিক Price দিন (০ এর বেশি)');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        medicine_id:      form.medicine_id,
        name:             form.name.trim(),
        generic_name:     form.generic_name.trim(),
        company:          form.company.trim(),
        drug_class:       form.drug_class.trim(),
        price:            priceVal,
        stock:            parseInt(form.stock) || 0,
        type:             form.type,
        category_id:      parseInt(form.category_id) || 0,
        dosage_form:      form.dosage_form.trim(),
        strength:         form.strength.trim(),
        description:      form.description.trim(),
        indications:      form.indications.trim(),
        dosage:           form.dosage.trim(),
        side_effects:     form.side_effects.trim(),
        contraindications:form.contraindications.trim(),
      };

      const res = isAdding
        ? await adminAddMedicine(payload)
        : await adminUpdateMedicine(payload);

      if (res.success) {
        const medId = isAdding ? res.id : form.medicine_id;

        // Upload image if selected
        if (imgFile && medId) {
          await uploadImage(medId);
          notifyTop('✅ Medicine ও ছবি সেভ হয়েছে!');
        } else {
          notifyTop(isAdding ? '✅ নতুন ওষুধ যোগ হয়েছে!' : '✅ আপডেট সফল হয়েছে!');
        }
        setEditOpen(false);
        load();
      } else {
        setModalErr(res.msg || '❌ সেভ হয়নি। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      setModalErr('⚠️ Server connection error। XAMPP চালু আছে কিনা দেখুন।');
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  const deleteMed = async (id: number, name: string) => {
    if (!window.confirm(`"${name}" মুছে দেবেন? এটা undo করা যাবে না।`)) return;
    const res = await adminDeleteMedicine(id);
    if (res.success) { notifyTop('🗑️ Deleted!'); load(); }
    else notifyTop(res.msg || 'Delete error', 'err');
  };

  const F = (k: string, v: string) => {
    setForm((p: any) => ({...p, [k]: v}));
    if (modalErr) setModalErr('');
  };

  // Styles
  const IS: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '10px 13px',
    border: '1.5px solid #e5e7eb', borderRadius: 10,
    fontFamily: 'DM Sans,sans-serif', fontSize: '0.88rem', color: '#0d1117',
    outline: 'none', background: '#fafafa', transition: 'border-color 0.2s'
  };
  const LS: React.CSSProperties = {
    display: 'block', fontFamily: 'Syne,sans-serif', fontWeight: 700,
    fontSize: '0.72rem', color: '#666', letterSpacing: '0.06em',
    textTransform: 'uppercase', marginBottom: 5
  };
  const SEC = (icon: string, title: string) => (
    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'0.8rem', color:'#0d9f6e', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.75rem', paddingBottom:'0.5rem', borderBottom:'2px solid #f0fdf4' }}>
      {icon} {title}
    </div>
  );

  const currentImg = imgPreview || form.image;

  return (
    <div style={{ padding: '2rem', fontFamily: 'DM Sans,sans-serif', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.6rem', color:'#0d1117', margin:0 }}>💊 Medicines</h1>
          <p style={{ color:'#888', fontSize:'0.85rem', margin:'4px 0 0' }}>মোট {total}টি ওষুধ</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          {topMsg && (
            <span style={{ background: topMsgType==='ok'?'#d1fae5':'#fee2e2', color: topMsgType==='ok'?'#065f46':'#dc2626', padding:'7px 16px', borderRadius:10, fontSize:'0.83rem', fontWeight:700 }}>
              {topMsg}
            </span>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:'2px solid rgba(13,159,110,0.2)', borderRadius:12, padding:'8px 14px' }}>
            <span>🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Medicine খুঁজুন..."
              style={{ border:'none', outline:'none', fontFamily:'DM Sans,sans-serif', fontSize:'0.88rem', width:190, background:'transparent' }} />
          </div>
          <button onClick={openAdd}
            style={{ padding:'10px 22px', background:'linear-gradient(135deg,#0d9f6e,#076b49)', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.88rem', boxShadow:'0 4px 14px rgba(13,159,110,0.35)' }}>
            + নতুন ওষুধ
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.07)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
              {['#','Image','NAME','GENERIC','COMPANY','PRICE','STOCK','TYPE','ACTIONS'].map(h => (
                <th key={h} style={{ padding:'13px 14px', textAlign:'left', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.72rem', color:'#aaa', letterSpacing:'0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ textAlign:'center', padding:'3rem', color:'#aaa' }}>⏳ লোড হচ্ছে...</td></tr>
            ) : medicines.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign:'center', padding:'3rem', color:'#aaa' }}>কোনো ওষুধ পাওয়া যায়নি</td></tr>
            ) : medicines.map(m => (
              <tr key={m.medicine_id} style={{ borderBottom:'1px solid #f3f4f6', transition:'background 0.15s' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='#fafbfc';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='';}}
              >
                <td style={{ padding:'12px 14px', color:'#ccc', fontSize:'0.78rem' }}>#{m.medicine_id}</td>
                <td style={{ padding:'12px 14px' }}>
                  <img src={m.image} alt={m.name}
                    style={{ width:42, height:42, borderRadius:10, objectFit:'cover', background:'#f0fdf4', border:'1px solid #e5e7eb' }}
                    onError={e=>{(e.target as HTMLImageElement).src='https://placehold.co/42x42/d1fae5/0d9f6e?text=💊';}} />
                </td>
                <td style={{ padding:'12px 14px', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#0d1117', fontSize:'0.88rem' }}>{m.name}</td>
                <td style={{ padding:'12px 14px', color:'#6366f1', fontSize:'0.8rem', fontStyle:'italic' }}>{m.generic_name||'—'}</td>
                <td style={{ padding:'12px 14px', color:'#555', fontSize:'0.82rem' }}>{m.company||'—'}</td>
                <td style={{ padding:'12px 14px', fontFamily:'Syne,sans-serif', fontWeight:800, color:'#0d9f6e' }}>৳{m.price}</td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ background: m.stock===0?'#fee2e2':m.stock<15?'#fff7ed':'#f0fdf4', color: m.stock===0?'#dc2626':m.stock<15?'#d97706':'#059669', borderRadius:8, padding:'3px 10px', fontSize:'0.78rem', fontWeight:800 }}>{m.stock}</span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ background: m.type==='OTC'?'#d1fae5':m.type==='PRESCRIPTION'?'#fce7f3':'#fef3c7', color: m.type==='OTC'?'#065f46':m.type==='PRESCRIPTION'?'#be185d':'#92400e', borderRadius:8, padding:'3px 10px', fontSize:'0.72rem', fontWeight:700 }}>{m.type}</span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <div style={{ display:'flex', gap:7 }}>
                    <button onClick={()=>openEdit(m)} style={{ padding:'6px 14px', borderRadius:9, border:'none', cursor:'pointer', background:'#dbeafe', color:'#1d4ed8', fontWeight:700, fontSize:'0.78rem' }}>✏️ Edit</button>
                    <button onClick={()=>deleteMed(m.medicine_id,m.name)} style={{ padding:'6px 12px', borderRadius:9, border:'none', cursor:'pointer', background:'#fee2e2', color:'#dc2626', fontWeight:700, fontSize:'0.78rem' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:6, padding:'1.25rem', borderTop:'1px solid #f3f4f6' }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              style={{ padding:'7px 14px', borderRadius:9, border:'none', cursor:'pointer', background:page===1?'#f3f4f6':'#0d9f6e', color:page===1?'#ccc':'#fff', fontWeight:700, fontSize:'0.82rem' }}>← আগে</button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)}
                style={{ width:36, height:36, borderRadius:9, border:'none', cursor:'pointer', background:p===page?'#0d9f6e':'#f3f4f6', color:p===page?'#fff':'#555', fontFamily:'Syne,sans-serif', fontWeight:700 }}>{p}</button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ padding:'7px 14px', borderRadius:9, border:'none', cursor:'pointer', background:page===totalPages?'#f3f4f6':'#0d9f6e', color:page===totalPages?'#ccc':'#fff', fontWeight:700, fontSize:'0.82rem' }}>পরে →</button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          EDIT / ADD MODAL
      ══════════════════════════════════════════ */}
      {editOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', display:'flex', alignItems:'flex-start', justifyContent:'center', zIndex:9500, overflowY:'auto', padding:'2rem 1rem' }}>
          <div style={{ background:'#fff', borderRadius:22, width:'100%', maxWidth:860, boxShadow:'0 32px 80px rgba(0,0,0,0.25)', overflow:'hidden', marginBottom:'2rem' }}>

            {/* Modal Header */}
            <div style={{ padding:'1.4rem 2rem', background:'linear-gradient(135deg,#0a2e1e,#0d9f6e)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.15rem', color:'#fff' }}>
                  {isAdding ? '+ নতুন ওষুধ যোগ করুন' : '✏️ Edit Medicine'}
                </div>
                {!isAdding && form.name && <div style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.82rem', marginTop:2 }}>{form.name}</div>}
              </div>
              <button onClick={()=>setEditOpen(false)}
                style={{ width:36, height:36, borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>×</button>
            </div>

            <div style={{ padding:'2rem' }}>

              {/* ── Modal Error Box (always visible inside modal) ── */}
              {modalErr && (
                <div style={{ background:'#fee2e2', border:'2px solid #fca5a5', borderRadius:12, padding:'12px 16px', marginBottom:'1.25rem', color:'#dc2626', fontSize:'0.88rem', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:20 }}>⚠️</span>
                  <span>{modalErr}</span>
                </div>
              )}

              {/* ── Image Section ── */}
              <div style={{ marginBottom:'1.5rem' }}>
                {SEC('🖼️','Medicine Image')}
                <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' }}>
                  {/* Preview box */}
                  <div style={{ width:100, height:100, borderRadius:16, border:'2px solid #e5e7eb', overflow:'hidden', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {currentImg ? (
                      <img src={currentImg} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                        onError={e=>{(e.target as HTMLImageElement).src='https://placehold.co/100x100/d1fae5/0d9f6e?text=💊';}} />
                    ) : <span style={{ fontSize:36 }}>💊</span>}
                  </div>
                  {/* Drop zone */}
                  <div
                    style={{ flex:1, minWidth:200, border:`2px dashed ${dragOver?'#0d9f6e':'#d1d5db'}`, borderRadius:14, padding:'1.25rem', textAlign:'center', cursor:'pointer', background:dragOver?'#f0fdf4':'#fafafa', transition:'all 0.2s' }}
                    onClick={()=>fileInputRef.current?.click()}
                    onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                    onDragLeave={()=>setDragOver(false)}
                    onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f)handleFileSelect(f);}}
                  >
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={e=>{const f=e.target.files?.[0];if(f)handleFileSelect(f);}} />
                    {imgFile ? (
                      <div>
                        <div style={{ fontSize:28, marginBottom:6 }}>✅</div>
                        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', color:'#0d9f6e' }}>{imgFile.name}</div>
                        <div style={{ fontSize:'0.75rem', color:'#aaa', marginTop:3 }}>{(imgFile.size/1024).toFixed(1)} KB · পরিবর্তন করতে আবার ক্লিক করুন</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize:28, marginBottom:6 }}>📁</div>
                        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.88rem', color:'#555' }}>ক্লিক করুন বা ড্র্যাগ করুন</div>
                        <div style={{ fontSize:'0.75rem', color:'#aaa', marginTop:4 }}>JPG, PNG, WEBP · সর্বোচ্চ ৫MB</div>
                      </div>
                    )}
                  </div>
                  {imgFile && (
                    <button onClick={()=>{setImgFile(null);setImgPreview('');if(fileInputRef.current)fileInputRef.current.value='';}}
                      style={{ padding:'8px 14px', border:'1px solid #fecaca', background:'#fef2f2', color:'#dc2626', borderRadius:10, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, alignSelf:'flex-start' }}>
                      ✕ সরান
                    </button>
                  )}
                </div>
              </div>

              {/* ── Basic Info ── */}
              <div style={{ marginBottom:'1.25rem' }}>
                {SEC('📋','মূল তথ্য')}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.85rem' }}>
                  {[
                    {k:'name',         l:'Medicine Name *', ph:'যেমন: Napa Extra', req:true},
                    {k:'generic_name', l:'Generic Name',    ph:'যেমন: Paracetamol', req:false},
                    {k:'company',      l:'Company',         ph:'যেমন: Beximco', req:false},
                    {k:'drug_class',   l:'Drug Class',      ph:'যেমন: Analgesic', req:false},
                  ].map(f=>(
                    <div key={f.k}>
                      <label style={LS}>{f.l}</label>
                      <input style={{...IS, borderColor: f.req && !form[f.k].trim() && modalErr ? '#fca5a5' : '#e5e7eb'}}
                        value={form[f.k]} onChange={e=>F(f.k,e.target.value)} placeholder={f.ph}
                        onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Price, Stock, Type, Category ── */}
              <div style={{ marginBottom:'1.25rem' }}>
                {SEC('💰','মূল্য ও স্টক')}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'0.85rem' }}>
                  <div>
                    <label style={LS}>Price (৳) *</label>
                    <input style={{...IS, borderColor: (!form.price || parseFloat(form.price) <= 0) && modalErr ? '#fca5a5' : '#e5e7eb'}}
                      type="number" min="0.01" step="0.01" value={form.price} onChange={e=>F('price',e.target.value)} placeholder="0.00"
                      onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                  </div>
                  <div>
                    <label style={LS}>Stock</label>
                    <input style={IS} type="number" min="0" value={form.stock} onChange={e=>F('stock',e.target.value)} placeholder="0"
                      onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                  </div>
                  <div>
                    <label style={LS}>Type</label>
                    <select style={{...IS,cursor:'pointer'}} value={form.type} onChange={e=>F('type',e.target.value)}>
                      {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={LS}>Category</label>
                    <select style={{...IS,cursor:'pointer'}} value={form.category_id} onChange={e=>F('category_id',e.target.value)}>
                      <option value="">— বেছে নিন —</option>
                      {cats.map(c=><option key={c.category_id} value={c.category_id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Dosage ── */}
              <div style={{ marginBottom:'1.25rem' }}>
                {SEC('💊','ডোজ তথ্য')}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.85rem' }}>
                  <div>
                    <label style={LS}>Dosage Form</label>
                    <input style={IS} value={form.dosage_form} onChange={e=>F('dosage_form',e.target.value)} placeholder="যেমন: Tablet, Syrup"
                      onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                  </div>
                  <div>
                    <label style={LS}>Strength</label>
                    <input style={IS} value={form.strength} onChange={e=>F('strength',e.target.value)} placeholder="যেমন: 500mg"
                      onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                  </div>
                </div>
              </div>

              {/* ── Details ── */}
              <div>
                {SEC('📝','বিস্তারিত তথ্য')}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.85rem' }}>
                  <div style={{ gridColumn:'span 2' }}>
                    <label style={LS}>Description</label>
                    <textarea rows={3} value={form.description} onChange={e=>F('description',e.target.value)}
                      style={{...IS, resize:'vertical', lineHeight:1.6}}
                      onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                  </div>
                  {[
                    {k:'indications',       l:'Indications'},
                    {k:'dosage',            l:'Dosage & Administration'},
                    {k:'side_effects',      l:'Side Effects'},
                    {k:'contraindications', l:'Contraindications'},
                  ].map(f=>(
                    <div key={f.k}>
                      <label style={LS}>{f.l}</label>
                      <textarea rows={2} value={form[f.k]} onChange={e=>F(f.k,e.target.value)}
                        style={{...IS, resize:'vertical', lineHeight:1.6}}
                        onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Bottom Error (repeat for long forms) ── */}
              {modalErr && (
                <div style={{ background:'#fee2e2', border:'2px solid #fca5a5', borderRadius:12, padding:'12px 16px', marginTop:'1.25rem', color:'#dc2626', fontSize:'0.88rem', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:20 }}>⚠️</span>
                  <span>{modalErr}</span>
                </div>
              )}

              {/* ── Buttons ── */}
              <div style={{ display:'flex', gap:10, marginTop:'1.5rem', paddingTop:'1.25rem', borderTop:'1px solid #f3f4f6' }}>
                <button onClick={handleSave} disabled={saving||imgUploading}
                  style={{
                    flex:1, padding:'14px',
                    background: saving||imgUploading ? '#9ca3af' : 'linear-gradient(135deg,#0d9f6e,#076b49)',
                    border:'none', borderRadius:13,
                    cursor: saving||imgUploading ? 'wait' : 'pointer',
                    color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1rem',
                    boxShadow: saving||imgUploading ? 'none' : '0 6px 20px rgba(13,159,110,0.3)',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8
                  }}>
                  {saving || imgUploading ? (
                    <>
                      <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                      {imgUploading ? 'ছবি আপলোড হচ্ছে...' : 'সেভ হচ্ছে...'}
                    </>
                  ) : (
                    isAdding ? '✅ ওষুধ যোগ করুন' : '💾 পরিবর্তন সেভ করুন'
                  )}
                </button>
                <button onClick={()=>setEditOpen(false)}
                  style={{ padding:'14px 28px', background:'#f3f4f6', border:'none', borderRadius:13, cursor:'pointer', color:'#555', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.9rem' }}>
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MedicinesAdminPage;
