import { useState } from 'react';
import Shell from '../components/Shell';
import { useApp } from '../services/AppContext';

function StepBar({ current }) {
  const steps = ['Identity','Employment','Done'];
  return (
    <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
      {steps.map((label,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', flex: i<steps.length-1 ? 1 : 'none' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{
              width:32, height:32, borderRadius:'50%',
              background: i<current ? 'var(--success)' : i===current ? 'var(--red)' : 'var(--gray-100)',
              border: i===current ? '2px solid rgba(200,16,46,0.3)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontWeight:800, transition:'all 0.4s',
              color: i<=current ? '#fff' : 'var(--gray-400)',
              boxShadow: i===current ? '0 4px 12px rgba(200,16,46,0.25)' : 'none',
            }}>{i < current ? '✓' : i+1}</div>
            <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px', textAlign:'center', width:64, color: i<=current ? 'var(--gray-700)' : 'var(--gray-400)' }}>{label}</span>
          </div>
          {i < steps.length-1 && (
            <div style={{ flex:1, height:2, margin:'0 4px', marginBottom:22, background: i<current ? 'var(--success)' : 'var(--gray-100)', transition:'background 0.5s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function VerificationScreen({ onNext }) {
  const { setUser } = useApp();
  const [step,setStep]         = useState(0);
  const [aadhaar,setAadhaar]   = useState('');
  const [verifying,setVerifying] = useState(false);
  const [aVerified,setAVerified] = useState(false);
  const [platform,setPlatform] = useState('');
  const [uploaded,setUploaded] = useState(false);

  const handleAadhaar = e => {
    let v = e.target.value.replace(/\D/g,'');
    if(v.length>4) v=v.slice(0,4)+' '+v.slice(4);
    if(v.length>9) v=v.slice(0,9)+' '+v.slice(9);
    setAadhaar(v.slice(0,14));
  };

  const verifyAadhaar = () => {
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setAVerified(true); setTimeout(()=>setStep(1), 900); }, 2000);
  };

  const complete = () => {
    setVerifying(true);
    setUser(u => ({ ...u, platform, enrolled:true }));
    setTimeout(() => { setVerifying(false); setStep(2); setTimeout(onNext,1600); }, 2000);
  };

  return (
    <Shell whiteBg noPadBottom>
      {/* Red header */}
      <div style={{ background:'linear-gradient(135deg, var(--red-900), var(--red))', padding:'48px 28px 32px' }}>
        <div className="anim-fade-up" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <span style={{ fontSize:22 }}>🛡️</span>
          <span style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, color:'#fff' }}>EliteSuraksha</span>
        </div>
        <h2 className="anim-fade-up delay-1" style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'#fff', marginBottom:4 }}>Verify Identity</h2>
        <p className="anim-fade-up delay-2" style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>2-step verification to activate your coverage</p>
      </div>

      <div style={{ background:'var(--white)', borderRadius:'24px 24px 0 0', marginTop:-16, padding:'32px 28px 40px', position:'relative', zIndex:2 }}>
        <StepBar current={step} />

        {/* Step 0 — Aadhaar */}
        {step === 0 && (
          <div className="anim-slide-in">
            <div className="card" style={{ padding:20, marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                <div style={{ width:44,height:44,borderRadius:12,background:'var(--red-50)',border:'1px solid var(--red-100)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>🪪</div>
                <div>
                  <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)' }}>Aadhaar eKYC</p>
                  <p style={{ color:'var(--gray-500)', fontSize:12 }}>Secure identity via UIDAI</p>
                </div>
              </div>
              <label className="form-label">12-Digit Aadhaar Number</label>
              <input className="input-field" placeholder="XXXX  XXXX  XXXX" value={aadhaar} onChange={handleAadhaar} inputMode="numeric" disabled={aVerified} />
              {aVerified && (
                <div className="anim-fade-in info-box info-box-green" style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
                  <span>✅</span> Identity Verified — <strong>Ramesh Kumar</strong>
                </div>
              )}
            </div>
            <div className="info-box info-box-gray" style={{ marginBottom:16, fontSize:12 }}>🔒 Aadhaar is SHA-256 hashed. Never stored in plaintext. DPDP Act 2023 compliant.</div>
            <div className="info-box info-box-amber" style={{ textAlign:'center', marginBottom:16 }}>Demo: Enter <strong>1234 5678 9012</strong></div>
            <button className="btn-primary" onClick={verifyAadhaar} disabled={aadhaar.replace(/\s/g,'').length!==12||verifying||aVerified}>
              {verifying ? <span className="anim-pulse">Verifying with UIDAI…</span> : aVerified ? '✓ Verified — proceeding…' : 'Verify Aadhaar →'}
            </button>
          </div>
        )}

        {/* Step 1 — Employment */}
        {step === 1 && (
          <div className="anim-slide-in">
            <div className="card" style={{ padding:20, marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                <div style={{ width:44,height:44,borderRadius:12,background:'var(--info-bg)',border:'1px solid #BFDBFE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>🛵</div>
                <div>
                  <p style={{ fontWeight:700, fontSize:15, color:'var(--gray-900)' }}>Employment Proof</p>
                  <p style={{ color:'var(--gray-500)', fontSize:12 }}>Select platform & upload proof</p>
                </div>
              </div>

              <label className="form-label">Your Platform</label>
              <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                {['Swiggy','Zomato','Both'].map(p => (
                  <button key={p} onClick={()=>setPlatform(p)} style={{
                    flex:1, padding:'11px 0', borderRadius:10, cursor:'pointer',
                    background: platform===p ? 'var(--red-50)' : 'var(--gray-50)',
                    border:`1.5px solid ${platform===p ? 'var(--red)' : 'var(--gray-200)'}`,
                    color: platform===p ? 'var(--red)' : 'var(--gray-500)',
                    fontWeight:700, fontSize:13, transition:'all .18s',
                  }}>{p}</button>
                ))}
              </div>

              <label className="form-label">Earnings Screenshot</label>
              <div onClick={()=>setUploaded(true)} style={{
                border:`2px dashed ${uploaded?'var(--success)':'var(--gray-200)'}`,
                borderRadius:14, padding:'24px 16px', textAlign:'center', cursor:'pointer',
                background: uploaded?'var(--success-bg)':'var(--gray-50)',
                transition:'all 0.3s',
              }}>
                {uploaded ? (
                  <><div style={{ fontSize:30, marginBottom:6 }}>✅</div>
                  <p style={{ color:'var(--success)', fontWeight:700, fontSize:14 }}>earnings_screenshot.jpg</p>
                  <p style={{ color:'var(--gray-500)', fontSize:12, marginTop:2 }}>AI OCR: 1,247 orders · ⭐4.8 · Ramesh Kumar</p></>
                ) : (
                  <><div style={{ fontSize:30, marginBottom:8 }}>📸</div>
                  <p style={{ color:'var(--gray-600)', fontSize:14, fontWeight:500 }}>Tap to upload screenshot</p>
                  <p style={{ color:'var(--gray-400)', fontSize:12, marginTop:2 }}>Swiggy / Zomato earnings page</p></>
                )}
              </div>
            </div>
            <button className="btn-primary" onClick={complete} disabled={!platform||!uploaded||verifying}>
              {verifying ? <span className="anim-pulse">Activating Coverage…</span> : 'Complete Verification →'}
            </button>
          </div>
        )}

        {/* Step 2 — Done */}
        {step === 2 && (
          <div className="anim-fade-in" style={{ textAlign:'center', padding:'20px 0' }}>
            <div className="anim-bounce" style={{ width:100,height:100,borderRadius:'50%',background:'var(--success-bg)',border:'2px solid #A7F3D0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:46,margin:'0 auto 20px' }}>✅</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, color:'var(--success)', marginBottom:8 }}>You're Covered!</h3>
            <p style={{ color:'var(--gray-500)', fontSize:14 }}>Coverage activated · Redirecting to dashboard…</p>
          </div>
        )}
      </div>
    </Shell>
  );
}
