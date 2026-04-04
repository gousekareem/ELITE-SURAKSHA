import { useState } from 'react';
import Shell from '../components/Shell';
import BottomNav from '../components/BottomNav';
import { useApp } from '../services/AppContext';
import { PAYOUTS } from '../services/weatherService';

const EVENTS = [
  { id:'rain',   icon:'🌧️', label:'Heavy Rain',      desc:'Rainfall > 50mm/hr' },
  { id:'aqi',    icon:'😷', label:'Hazardous AQI',   desc:'AQI index > 300' },
  { id:'heat',   icon:'🌡️', label:'Extreme Heat',    desc:'Temperature > 42°C' },
  { id:'curfew', icon:'🚫', label:'Curfew / Bandh',  desc:'Official order issued' },
  { id:'outage', icon:'📴', label:'Platform Outage', desc:'Swiggy / Zomato down' },
  { id:'flood',  icon:'🌊', label:'Flood Warning',   desc:'NDMA official alert' },
];

const INTENSITIES = [
  { id:'mild',     label:'Mild',     color:'var(--success)' },
  { id:'moderate', label:'Moderate', color:'var(--warn)'    },
  { id:'severe',   label:'Severe',   color:'var(--red)'     },
];

const STEPS = ['Detecting Event','Validating Conditions','Fraud Check','Processing Payout'];

