export default function Shell({ children, noPadBottom, whiteBg }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: whiteBg ? 'var(--white)' : 'var(--gray-50)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingBottom: noPadBottom ? 0 : 90,
      position: 'relative',
    }}>
      {/* Red top accent bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, var(--red-800) 0%, var(--red) 50%, var(--red-400) 100%)',
        zIndex: 999,
      }} />
      <div style={{ width: '100%', maxWidth: 430, position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
