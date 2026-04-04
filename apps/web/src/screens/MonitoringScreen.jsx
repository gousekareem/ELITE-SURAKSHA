import Shell from '../components/Shell';
import BottomNav from '../components/BottomNav';
import { useApp } from '../services/AppContext';
import { useWeather } from '../hooks/useWeather';
import { TRIGGERS } from '../services/weatherService';

export default function MonitoringScreen({ onNav }) {
  const { user } = useApp();
  const { data:w, loading } = useWeather(user.city, 15000);

  const metrics = w ? [
    { icon:'🌧️', label:'Rainfall',       val:`${w.rainfall}mm/hr`,      threshold:TRIGGERS.rain.threshold, unit:'mm/hr', pct:Math.min(100,Math.round((w.rainfall/TRIGGERS.rain.threshold)*100)), critColor: w.rainfall>40?'var(--red)':w.rainfall>25?'var(--warn)':'var(--info)' },
    { icon:'😷', label:'Air Quality Index',val:`${w.aqi}`,               threshold:TRIGGERS.aqi.threshold,  unit:'',      pct:Math.min(100,Math.round((w.aqi/TRIGGERS.aqi.threshold)*100)),      critColor: w.aqi>250?'var(--red)':w.aqi>150?'var(--warn)':'var(--success)' },
    { icon:'🌡️', label:'Temperature',     val:`${w.temperature}°C`,      threshold:TRIGGERS.heat.threshold, unit:'°C',    pct:Math.min(100,Math.round(((w.temperature-20)/(TRIGGERS.heat.threshold-20))*100)), critColor: w.temperature>40?'var(--red)':w.temperature>35?'var(--warn)':'var(--success)' },
    { icon:'💨', label:'Wind Speed',       val:`${w.windSpeed}km/h`,      threshold:TRIGGERS.wind.threshold, unit:'km/h',  pct:Math.min(100,Math.round((w.windSpeed/TRIGGERS.wind.threshold)*100)),  critColor: w.windSpeed>50?'var(--red)':w.windSpeed>30?'var(--warn)':'var(--gray-400)' },
    { icon:'💧', label:'Humidity',         val:`${w.humidity}%`,          threshold:90,                      unit:'%',     pct:w.humidity, critColor:'var(--info)' },
  ] : [];

  const alerts = [
    { time:'14:45', city:'Hyderabad', msg:'Rainfall approaching trigger threshold (38mm/hr → 50mm)', type:'warn' },
    { time:'13:20', city:'Hyderabad', msg:'AQI crossed 150 — Moderate pollution level recorded', type:'warn' },
    { time:'09:05', city:'Mumbai',    msg:'Heavy rain trigger fired — ₹600 payouts dispatched to 142 workers', type:'crit' },
    { time:'Yesterday', city:'Bangalore', msg:'Platform outage recovered after 2.5 hrs', type:'info' },
  ];

  const dotColor = t => t==='crit'?'var(--red)':t==='warn'?'var(--warn)':'var(--info)';
  const dotBg    = t => t==='crit'?'var(--red-50)':t==='warn'?'var(--warn-bg)':'var(--info-bg)';

  return (
    <Shell>
      <div style={{ padding:'52px 20px 20px' }}>

        {/* Header */}
        <div className="anim-fade-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, color:'var(--gray-900)', marginBottom:3 }}>Live Monitor</h2>
            <p style={{ color:'var(--gray-400)', fontSize:12 }}>{w?`${w.city} · ${w.conditionIcon} ${w.condition}`:'Loading…'}</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--success-bg)', border:'1px solid #A7F3D0', borderRadius:20, padding:'6px 12px' }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:'var(--success)',animation:'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize:10, fontWeight:700, color:'var(--success)' }}>LIVE · auto-refresh</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="card" style={{ padding:28, textAlign:'center', marginBottom:14 }}>
            <span className="anim-spin" style={{ fontSize:24, color:'var(--red)' }}>⟳</span>
            <p style={{ color:'var(--gray-500)', fontSize:13, marginTop:10 }}>Fetching live data…</p>
          </div>
        )}

        {/* Metrics */}
        {!loading && metrics.map((m,i) => (
          <div key={m.label} className={`anim-fade-up delay-${i+1} card`} style={{ padding:'16px 18px', marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:42,height:42,borderRadius:12,background:'var(--gray-50)',border:'1px solid var(--gray-200)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>{m.icon}</div>
                <div>
                  <p style={{ fontWeight:700, fontSize:14, color:'var(--gray-900)' }}>{m.label}</p>
                  <p style={{ color:'var(--gray-400)', fontSize:11 }}>Trigger: {m.threshold}{m.unit}</p>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:m.critColor }}>{m.val}</p>
                <p style={{ fontSize:10, color:m.critColor, fontWeight:700 }}>{m.pct}% of trigger</p>
              </div>
            </div>
            <div style={{ height:6, background:'var(--gray-100)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ width:`${m.pct}%`, height:'100%', borderRadius:3, background:m.critColor, transition:'width 1s ease', opacity:0.85 }} />
            </div>
          </div>
        ))}

        {/* Platform Status */}
        <div className="anim-fade-up card" style={{ padding:18, marginBottom:14 }}>
          <p className="section-title" style={{ marginBottom:12 }}>Platform Status</p>
          <div style={{ display:'flex', gap:10 }}>
            {[{name:'Swiggy',ok:true},{name:'Zomato',ok:true}].map(p => (
              <div key={p.name} style={{ flex:1, padding:'13px 14px', borderRadius:12, background:p.ok?'var(--success-bg)':'var(--red-50)', border:`1px solid ${p.ok?'#A7F3D0':'var(--red-100)'}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:14, color:'var(--gray-900)' }}>{p.name}</p>
                  <p style={{ fontSize:11, color: p.ok?'var(--success)':'var(--red)', fontWeight:600 }}>{p.ok?'Operational':'Down'}</p>
                </div>
                <span style={{ fontSize:20 }}>{p.ok?'🟢':'🔴'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Feed */}
        <div className="anim-fade-up card" style={{ padding:18 }}>
          <p className="section-title" style={{ marginBottom:14 }}>Alert Feed</p>
          {alerts.map((a,i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'11px 0', borderBottom: i<alerts.length-1?'1px solid var(--gray-100)':'none' }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:dotColor(a.type),marginTop:5,flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:500, lineHeight:1.45, color:'var(--gray-700)' }}>{a.msg}</p>
                <p style={{ color:'var(--gray-400)', fontSize:11, marginTop:3 }}>{a.time} · {a.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="monitoring" onNav={onNav} />
    </Shell>
  );
}
