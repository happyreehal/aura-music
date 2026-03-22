import React from 'react';

const GRADIENTS = [
  'linear-gradient(135deg,#38bdf8,#818cf8)',
  'linear-gradient(135deg,#f472b6,#fb923c)',
  'linear-gradient(135deg,#4ade80,#38bdf8)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
  'linear-gradient(135deg,#fbbf24,#f87171)',
];

export default function TrackCard({ track, isActive, isPlaying, onPlay }) {
  const grad = GRADIENTS[parseInt(track.id) % GRADIENTS.length] || GRADIENTS[0];

  return (
    <div
      onClick={onPlay}
      style={{
        background: isActive ? 'var(--surface2)' : 'var(--surface)',
        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '14px', padding: '14px',
        cursor: 'pointer', transition: 'all 0.2s',
        position: 'relative', overflow: 'hidden',
      }}
      className="fade-in"
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor='var(--border)'; }}
    >
      {/* Artwork */}
      <div style={{
        width:'100%', aspectRatio:'1', borderRadius:'10px',
        marginBottom:'12px', overflow:'hidden', position:'relative',
        background: grad,
      }}>
        {track.artwork
          ? <img src={track.artwork} alt={track.title}
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px' }}>🎵</div>
        }

        {/* Play overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'rgba(0,0,0,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          opacity: isActive ? 1 : 0, transition:'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity=1}
        onMouseLeave={e => { if(!isActive) e.currentTarget.style.opacity=0; }}
        >
          <div style={{
            width:'40px', height:'40px', borderRadius:'50%',
            background:'white', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'16px', color:'black',
          }}>
            {isPlaying ? '⏸' : '▶'}
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ fontWeight:600, fontSize:'13px', marginBottom:'4px',
        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        color: isActive ? 'var(--accent)' : 'var(--text)',
      }}>{track.title}</div>

      <div style={{ fontSize:'12px', color:'var(--muted)',
        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
      }}>{track.artist}</div>

      {track.isPreview && (
        <div style={{
          marginTop:'8px', fontSize:'10px', color:'var(--accent2)',
          background:'rgba(56,189,248,0.1)', borderRadius:'4px',
          padding:'2px 6px', display:'inline-block',
        }}>30s preview</div>
      )}
    </div>
  );
}
