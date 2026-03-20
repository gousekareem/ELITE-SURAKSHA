import { useState, useEffect, useRef } from 'react';
import Shell from '../components/Shell';

export default function LoginScreen({ onNext }) {
  const [step, setStep]       = useState('phone');
  const [phone, setPhone]     = useState('');
  const [otp, setOtp]         = useState(['','','','','','']);
  const [timer, setTimer]     = useState(300);
  const [sending, setSending] = useState(false);
  const [otpError, setOtpError] = useState('');
  const refs = useRef([]);

  useEffect(() => {
    if (step !== 'otp') return;
    const id = setInterval(() => setTimer(t => t > 0 ? t-1 : 0), 1000);
    return () => clearInterval(id);
  }, [step]);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const rawPhone = phone.replace(/\s/g,'');

  const sendOtp = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setStep('otp'); setTimer(300); setOtp(['','','','','','']); setTimeout(() => refs.current[0]?.focus(), 100); }, 1300);
  };

  const handleOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    setOtpError('');
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) refs.current[i+1]?.focus();
    if (next.every(d=>d)) {
      if (next.join('') === '123456') setTimeout(onNext, 400);
      else setOtpError('Incorrect OTP. Use 1 2 3 4 5 6 for demo.');
    }
  };

  return (
    <Shell whiteBg noPadBottom>
      {/* Red header */}
      <div style={{ background:'linear-gradient(135deg, var(--red-900), var(--red))', padding:'48px 28px 36px' }}>
        <div className="anim-fade-up" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
          <span style={{ fontSize:24 }}>🛡️</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'#fff' }}>EliteSuraksha</span>
        </div>
        <h2 className="anim-fade-up delay-1" style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:6 }}>
          {step === 'phone' ? 'Welcome back' : 'Verify your OTP'}
        </h2>
        <p className="anim-fade-up delay-2" style={{ color:'rgba(255,255,255,0.7)', fontSize:14 }}>
          {step === 'phone' ? 'Login to your insurance account' : `OTP sent to +91 ${rawPhone.slice(0,5)}XXXXX`}
        </p>
      </div>

      {/* White form area */}
      <div style={{ background:'var(--white)', padding:'32px 28px 40px', borderRadius:'24px 24px 0 0', marginTop:-16, position:'relative', zIndex:2 }}>

        {step === 'phone' && (
          <div className="anim-fade-in">
            <div style={{ marginBottom:20 }}>
              <label className="form-label">Mobile Number</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14, fontWeight:700, color:'var(--gray-500)', borderRight:'1px solid var(--gray-200)', paddingRight:12, height:20, display:'flex', alignItems:'center' }}>+91</div>
                <input className="input-field" style={{ paddingLeft:60 }} placeholder="98765 43210"
                  value={phone} onChange={e => { let v=e.target.value.replace(/\D/g,''); if(v.length>5) v=v.slice(0,5)+' '+v.slice(5); setPhone(v.slice(0,11)); }}
                  inputMode="numeric" autoFocus maxLength={11} />
              </div>
            </div>

            <button className="btn-primary" disabled={rawPhone.length!==10||sending} onClick={sendOtp} style={{ marginBottom:16 }}>
              {sending ? <span className="anim-pulse">Sending OTP…</span> : 'Send OTP →'}
            </button>

            <div className="info-box info-box-red" style={{ textAlign:'center' }}>
              🔐 Demo — Use any 10-digit number · OTP: <strong>1 2 3 4 5 6</strong>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="anim-slide-in">
            <label className="form-label" style={{ marginBottom:16 }}>Enter 6-Digit OTP</label>
            <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:20 }}>
              {otp.map((d,i) => (
                <input key={i} ref={el=>refs.current[i]=el} type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e=>handleOtp(i,e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Backspace'&&!d&&i>0) refs.current[i-1]?.focus(); }}
                  style={{
                    width:46, height:54, textAlign:'center', fontSize:22, fontWeight:700,
                    background: d ? 'var(--red-50)' : 'var(--white)',
                    border:`2px solid ${otpError?'var(--red-400)':d?'var(--red)':'var(--gray-200)'}`,
                    borderRadius:12, color:'var(--gray-900)', outline:'none',
                    fontFamily:'var(--font-display)', transition:'all .18s',
                    boxShadow: d ? '0 0 0 3px rgba(200,16,46,0.08)' : 'var(--shadow-sm)',
                  }} />
              ))}
            </div>

            {otpError && <p style={{ textAlign:'center', color:'var(--red)', fontSize:13, marginBottom:12, fontWeight:500 }}>{otpError}</p>}

            <div style={{ textAlign:'center', marginBottom:24 }}>
              {timer > 0
                ? <span style={{ color:'var(--gray-500)', fontSize:13 }}>Resend in <strong style={{ color:'var(--red)', fontFamily:'var(--font-display)' }}>{fmt(timer)}</strong></span>
                : <span style={{ color:'var(--red)', cursor:'pointer', fontSize:13, fontWeight:700 }} onClick={()=>{setTimer(300);setOtp(['','','','','','']);setOtpError('');}}>Resend OTP</span>
              }
            </div>

            <button className="btn-primary" onClick={onNext} disabled={!otp.every(d=>d)} style={{ marginBottom:10 }}>
              Verify & Continue →
            </button>
            <button className="btn-secondary" onClick={() => setStep('phone')}>← Change Number</button>
          </div>
        )}
      </div>
    </Shell>
  );
}
