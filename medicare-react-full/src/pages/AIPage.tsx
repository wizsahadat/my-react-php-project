import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer';

interface AIPageProps {
  onNavigate: (page: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const quickQuestions = [
  '💊 Napa Extra এর ডোজ কী?',
  '🤧 জ্বরের জন্য কোন ওষুধ ভালো?',
  '❤️ উচ্চ রক্তচাপের ওষুধ কোনগুলো?',
  '⚠️ Paracetamol এর side effects কী?',
  '🧠 ঘুমের সমস্যায় কী খাওয়া যায়?',
  '💉 Antibiotic কতদিন খেতে হয়?',
];

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are MediCare AI, a helpful pharmacy assistant from Bangladesh.
Rules:
1. Respond in the SAME language the user uses (বাংলায় জিজ্ঞেস করলে বাংলায় উত্তর দাও)
2. Give dosage, side effects, generic name info clearly
3. Always advise consulting a doctor for serious issues
4. MediCare Pharmacy: Siddhirgonj, Narayangonj | +880 1827505973 | Open 24/7`;

const AIPage: React.FC<AIPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'আসসালামুয়ালাইকুম! আমি MediCare AI Assistant 🌿\n\nআমি আপনার ওষুধ সম্পর্কিত যেকোনো প্রশ্নের উত্তর দিতে পারি। প্রেসক্রিপশন পড়তে পারি, ওষুধ চিনতে পারি।\n\nআজ কীভাবে সাহায্য করতে পারি?',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg: Message = {
      role: 'user', content: msg,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          max_tokens: 1024,
          temperature: 0.7
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'দুঃখিত, উত্তর পাওয়া যায়নি।';

      setMessages(prev => [...prev, {
        role: 'assistant', content: reply,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ সংযোগে সমস্যা হয়েছে। Internet connection চেক করুন এবং আবার চেষ্টা করুন।',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fdf9', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a2e1e, #0d9f6e)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 50, padding: '5px 16px', marginBottom: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.72rem', color: '#4ade80', letterSpacing: '0.1em' }}>✨ POWERED BY GROQ AI (LLAMA 3.3)</div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '0.5rem' }}>MediCare AI Assistant</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>ওষুধ সম্পর্কে যেকোনো প্রশ্ন করুন বাংলায়</p>
      </div>

      <div style={{ flex: 1, maxWidth: 800, width: '100%', margin: '2rem auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(13,159,110,0.12)' }}>
          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: '#888', marginBottom: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>দ্রুত প্রশ্ন করুন</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {quickQuestions.map(q => (
              <button key={q} onClick={() => sendMessage(q.replace(/^.{2} /, ''))}
                style={{ background: '#f0fdf4', border: '1.5px solid rgba(13,159,110,0.2)', borderRadius: 50, padding: '7px 14px', cursor: 'pointer', fontSize: '0.82rem', color: '#065f46', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0d9f6e'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0d9f6e'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#065f46'; e.currentTarget.style.borderColor = 'rgba(13,159,110,0.2)'; }}
              >{q}</button>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(13,159,110,0.12)', minHeight: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg, #0d9f6e, #076b49)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌿</div>
              )}
              <div style={{ maxWidth: '75%' }}>
                <div style={{ background: msg.role === 'user' ? 'linear-gradient(135deg, #0d9f6e, #076b49)' : '#f7fdf9', color: msg.role === 'user' ? '#fff' : '#0d1117', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '12px 16px', fontSize: '0.9rem', lineHeight: 1.7, border: msg.role === 'assistant' ? '1px solid rgba(13,159,110,0.15)' : 'none', whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                <div style={{ fontSize: '0.68rem', color: '#aaa', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
              </div>
              {msg.role === 'user' && (
                <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #0d9f6e, #076b49)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌿</div>
              <div style={{ background: '#f7fdf9', border: '1px solid rgba(13,159,110,0.15)', borderRadius: '18px 18px 18px 4px', padding: '14px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0,1,2].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: '#0d9f6e', animation: 'bounce 1.2s ease infinite', animationDelay: `${d * 0.2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(13,159,110,0.12)', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="ওষুধ সম্পর্কে জিজ্ঞেস করুন... (Enter চাপুন)" rows={2}
            style={{ flex: 1, border: '2px solid rgba(13,159,110,0.2)', borderRadius: 14, padding: '12px 16px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', resize: 'none', outline: 'none', color: '#0d1117', background: '#f7fdf9', transition: 'border-color 0.2s' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#0d9f6e'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(13,159,110,0.2)'; }}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: (loading || !input.trim()) ? '#e5e7eb' : 'linear-gradient(135deg, #0d9f6e, #076b49)', border: 'none', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          >➤</button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#aaa' }}>⚠️ AI পরামর্শ চিকিৎসকের বিকল্প নয়। গুরুতর সমস্যায় ডাক্তার দেখান।</p>
      </div>

      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }`}</style>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default AIPage;
