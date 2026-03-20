import Shell from '../components/Shell';

const STATS = [
  { val: '7M+',    label: 'Workers Protected' },
  { val: '<2 min', label: 'Claim Payout'      },
  { val: '₹20/wk', label: 'Starting Premium'  },
];

export default function SplashScreen({ onNext }) {
  return (
    <Shell noPadBottom whiteBg>
      {/* Hero red band */}
      <div style={{
        background: 'linear-gradient(160deg, var(--red-900) 0%, var(--red) 60%, var(--red-400) 100%)',
        padding: '64px 28px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        <div className="anim-fade-up" style={{ position:'relative', zIndex:1 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
            <div style={{
              width:52, height:52, borderRadius:14,
              background:'rgba(255,255,255,0.18)',
              border:'1.5px solid rgba(255,255,255,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:26, backdropFilter:'blur(8px)',
            }}>🛡️</div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color:'#fff', lineHeight:1 }}>EliteSuraksha</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', letterSpacing:'1px', textTransform:'uppercase', marginTop:2 }}>Income Protection</p>
            </div>
          </div>

          <h1 style={{ fontFamily:'var(--font-display)', fontSize:38, fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:14 }}>
            Your Income,<br/><em style={{ fontStyle:'italic', color:'rgba(255,255,255,0.85)' }}>Always Protected.</em>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.72)', fontSize:15, lineHeight:1.65, maxWidth:320 }}>
            AI-powered parametric insurance for Swiggy & Zomato delivery workers. Instant payouts — zero paperwork.
          </p>
        </div>
      </div>

      {/* White section */}
      <div style={{ background:'var(--white)', padding:'32px 28px 40px' }}>
        {/* Stats */}
        <div className="anim-fade-up delay-1" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign:'center', padding:'16px 8px', background:'var(--red-50)', borderRadius:'var(--r-lg)', border:'1px solid var(--red-100)' }}>
              <p style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'var(--red)', lineHeight:1 }}>{s.val}</p>
              <p style={{ fontSize:10, color:'var(--gray-500)', marginTop:4, lineHeight:1.3, fontWeight:500 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features list */}
        <div className="anim-fade-up delay-2" style={{ marginBottom:32 }}>
          {[
            { icon:'⚡', title:'Instant Payouts', desc:'Credited to UPI in under 2 minutes' },
            { icon:'🤖', title:'AI Risk Engine',  desc:'Real-time weather, AQI & traffic signals' },
            { icon:'🔒', title:'Zero-Touch Claims',desc:'No forms. No delays. Fully automated.' },
          ].map(f => (
            <div key={f.title} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'var(--red-50)', border:'1px solid var(--red-100)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{f.icon}</div>
              <div>
                <p style={{ fontWeight:700, fontSize:14, color:'var(--gray-900)' }}>{f.title}</p>
                <p style={{ fontSize:12, color:'var(--gray-500)', marginTop:1 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="anim-fade-up delay-3">
          <button className="btn-primary" onClick={onNext} style={{ marginBottom:12, fontSize:15 }}>
            Get Started →
          </button>
          <p style={{ textAlign:'center', color:'var(--gray-400)', fontSize:13 }}>
            Already enrolled?{' '}
            <span style={{ color:'var(--red)', cursor:'pointer', fontWeight:700 }} onClick={onNext}>Login</span>
          </p>
        </div>

        <p className="anim-fade-up delay-4" style={{ textAlign:'center', color:'var(--gray-400)', fontSize:11, marginTop:28, lineHeight:1.7 }}>
          Team Elite · KL University · Phase 1 Prototype
        </p>
      </div>
    </Shell>
  );
}
