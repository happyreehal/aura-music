import React from 'react';

export default function Sidebar({ view, setView }) {
  return (
    <aside style={{
      width: '240px', minWidth: '240px',
      background: '#09090b',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      padding: '24px 20px',
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '22px', fontWeight: 800,
        fontFamily: 'var(--font-display)',
        background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '36px', letterSpacing: '-0.5px',
      }}>AuraMusic.</div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', fontWeight: 500, color: '#71717a' }}>
        <a onClick={() => setView('home')} style={{
          color: view === 'home' ? 'white' : '#71717a',
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', transition: 'color 0.15s',
        }}>⌂ Home</a>
        <a onClick={() => setView('search')} style={{
          color: view === 'search' ? 'white' : '#71717a',
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', transition: 'color 0.15s',
        }}>⚲ Discover</a>
        <a onClick={() => setView('upload')} style={{
          color: view === 'upload' ? 'white' : '#71717a',
          display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer', transition: 'color 0.15s',
        }}>☰ My Music</a>
      </nav>

      {/* Playlists */}
      <div style={{ marginTop: '32px', marginBottom: '12px', fontSize: '11px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Your Playlists
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#71717a' }}>
        {['Deep Focus Vibes', 'Synthwave Night Drive', 'Top 50 Global'].map(p => (
          <a key={p} style={{ cursor: 'pointer', transition: 'color 0.15s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = '#71717a'}
          >{p}</a>
        ))}
      </div>
    </aside>
  );
}