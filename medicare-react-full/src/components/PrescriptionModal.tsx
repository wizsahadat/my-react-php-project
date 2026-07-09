import React, { useState, useRef, useCallback, useEffect } from 'react';

const RX_API = 'http://localhost/medicare-backend/api/prescriptions.php';

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
  onOpenLogin: () => void;
}

type UploadStep = 'choose' | 'camera' | 'preview' | 'form' | 'success';

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ isOpen, onClose, user, onOpenLogin }) => {
  const [step,       setStep]       = useState<UploadStep>('choose');
  const [imgFile,    setImgFile]    = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState('');
  const [form,       setForm]       = useState({ name: user?.name||'', phone:'', location:'', duration:'', notes:'' });
  const [locLoading, setLocLoading] = useState(false);
  const [coords,     setCoords]     = useState<{lat:number;lng:number}|null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Camera state
  const [camStream,  setCamStream]  = useState<MediaStream|null>(null);
  const [camFacing,  setCamFacing]  = useState<'environment'|'user'>('environment');
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync user name
  useEffect(() => {
    if (user?.name) setForm(p => ({...p, name: user.name}));
  }, [user]);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen) { stopCamera(); resetAll(); }
  }, [isOpen]);

  const resetAll = () => {
    setStep('choose'); setImgFile(null); setImgPreview('');
    setForm({ name:user?.name||'', phone:'', location:'', duration:'', notes:'' });
    setCoords(null); setError(''); setSuccessMsg('');
    stopCamera();
  };

  const stopCamera = () => {
    if (camStream) { camStream.getTracks().forEach(t => t.stop()); setCamStream(null); }
  };

  // ── START CAMERA ──
  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: camFacing, width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      setCamStream(stream);
      setStep('camera');
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch (err: any) {
      if (err.name === 'NotAllowedError') setError('📷 Camera permission দিন। Browser settings এ camera allow করুন।');
      else setError('Camera চালু করা যায়নি। Gallery থেকে ছবি দিন।');
    }
  };

  const switchCamera = async () => {
    stopCamera();
    const newFacing = camFacing === 'environment' ? 'user' : 'environment';
    setCamFacing(newFacing);
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newFacing } });
    setCamStream(stream);
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  // ── CAPTURE PHOTO ──
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width  = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d')!.drawImage(v, 0, 0);
    c.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `prescription_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setImgFile(file);
      setImgPreview(URL.createObjectURL(blob));
      stopCamera();
      setStep('preview');
    }, 'image/jpeg', 0.92);
  };

  // ── GALLERY SELECT ──
  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setError('ছবির সাইজ ৮MB এর বেশি হতে পারবে না'); return; }
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
    setStep('preview');
  };

  // ── GET LOCATION ──
  const getLocation = () => {
    if (!navigator.geolocation) { setForm(p => ({...p, location: 'Location supported নয়'})); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        // Reverse geocode using open API
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setForm(p => ({...p, location: addr}));
        } catch {
          setForm(p => ({...p, location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`}));
        }
        setLocLoading(false);
      },
      err => {
        setLocLoading(false);
        setForm(p => ({...p, location: 'Location নেওয়া যায়নি'}));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ── SUBMIT ──
  const handleSubmit = async () => {
    setError('');
    if (!user) { onOpenLogin(); return; }
    if (!form.name.trim()) { setError('আপনার নাম দিন'); return; }
    if (!form.phone.trim()) { setError('ফোন নম্বর দিন'); return; }
    if (!/^01[3-9]\d{8}$/.test(form.phone)) { setError('সঠিক মোবাইল নম্বর দিন'); return; }
    if (!imgFile) { setError('প্রেসক্রিপশনের ছবি দিন'); return; }

    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      if (imgFile) fd.append('image', imgFile);
      fd.append('patient_name', form.name);
      fd.append('phone',        form.phone);
      fd.append('location',     form.location);
      fd.append('duration',     form.duration);
      fd.append('notes',        form.notes);
      if (coords) { fd.append('lat', String(coords.lat)); fd.append('lng', String(coords.lng)); }

      const res = await fetch(`${RX_API}?action=submit`, {
        method: 'POST',
        body: fd,
        credentials: 'include'
        // NOTE: Content-Type header দেবেন না — browser নিজে boundary সহ দেবে
      });

      // Check HTTP status
      if (!res.ok) {
        const text = await res.text();
        console.error('Server response:', text);
        setError(`Server error (${res.status})। XAMPP চালু আছে কিনা দেখুন।`);
        setSubmitting(false);
        return;
      }

      // Parse JSON
      let data: any;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error('Invalid JSON:', text);
        setError('Server থেকে invalid response। Console দেখুন।');
        setSubmitting(false);
        return;
      }

      if (data.success) {
        setSuccessMsg(data.msg);
        setStep('success');
      } else {
        setError(data.msg || 'Submit হয়নি। আবার চেষ্টা করুন।');
      }
    } catch (err: any) {
      console.error('Prescription submit error:', err);
      if (err?.message?.includes('Failed to fetch')) {
        setError('⚠️ Server এ সংযোগ করা যাচ্ছে না। XAMPP চালু আছে কিনা দেখুন।');
      } else {
        setError('⚠️ ' + (err?.message || 'Unknown error'));
      }
    }
    setSubmitting(false);
  };

  const F = (k: string, v: string) => { setForm(p => ({...p, [k]: v})); setError(''); };

  const IS: React.CSSProperties = {
    width:'100%', boxSizing:'border-box', padding:'11px 14px',
    border:'1.5px solid #e5e7eb', borderRadius:11,
    fontFamily:'DM Sans,sans-serif', fontSize:'0.88rem', color:'#0d1117',
    outline:'none', background:'#fafafa', transition:'border-color 0.2s'
  };

  if (!isOpen) return null;

  return (
    <div onClick={e => { if (e.target === e.currentTarget) { stopCamera(); onClose(); } }}
      style={{ position:'fixed', inset:0, zIndex:9600, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>

      <div style={{ background:'#fff', borderRadius:24, width:'100%', maxWidth:520, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,0.4)' }}>

        {/* Header */}
        <div style={{ padding:'1.25rem 1.5rem', background:'linear-gradient(135deg,#0a2e1e,#0d9f6e)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:24 }}>📋</span>
            <div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#fff', fontSize:'1.05rem' }}>প্রেসক্রিপশন পাঠান</div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.75rem' }}>ছবি তুলুন বা গ্যালারি থেকে বেছে নিন</div>
            </div>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }}
            style={{ width:34, height:34, borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.2)', color:'#fff', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>

        {/* Progress dots */}
        {step !== 'success' && (
          <div style={{ display:'flex', justifyContent:'center', gap:8, padding:'0.85rem', background:'#f8fafc', flexShrink:0 }}>
            {(['choose','preview','form'] as UploadStep[]).map((s,i) => {
              const steps: UploadStep[] = ['choose','preview','form'];
              const stepIdx = steps.indexOf(step as UploadStep);
              const sIdx    = steps.indexOf(s);
              const isCurrent = step === s || (step === 'camera' && s === 'choose');
              const isDone    = stepIdx > sIdx;
              return (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.78rem',
                    background: isCurrent || isDone ? '#0d9f6e' : '#e5e7eb',
                    color: '#fff' }}>{i+1}</div>
                  {i<2 && <div style={{ width:24, height:2, background: isDone ? '#0d9f6e' : '#e5e7eb' }} />}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ flex:1, overflowY:'auto', padding: step==='camera' ? 0 : '1.5rem' }}>

          {/* Error */}
          {error && step !== 'camera' && (
            <div style={{ background:'#fee2e2', border:'1.5px solid #fca5a5', borderRadius:11, padding:'10px 14px', marginBottom:'1rem', color:'#dc2626', fontSize:'0.85rem', fontWeight:600, display:'flex', gap:8 }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── STEP: CHOOSE ── */}
          {step === 'choose' && (
            <div>
              {!user && (
                <div style={{ background:'#fefce8', border:'1.5px solid #fde68a', borderRadius:12, padding:'0.85rem 1rem', marginBottom:'1.25rem', fontSize:'0.82rem', color:'#92400e' }}>
                  ⚠️ প্রেসক্রিপশন পাঠাতে <button onClick={onOpenLogin} style={{ background:'none', border:'none', cursor:'pointer', color:'#0d9f6e', fontWeight:700, textDecoration:'underline', fontSize:'0.82rem' }}>Login করুন</button>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                {/* Camera */}
                <div onClick={startCamera}
                  style={{ border:'2px dashed #0d9f6e', borderRadius:18, padding:'2rem 1rem', textAlign:'center', cursor:'pointer', background:'rgba(13,159,110,0.04)', transition:'all 0.2s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(13,159,110,0.1)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(13,159,110,0.04)';}}
                >
                  <div style={{ fontSize:44, marginBottom:10 }}>📷</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.92rem', color:'#0d9f6e' }}>ক্যামেরা</div>
                  <div style={{ fontSize:'0.75rem', color:'#888', marginTop:4 }}>এখনই ছবি তুলুন</div>
                </div>
                {/* Gallery */}
                <div onClick={()=>fileInputRef.current?.click()}
                  style={{ border:'2px dashed #6366f1', borderRadius:18, padding:'2rem 1rem', textAlign:'center', cursor:'pointer', background:'rgba(99,102,241,0.04)', transition:'all 0.2s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.1)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(99,102,241,0.04)';}}
                >
                  <div style={{ fontSize:44, marginBottom:10 }}>🖼️</div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.92rem', color:'#6366f1' }}>গ্যালারি</div>
                  <div style={{ fontSize:'0.75rem', color:'#888', marginTop:4 }}>ফোন থেকে বেছে নিন</div>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleGallery} />
              <div style={{ background:'#f0fdf4', borderRadius:12, padding:'0.85rem 1rem', fontSize:'0.8rem', color:'#065f46', lineHeight:1.7 }}>
                💡 <strong>টিপস:</strong> প্রেসক্রিপশনটি পরিষ্কার আলোতে ছবি তুলুন। সব লেখা স্পষ্ট থাকতে হবে।
              </div>
            </div>
          )}

          {/* ── STEP: CAMERA ── */}
          {step === 'camera' && (
            <div style={{ position:'relative', background:'#000', minHeight:300 }}>
              <video ref={videoRef} autoPlay playsInline muted
                style={{ width:'100%', maxHeight:'55vh', objectFit:'cover', display:'block' }} />
              <canvas ref={canvasRef} style={{ display:'none' }} />

              {error && (
                <div style={{ position:'absolute', top:12, left:12, right:12, background:'rgba(220,38,38,0.9)', color:'#fff', borderRadius:10, padding:'10px 14px', fontSize:'0.83rem' }}>
                  {error}
                </div>
              )}

              <div style={{ padding:'1rem', background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'space-around', alignItems:'center' }}>
                <button onClick={()=>{stopCamera();setStep('choose');}}
                  style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:50, padding:'10px 18px', color:'#fff', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>
                  ← ফিরুন
                </button>
                <button onClick={capturePhoto}
                  style={{ width:64, height:64, borderRadius:'50%', background:'#fff', border:'4px solid #0d9f6e', cursor:'pointer', fontSize:28, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }}>
                  📷
                </button>
                <button onClick={switchCamera}
                  style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:50, padding:'10px 18px', color:'#fff', cursor:'pointer', fontSize:'0.82rem', fontWeight:600 }}>
                  🔄 ঘুরান
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: PREVIEW ── */}
          {step === 'preview' && (
            <div>
              <div style={{ borderRadius:16, overflow:'hidden', border:'2px solid #e5e7eb', marginBottom:'1rem', position:'relative' }}>
                <img src={imgPreview} alt="prescription"
                  style={{ width:'100%', maxHeight:320, objectFit:'contain', background:'#f8fafc', display:'block' }} />
                <div style={{ position:'absolute', top:10, right:10, display:'flex', gap:8 }}>
                  <button onClick={()=>{setStep('choose');setImgFile(null);setImgPreview('');}}
                    style={{ background:'rgba(0,0,0,0.6)', border:'none', borderRadius:8, padding:'6px 12px', color:'#fff', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>
                    🔄 পরিবর্তন
                  </button>
                </div>
              </div>
              <p style={{ textAlign:'center', color:'#888', fontSize:'0.82rem', marginBottom:'1rem' }}>
                ছবিটি কি স্পষ্ট? সব লেখা পড়া যাচ্ছে?
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <button onClick={()=>{setStep('choose');setImgFile(null);setImgPreview('');}}
                  style={{ padding:'12px', background:'#f3f4f6', border:'none', borderRadius:12, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#555' }}>
                  ← আবার তুলুন
                </button>
                <button onClick={()=>setStep('form')}
                  style={{ padding:'12px', background:'linear-gradient(135deg,#0d9f6e,#076b49)', border:'none', borderRadius:12, cursor:'pointer', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:700, boxShadow:'0 4px 14px rgba(13,159,110,0.3)' }}>
                  এগিয়ে যান →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: FORM ── */}
          {step === 'form' && (
            <div>
              {/* Image thumb */}
              <div style={{ display:'flex', gap:12, alignItems:'center', background:'#f0fdf4', borderRadius:12, padding:'0.85rem', marginBottom:'1.25rem' }}>
                <img src={imgPreview} alt="" style={{ width:60, height:60, borderRadius:10, objectFit:'cover', border:'1.5px solid #bbf7d0' }} />
                <div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.85rem', color:'#065f46' }}>✅ প্রেসক্রিপশন ছবি প্রস্তুত</div>
                  <button onClick={()=>setStep('preview')} style={{ background:'none', border:'none', cursor:'pointer', color:'#0d9f6e', fontSize:'0.75rem', textDecoration:'underline', padding:0, marginTop:3 }}>পরিবর্তন করুন</button>
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
                {/* Name */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.76rem', color:'#555', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:5 }}>আপনার নাম *</label>
                  <input value={form.name} onChange={e=>F('name',e.target.value)} placeholder="পুরো নাম লিখুন" style={IS}
                    onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                </div>
                {/* Phone */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.76rem', color:'#555', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:5 }}>মোবাইল নম্বর *</label>
                  <input value={form.phone} onChange={e=>F('phone',e.target.value)} placeholder="01XXXXXXXXX" maxLength={11} style={IS}
                    onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                </div>
                {/* Location */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.76rem', color:'#555', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:5 }}>ডেলিভারি ঠিকানা</label>
                  <div style={{ display:'flex', gap:8 }}>
                    <input value={form.location} onChange={e=>F('location',e.target.value)} placeholder="ঠিকানা লিখুন অথবা GPS দিয়ে নিন"
                      style={{...IS, flex:1}}
                      onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                    <button onClick={getLocation} disabled={locLoading}
                      title="GPS থেকে location নিন"
                      style={{ padding:'0 14px', border:'1.5px solid #0d9f6e', borderRadius:11, background:'#f0fdf4', color:'#0d9f6e', cursor:'pointer', fontSize:20, flexShrink:0, display:'flex', alignItems:'center' }}>
                      {locLoading ? '⏳' : '📍'}
                    </button>
                  </div>
                  {coords && <div style={{ fontSize:'0.72rem', color:'#059669', marginTop:4 }}>✅ GPS location নেওয়া হয়েছে</div>}
                </div>
                {/* Duration */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.76rem', color:'#555', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:5 }}>কত দিনের ওষুধ লাগবে?</label>
                  <select value={form.duration} onChange={e=>F('duration',e.target.value)} style={{...IS, cursor:'pointer'}}>
                    <option value="">— বেছে নিন —</option>
                    <option value="3 দিন">৩ দিন</option>
                    <option value="5 দিন">৫ দিন</option>
                    <option value="7 দিন">৭ দিন</option>
                    <option value="10 দিন">১০ দিন</option>
                    <option value="15 দিন">১৫ দিন</option>
                    <option value="30 দিন">৩০ দিন / ১ মাস</option>
                    <option value="চলমান">চলমান (Ongoing)</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
                {/* Notes */}
                <div>
                  <label style={{ display:'block', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.76rem', color:'#555', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:5 }}>অতিরিক্ত তথ্য <span style={{ color:'#aaa', fontWeight:400, textTransform:'none' }}>(optional)</span></label>
                  <textarea value={form.notes} onChange={e=>F('notes',e.target.value)} rows={2}
                    placeholder="যেমন: রোগীর বয়স, এলার্জি, বিশেষ নির্দেশনা..."
                    style={{...IS, resize:'vertical', lineHeight:1.6}}
                    onFocus={e=>{e.target.style.borderColor='#0d9f6e';}} onBlur={e=>{e.target.style.borderColor='#e5e7eb';}} />
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'0.75rem', marginTop:'1.25rem' }}>
                <button onClick={()=>setStep('preview')}
                  style={{ padding:'13px', background:'#f3f4f6', border:'none', borderRadius:13, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, color:'#555' }}>
                  ← ফিরুন
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ padding:'13px', background: submitting?'#9ca3af':'linear-gradient(135deg,#0d9f6e,#076b49)', border:'none', borderRadius:13, cursor: submitting?'wait':'pointer', color:'#fff', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'0.95rem', boxShadow: submitting?'none':'0 6px 20px rgba(13,159,110,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  {submitting ? (
                    <><div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> পাঠানো হচ্ছে...</>
                  ) : '📤 প্রেসক্রিপশন পাঠান'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === 'success' && (
            <div style={{ textAlign:'center', padding:'1rem 0' }}>
              <div style={{ fontSize:64, marginBottom:'1rem' }}>✅</div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.3rem', color:'#0d1117', marginBottom:'0.5rem' }}>প্রেসক্রিপশন জমা হয়েছে!</h3>
              <p style={{ color:'#555', fontSize:'0.88rem', lineHeight:1.7, marginBottom:'1.5rem' }}>{successMsg}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.25rem' }}>
                {[
                  { icon:'⏱️', label:'রিভিউ সময়', val:'১-২ ঘণ্টা' },
                  { icon:'📞', label:'যোগাযোগ', val:form.phone },
                  { icon:'📍', label:'ঠিকানা', val:form.location||'দেওয়া হয়নি' },
                  { icon:'⏳', label:'মেয়াদ', val:form.duration||'উল্লেখ করা হয়নি' },
                ].map(s=>(
                  <div key={s.label} style={{ background:'#f0fdf4', borderRadius:12, padding:'0.85rem', textAlign:'left' }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
                    <div style={{ fontSize:'0.7rem', color:'#aaa', fontWeight:600, textTransform:'uppercase' }}>{s.label}</div>
                    <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.8rem', color:'#0d1117', marginTop:2, wordBreak:'break-word' }}>{s.val.length > 30 ? s.val.slice(0,30)+'...' : s.val}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>{resetAll();onClose();}}
                style={{ padding:'13px 32px', background:'linear-gradient(135deg,#0d9f6e,#076b49)', color:'#fff', border:'none', borderRadius:14, cursor:'pointer', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'0.95rem' }}>
                ✓ বন্ধ করুন
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PrescriptionModal;
