const TABS = [
  { id: 'dashboard',  icon: '⊞',  label: 'Home'    },
  { id: 'monitoring', icon: '📡', label: 'Monitor' },
  { id: 'simulate',   icon: '⚡', label: 'Simulate'},
  { id: 'history',    icon: '₹',  label: 'Payouts' },
];

export default function BottomNav({ active, onNav }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'var(--white)',
      borderTop: '1px solid var(--gray-200)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      display: 'flex', zIndex: 100,
      padding: '8px 0 14px',
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNav(tab.id)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 0', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, position: 'relative',
            transition: 'opacity 0.2s',
          }}>
            {/* Active top line */}
            {isActive && (
              <div style={{
                position: 'absolute', top: -8, left: '50%',
                transform: 'translateX(-50%)',
                width: 32, height: 2.5,
                background: 'var(--red)',
                borderRadius: '0 0 3px 3px',
              }} />
            )}
            <div style={{
              width: 36, height: 36, borderRadius: '10px',
              background: isActive ? 'var(--red-50)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <span style={{
                fontSize: 18,
                filter: isActive ? 'none' : 'grayscale(1) opacity(0.5)',
                transition: 'all 0.2s',
              }}>{tab.icon}</span>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: isActive ? 'var(--red)' : 'var(--gray-400)',
              transition: 'color 0.2s', letterSpacing: '0.2px',
            }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
