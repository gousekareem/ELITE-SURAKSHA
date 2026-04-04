import { useState } from 'react';
import Shell from '../components/Shell';
import BottomNav from '../components/BottomNav';
import { useApp } from '../services/AppContext';

export default function HistoryScreen({ onNav }) {
  const { payouts } = useApp();
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('All');

  const FILTERS = ['All','🌧️ Rain','😷 AQI','🌡️ Heat','📴 Outage','🚫 Curfew'];
  const visible = filter==='All' ? payouts : payouts.filter(p=>p.icon===filter.split(' ')[0]);
  const total   = payouts.reduce((s,p)=>s+p.amt,0);
  const avg     = payouts.length ? Math.round(total/payouts.length) : 0;

  return (
    <Shell>
      <div style={{ padding:'52px 20px 20px' }}>

        {/* Header */}
        <div className="anim-fade-up" style={{ marginBottom:22 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, color:'var(--gray-900)', marginBottom:3 }}>Payout History</h2>
          <p style={{ color:'var(--gray-400)', fontSize:13 }}>Zero-touch — all payouts were fully automated</p>
        </div>

        {/* Summary */}
        <div className="anim-fade-up delay-1" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:18 }}>
          {[
            { label:'Total Received', val:`₹${total.toLocaleString()}`, color:'var(--success)', bg:'var(--success-bg)', border:'#A7F3D0' },
            { label:'Events Covered', val:payouts.length,               color:'var(--info)',    bg:'var(--info-bg)',    border:'#BFDBFE' },
            { label:'Avg. Payout',    val:`₹${avg}`,                    color:'var(--warn)',    bg:'var(--warn-bg)',    border:'#FDE68A' },
          ].map(s => (
            <div key={s.label} style={{ padding:'14px 10px', textAlign:'center', background:s.bg, border:`1px solid ${s.border}`, borderRadius:16 }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:s.color, lineHeight:1 }}>{s.val}</p>
              <p style={{ color:'var(--gray-500)', fontSize:10, marginTop:4, lineHeight:1.3, fontWeight:500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="anim-fade-up delay-2" style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:14, scrollbarWidth:'none' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{
              flexShrink:0, padding:'7px 14px', borderRadius:20, cursor:'pointer',
              background: filter===f ? 'var(--red)' : 'var(--white)',
              border:`1px solid ${filter===f?'var(--red)':'var(--gray-200)'}`,
              color: filter===f ? '#fff' : 'var(--gray-500)',
              fontSize:12, fontWeight:700, transition:'all .18s',
              whiteSpace:'nowrap', boxShadow: filter===f?'var(--shadow-red)':'var(--shadow-sm)',
            }}>{f}</button>
          ))}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <div className="card" style={{ padding:32, textAlign:'center' }}>
            <p style={{ fontSize:32, marginBottom:10 }}>📭</p>
            <p style={{ color:'var(--gray-400)', fontSize:14 }}>No payouts for this filter</p>
          </div>
        ) : (
          <div className="anim-fade-up delay-3 card">
            {visible.map((p,i) => (
              <div key={p.id}>
                <div onClick={()=>setExpanded(expanded===p.id?null:p.id)} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'15px 18px', cursor:'pointer',
                  borderBottom:'1px solid var(--gray-100)',
                  background: expanded===p.id ? 'var(--red-50)' : 'var(--white)',
                  transition:'background .18s',
                }}>
                  <div style={{ width:42,height:42,borderRadius:12,background:'var(--gray-50)',border:'1px solid var(--gray-200)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>{p.icon}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:14, color:'var(--gray-900)' }}>{p.event}</p>
                    <p style={{ color:'var(--gray-400)', fontSize:12 }}>{p.date}</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, color:'var(--success)' }}>+₹{p.amt}</p>
                    <span className="badge badge-green" style={{ fontSize:9, padding:'2px 8px' }}>PAID</span>
                  </div>
                  <span style={{ color:'var(--gray-300)', fontSize:11, marginLeft:2 }}>{expanded===p.id?'▲':'▼'}</span>
                </div>

                {expanded===p.id && (
                  <div className="anim-fade-in" style={{ padding:'0 18px 16px', background:'var(--red-50)', borderBottom:'1px solid var(--gray-100)' }}>
                    <div style={{ borderTop:'1px dashed var(--red-100)', paddingTop:12 }}>
                      {[['Reference',p.ref],['City',p.city||'Hyderabad'],['Payment Mode','UPI Instant'],['Processed in','< 30 seconds'],['Fraud Check','✓ Passed']].map(([k,v])=>(
                        <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                          <span style={{ color:'var(--gray-500)', fontSize:12 }}>{k}</span>
                          <span style={{ fontSize:12, fontWeight:700, color:'var(--gray-900)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="anim-fade-up" style={{ marginTop:16 }}>
          <button className="btn-outline-red" onClick={()=>onNav('simulate')}>⚡ Simulate a new event</button>
        </div>
      </div>
      <BottomNav active="history" onNav={onNav} />
    </Shell>
  );
}
