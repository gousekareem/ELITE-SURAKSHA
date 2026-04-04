import { useState, useEffect } from 'react';
import Shell from '../components/Shell';
import BottomNav from '../components/BottomNav';
import { useApp } from '../services/AppContext';
import { useWeather } from '../hooks/useWeather';

export default function DashboardScreen({ onNav }) {
  const { user, payouts } = useApp();
  const { data: w, risk, loading } = useWeather(user.city, 30000);
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); },[]);

  const riskScore = risk?.total || 58;
  const riskColor = risk?.color || '#D97706';
  const riskLabel = risk?.label || 'MEDIUM';
  const recent    = payouts.slice(0,4);
  const totalAmt  = payouts.reduce((s,p)=>s+p.amt,0);

  const conditions = w ? [
    { icon:'🌧️', label:'Rain',   val:`${w.rainfall}mm/hr`, color: w.rainfall>40?'var(--red)':'var(--info)',  bg: w.rainfall>40?'var(--red-50)':'var(--info-bg)' },
    { icon:'😷',  label:'AQI',   val:`${w.aqi}`,           color: w.aqi>200?'var(--warn)':'var(--success)', bg: w.aqi>200?'var(--warn-bg)':'var(--success-bg)' },
    { icon:'🌡️', label:'Temp',  val:`${w.temperature}°C`, color: w.temperature>38?'var(--red)':'var(--gray-700)', bg:'var(--gray-50)' },
    { icon:'💨',  label:'Wind',  val:`${w.windSpeed}km/h`, color:'var(--gray-700)', bg:'var(--gray-50)' },
  ] : [];

  return (
    <Shell>
      <div style={{ padding:'52px 20px 20px' }}>

        {/* Header */}
        <div className="anim-fade-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <div>
            <p style={{ color:'var(--gray-400)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>
              {time.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})} · {time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
            </p>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:700, marginTop:2, color:'var(--gray-900)' }}>
              Hey, {user.name.split(' ')[0]} 👋
            </h2>
          </div>
          <div style={{ width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,var(--red),var(--red-800))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:15,color:'#fff',boxShadow:'var(--shadow-red)' }}>
            {user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
          </div>
        </div>

        {/* Coverage Card — full red */}
        <div className="anim-fade-up delay-1 card-red" style={{ padding:22, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
            <div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6 }}>Coverage Status</p>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:'#4ADE80' }} />
                <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>ACTIVE — Standard Plan</span>
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:10, padding:'6px 12px', backdropFilter:'blur(8px)' }}>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginBottom:1 }}>Platform</p>
              <p style={{ fontSize:13, fontWeight:700, color:'#fff' }}>🛵 {user.platform}</p>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
            {[
              { label:'Weekly Premium', val:`₹${user.premium}`, sub:'AutoPay ON' },
              { label:'Max Payout',     val:`₹${user.coverageLimit}`, sub:'Per event' },
              { label:'Renews',         val:'Mon, Jan 27', sub:'Standard tier' },
            ].map(c => (
              <div key={c.label} style={{ background:'rgba(255,255,255,0.12)', borderRadius:12, padding:'12px 10px', backdropFilter:'blur(8px)' }}>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:9, marginBottom:4, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{c.label}</p>
                <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:c.label==='Renews'?13:20, color:'#fff', lineHeight:1 }}>{c.val}</p>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:9, marginTop:3 }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Meter */}
        <div className="anim-fade-up delay-2 card" style={{ padding:18, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <p className="section-title">Risk Level · {w?.city||'Hyderabad'}</p>
            <span className={`badge ${riskScore<30?'badge-green':riskScore<60?'badge-amber':'badge-red'}`}>● {riskLabel}</span>
          </div>
          <div style={{ height:8, background:'var(--gray-100)', borderRadius:4, overflow:'hidden', marginBottom:8 }}>
            <div style={{ width:`${riskScore}%`, height:'100%', borderRadius:4, background:`linear-gradient(90deg, #059669, ${riskColor})`, transition:'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:11, color:'var(--gray-400)' }}>0 — Safe</span>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:riskColor }}>{riskScore}<span style={{ fontSize:11, color:'var(--gray-400)', fontFamily:'var(--font-body)' }}>/100</span></span>
            <span style={{ fontSize:11, color:'var(--gray-400)' }}>100 — Critical</span>
          </div>
          {w && <p style={{ textAlign:'center', color:'var(--gray-400)', fontSize:11, marginTop:8 }}>{w.source==='live'?'🟢 Live API':'🟡 Simulated'} · Updated {w.lastUpdated}</p>}
        </div>

        {/* Live Conditions */}
        {!loading && w && (
          <div className="anim-fade-up delay-3 card" style={{ padding:18, marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <p className="section-title">Live Conditions</p>
              <div style={{ display:'flex', alignItems:'center', gap:5, background:'var(--success-bg)', border:'1px solid #A7F3D0', borderRadius:20, padding:'4px 10px' }}>
                <div style={{ width:6,height:6,borderRadius:'50%',background:'var(--success)',animation:'pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize:10, fontWeight:700, color:'var(--success)' }}>LIVE</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {conditions.map(c => (
                <div key={c.label} style={{ padding:'13px 14px', borderRadius:14, background:c.bg, border:'1px solid var(--gray-200)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                    <span style={{ fontSize:15 }}>{c.icon}</span>
                    <span style={{ fontSize:11, color:'var(--gray-500)', fontWeight:600 }}>{c.label}</span>
                  </div>
                  <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:c.color }}>{c.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alert Banner */}
        {w && (w.rainfall>35 || w.aqi>200) && (
          <div className="anim-fade-up delay-4" style={{ padding:'13px 16px', borderRadius:14, background:'var(--red-50)', border:'1px solid var(--red-100)', marginBottom:14, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'var(--red)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18 }}>⚠️</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:13, color:'var(--red-800)' }}>Trigger Threshold Approaching</p>
              <p style={{ color:'var(--gray-500)', fontSize:12 }}>{w.rainfall>35?`Rain: ${w.rainfall}mm/hr → Trigger: 50mm`:`AQI: ${w.aqi} → Trigger: 300`}</p>
            </div>
            <button onClick={()=>onNav('simulate')} style={{ background:'var(--red)',border:'none',borderRadius:8,color:'#fff',fontSize:11,fontWeight:700,padding:'6px 12px',cursor:'pointer',whiteSpace:'nowrap',boxShadow:'var(--shadow-red)' }}>Simulate →</button>
          </div>
        )}

        {/* Recent Payouts */}
        <div className="anim-fade-up delay-5 card" style={{ padding:18, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <p className="section-title">Recent Payouts</p>
            <span style={{ fontSize:12, color:'var(--red)', cursor:'pointer', fontWeight:700 }} onClick={()=>onNav('history')}>See all →</span>
          </div>
          {recent.map((p,i) => (
            <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom: i<recent.length-1?'1px solid var(--gray-100)':'none' }}>
              <div style={{ width:40,height:40,borderRadius:12,background:'var(--gray-50)',border:'1px solid var(--gray-200)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{p.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, fontSize:14, color:'var(--gray-900)' }}>{p.event}</p>
                <p style={{ color:'var(--gray-400)', fontSize:12 }}>{p.date}</p>
              </div>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--success)' }}>+₹{p.amt}</p>
            </div>
          ))}
          <div style={{ marginTop:14, padding:'12px 14px', background:'var(--success-bg)', borderRadius:12, border:'1px solid #A7F3D0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'var(--gray-500)', fontSize:13, fontWeight:500 }}>Total Protected (Jan)</span>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:'var(--success)' }}>₹{totalAmt.toLocaleString()}</span>
          </div>
        </div>

        <div className="anim-fade-up delay-6" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button className="btn-secondary" style={{ borderRadius:14 }} onClick={()=>onNav('monitoring')}>📡 Monitor</button>
          <button className="btn-outline-red" style={{ borderRadius:14 }} onClick={()=>onNav('simulate')}>⚡ Simulate</button>
        </div>
      </div>
      <BottomNav active="dashboard" onNav={onNav} />
    </Shell>
  );
}