export default function SimulateScreen({ onNav }) {
  const { addPayout } = useApp();
  const [selected,  setSelected]  = useState(null);
  const [intensity, setIntensity] = useState('moderate');
  const [phase,     setPhase]     = useState('idle');
  const [curStep,   setCurStep]   = useState(0);
  const [paidAmt,   setPaidAmt]   = useState(0);
  const [claimRef,  setClaimRef]  = useState('');

  const runSim = () => {
    const evt = EVENTS.find(e=>e.id===selected);
    const amt = PAYOUTS[selected]?.[intensity] || 400;
    setPaidAmt(amt); setPhase('running'); setCurStep(0);
    STEPS.forEach((_,i) => setTimeout(()=>setCurStep(i+1),(i+1)*1100));
    setTimeout(()=>{ const p=addPayout({event:evt.label,amt,icon:evt.icon}); setClaimRef(p.ref); setPhase('done'); }, STEPS.length*1100+600);
  };

  const reset = () => { setPhase('idle'); setCurStep(0); setSelected(null); setIntensity('moderate'); };
  const selEvt = EVENTS.find(e=>e.id===selected);
  const preview = selEvt ? PAYOUTS[selected]?.[intensity] : null;

  return (
    <Shell>
      <div style={{ padding:'52px 20px 20px' }}>

        {/* Header */}
        <div className="anim-fade-up" style={{ marginBottom:22 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, color:'var(--gray-900)', marginBottom:8 }}>Simulate Event</h2>
          <div className="info-box info-box-amber" style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span>⚡</span><span>DEMO MODE — Simulates the real AI trigger pipeline</span>
          </div>
        </div>

        {phase === 'idle' && (
          <>
            {/* Event grid */}
            <div className="anim-fade-up delay-1 card" style={{ padding:18, marginBottom:14 }}>
              <label className="form-label" style={{ marginBottom:14 }}>Select Event Type</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {EVENTS.map(e => (
                  <button key={e.id} onClick={()=>setSelected(e.id)} style={{
                    padding:'15px 10px', borderRadius:14, cursor:'pointer', textAlign:'center',
                    background: selected===e.id ? 'var(--red-50)' : 'var(--gray-50)',
                    border:`1.5px solid ${selected===e.id?'var(--red)':'var(--gray-200)'}`,
                    transition:'all .18s',
                    boxShadow: selected===e.id ? '0 0 0 3px rgba(200,16,46,0.10)' : 'none',
                  }}>
                    <div style={{ fontSize:28, marginBottom:6 }}>{e.icon}</div>
                    <p style={{ fontSize:12, fontWeight:700, color:selected===e.id?'var(--red)':'var(--gray-600)', marginBottom:2 }}>{e.label}</p>
                    <p style={{ fontSize:10, color:'var(--gray-400)' }}>{e.desc}</p>
                    {selected===e.id && <p style={{ fontSize:12, color:'var(--success)', fontWeight:800, marginTop:5 }}>₹{PAYOUTS[e.id]?.[intensity]}</p>}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div className="anim-fade-up delay-2 card" style={{ padding:18, marginBottom:14 }}>
              <label className="form-label" style={{ marginBottom:12 }}>Severity Level</label>
              <div style={{ display:'flex', gap:10 }}>
                {INTENSITIES.map(it => (
                  <button key={it.id} onClick={()=>setIntensity(it.id)} style={{
                    flex:1, padding:'12px 0', borderRadius:10, cursor:'pointer',
                    background: intensity===it.id ? (it.id==='mild'?'var(--success-bg)':it.id==='moderate'?'var(--warn-bg)':'var(--red-50)') : 'var(--gray-50)',
                    border:`1.5px solid ${intensity===it.id?it.color:'var(--gray-200)'}`,
                    color: intensity===it.id ? it.color : 'var(--gray-500)',
                    fontWeight:700, fontSize:13, transition:'all .18s',
                  }}>{it.label}</button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {preview !== null && (
              <div className="anim-fade-in" style={{ padding:'14px 18px', borderRadius:14, marginBottom:14, background:'var(--success-bg)', border:'1px solid #A7F3D0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ color:'var(--gray-500)', fontSize:12, fontWeight:500 }}>Expected Payout</p>
                  <p style={{ color:'var(--gray-600)', fontSize:11 }}>{selEvt?.label} · {intensity}</p>
                </div>
                <p style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:30, color:'var(--success)' }}>₹{preview}</p>
              </div>
            )}

            <div className="anim-fade-up delay-3">
              <button className="btn-primary" onClick={runSim} disabled={!selected}>⚡ Simulate Event</button>
            </div>
          </>
        )}

        {/* Running */}
        {phase === 'running' && (
          <div className="anim-fade-in card-elevated" style={{ padding:32, textAlign:'center' }}>
            <div className="anim-bounce" style={{ fontSize:54, marginBottom:18 }}>{selEvt?.icon}</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color:'var(--gray-900)', marginBottom:6 }}>Processing Pipeline…</h3>
            <p style={{ color:'var(--gray-400)', fontSize:13, marginBottom:28 }}>AI trigger engine running</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {STEPS.map((s,i) => {
                const done=curStep>i+1, active=curStep===i+1;
                return (
                  <div key={i} style={{
                    display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, textAlign:'left',
                    background: done?'var(--success-bg)':active?'var(--red-50)':'var(--gray-50)',
                    border:`1px solid ${done?'#A7F3D0':active?'var(--red-100)':'var(--gray-200)'}`,
                    transition:'all 0.4s',
                  }}>
                    <div style={{ width:30,height:30,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center', background:done?'var(--success)':active?'var(--red)':'var(--gray-200)', color:'#fff', fontSize:13, fontWeight:800, flexShrink:0 }}>
                      {done?'✓':active?<span className="anim-spin">⟳</span>:i+1}
                    </div>
                    <span style={{ fontWeight:600, fontSize:14, color:done?'var(--success)':active?'var(--red)':'var(--gray-400)' }}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Done */}
        {phase === 'done' && (
          <div className="anim-fade-in" style={{ textAlign:'center' }}>
            <div className="anim-countup" style={{ width:106,height:106,borderRadius:'50%',background:'var(--success-bg)',border:'3px solid #A7F3D0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:50,margin:'0 auto 22px' }}>💸</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:800, color:'var(--gray-900)', marginBottom:6 }}>Payout Sent!</h3>
            <p style={{ color:'var(--gray-500)', fontSize:14, marginBottom:28 }}>Credited instantly via UPI</p>

            <div style={{ padding:'24px 20px', marginBottom:20, background:'var(--success-bg)', borderRadius:20, border:'2px solid #A7F3D0' }}>
              <p style={{ color:'var(--gray-500)', fontSize:13, marginBottom:6 }}>Amount Credited</p>
              <p style={{ fontFamily:'var(--font-display)', fontSize:56, fontWeight:800, color:'var(--success)', lineHeight:1 }}>₹{paidAmt}</p>
              <p style={{ color:'var(--gray-400)', fontSize:12, marginTop:10 }}>→ ramesh9876@upi · processed in &lt; 30 sec</p>
            </div>

            <div className="card" style={{ padding:'4px 18px', marginBottom:20, textAlign:'left' }}>
              {[['Event',selEvt?.label],['Intensity',intensity.charAt(0).toUpperCase()+intensity.slice(1)],['Coverage','Standard Plan · Active'],['Fraud Check','✓ All layers passed'],['Reference',claimRef],['Status','PAID']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid var(--gray-100)' }}>
                  <span style={{ color:'var(--gray-500)', fontSize:12 }}>{k}</span>
                  <span style={{ fontSize:12, fontWeight:700, color: k==='Status'?'var(--success)':'var(--gray-900)' }}>{v}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={reset} style={{ marginBottom:10 }}>Simulate Another →</button>
            <button className="btn-secondary" onClick={()=>onNav('history')}>View Payout History</button>
          </div>
        )}
      </div>
      <BottomNav active="simulate" onNav={onNav} />
    </Shell>
  );
}
