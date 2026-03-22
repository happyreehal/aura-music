import React from 'react';

const CARDS = [
  { title: 'Daily Mix 1',      sub: 'Electronic, Chillwave', grad: 'linear-gradient(135deg,#4ade80,#38bdf8)' },
  { title: 'Discover Weekly',  sub: 'New releases for you',  grad: 'linear-gradient(135deg,#f472b6,#fb923c)' },
  { title: 'Lo-Fi Beats',      sub: 'Study and relax',       grad: 'linear-gradient(135deg,#a78bfa,#3b0764)' },
  { title: 'Top Hits 2025',    sub: 'Most played globally',  grad: 'linear-gradient(135deg,#f43f5e,#7c3aed)' },
  { title: 'Bollywood Vibes',  sub: 'Desi hits',             grad: 'linear-gradient(135deg,#fbbf24,#ef4444)' },
];

export default function HomeView({ setView }) {
  return (
    <div style={{ padding: '32px 36px', fontFamily: 'var(--font-body)' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ position: 'relative', width: '380px' }}>
          <input
            type="text"
            placeholder="Search for artists, songs, or podcasts..."
            onFocus={() => setView('search')}
            readOnly
            style={{
              width: '100%', padding: '10px 18px',
              borderRadius: '99px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#71717a', fontSize: '14px', outline: 'none',
            }}
          />
        </div>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
          padding: '2px', cursor: 'pointer',
        }}>
          <div style={{ width: '100%', height: '100%', background: '#09090b', borderRadius: '50%' }} />
        </div>
      </div>

      {/* Featured Banner */}
      <div style={{
        position: 'relative', width: '100%', height: '240px',
        borderRadius: '20px', overflow: 'hidden',
        marginBottom: '36px', cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
        onClick={() => setView('search')}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #2563eb, #7c3aed, #db2777)',
          opacity: 0.5,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '36px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: '#22d3ee', marginBottom: '10px', textTransform: 'uppercase' }}>
            Featured Album
          </p>
          <h1 style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.1, marginBottom: '20px' }}>
            Midnight<br />Memories
          </h1>
          <button
            onClick={e => { e.stopPropagation(); setView('search'); }}
            style={{
              background: 'white', color: 'black',
              padding: '12px 28px', borderRadius: '99px',
              border: 'none', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.target.style.background = '#22d3ee'}
            onMouseLeave={e => e.target.style.background = 'white'}
          >Play Now</button>
        </div>
      </div>

      {/* Made For You */}
      <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
        Made For You
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '20px',
      }}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            onClick={() => setView('search')}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px', padding: '14px',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <div style={{
              width: '100%', aspectRatio: '1',
              borderRadius: '10px', marginBottom: '14px',
              background: card.grad, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }} />
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{card.title}</div>
            <div style={{ fontSize: '12px', color: '#71717a' }}>{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}