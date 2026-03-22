import React, { useState, useCallback } from 'react';

const YT_KEY = 'AIzaSyBHDE1h_G78Zrndc-j3CD5_nqKTKC2m8XY';
const GENRES = ['Bollywood', 'Pop', 'Hip-Hop', 'Lo-Fi', 'Jazz', 'Electronic', 'Classical', 'R&B', 'Rock', 'Punjabi'];

async function searchYouTube(term) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(term + ' audio song')}&type=video&videoCategoryId=10&maxResults=25&key=${YT_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.items) throw new Error(data.error?.message || 'API Error');
  return data.items.map((item, i) => ({
    id: item.id.videoId,
    index: i + 1,
    title: item.snippet.title.replace(/\(Official.*?\)/gi, '').replace(/\[.*?\]/g, '').trim(),
    artist: item.snippet.channelTitle.replace(' - Topic', '').replace('VEVO', '').trim(),
    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
    videoId: item.id.videoId,
    isYoutube: true,
    isLocal: false,
    src: null,
  }));
}

export default function SearchView({ playTrack, currentTrack, isPlaying }) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [searched, setSearched] = useState(false);

  const activeVideoId = currentTrack?.videoId;

  const doSearch = useCallback(async (term) => {
    if (!term.trim()) return;
    setLoading(true); setError(''); setSearched(true);
    try {
      const tracks = await searchYouTube(term);
      setResults(tracks);
      if (!tracks.length) setError('Koi result nahi mila.');
    } catch (e) {
      setError('Error: ' + e.message);
    } finally { setLoading(false); }
  }, []);

  const handlePlay = (track) => {
    playTrack(track, results);
  };

  const activeTrack = results.find(r => r.videoId === activeVideoId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-body)' }}>

      {/* Top gradient header */}
      <div style={{ padding: '24px 32px 0', background: 'linear-gradient(180deg, #1a3a2a 0%, var(--bg) 100%)' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333', fontSize: '16px' }}>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch(query)}
              placeholder="Koi bhi gana search karo..."
              style={{
                width: '100%', padding: '13px 18px 13px 44px',
                borderRadius: '99px', background: 'white', border: 'none',
                color: 'black', fontFamily: 'var(--font-body)', fontSize: '14px',
                outline: 'none', fontWeight: 500,
              }}
            />
          </div>
          <button onClick={() => doSearch(query)} style={{
            padding: '13px 28px', borderRadius: '99px', border: 'none',
            background: 'var(--accent)', color: 'black',
            fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          }}
            onMouseEnter={e => e.target.style.background = '#1ed760'}
            onMouseLeave={e => e.target.style.background = 'var(--accent)'}
          >Search</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '20px' }}>
          {GENRES.map(g => (
            <button key={g} onClick={() => { setQuery(g); doSearch(g); }} style={{
              padding: '7px 16px', borderRadius: '99px',
              border: '1px solid var(--surface3)',
              background: 'var(--surface2)', color: 'white',
              fontSize: '13px', cursor: 'pointer', fontWeight: 500,
            }}
              onMouseEnter={e => { e.target.style.background = 'white'; e.target.style.color = 'black'; }}
              onMouseLeave={e => { e.target.style.background = 'var(--surface2)'; e.target.style.color = 'white'; }}
            >{g}</button>
          ))}
        </div>
      </div>

      {/* Now Playing bar */}
      {activeTrack && (
        <div style={{
          margin: '0 32px 16px', padding: '12px 16px',
          background: 'linear-gradient(90deg, #1a3a2a, var(--surface2))',
          borderRadius: '8px', border: '1px solid var(--accent)',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <img src={activeTrack.thumbnail} alt="" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeTrack.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '2px' }}>{activeTrack.artist}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px' }}>
            <span className="eq-bar" style={{ height: '12px' }} />
            <span className="eq-bar" style={{ height: '20px' }} />
            <span className="eq-bar" style={{ height: '8px' }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>
            {isPlaying ? '▶ Playing' : '⏸ Paused'}
          </span>
        </div>
      )}

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px 120px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text2)' }}>
            <div className="spin" style={{ fontSize: '36px', display: 'inline-block' }}>⟳</div>
            <p style={{ marginTop: '16px' }}>Searching YouTube...</p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px', padding: '16px 20px', color: '#f87171', marginTop: '16px',
          }}>{error}</div>
        )}

        {!loading && !searched && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎵</div>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text2)', marginBottom: '8px' }}>Koi bhi gana dhundo</p>
            <p style={{ fontSize: '14px' }}>Hindi, English, Punjabi — sab chalega!</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '40px 40px 1fr 1fr',
              gap: '16px', padding: '8px 16px',
              borderBottom: '1px solid var(--border)', marginBottom: '8px',
            }}>
              <span style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center' }}>#</span>
              <span></span>
              <span style={{ color: 'var(--muted)', fontSize: '13px' }}>Title</span>
              <span style={{ color: 'var(--muted)', fontSize: '13px' }}>Channel</span>
            </div>

            {results.map((track, i) => {
              const isActive = activeVideoId === track.videoId;
              return (
                <div
                  key={track.id}
                  className="track-row fade-in"
                  onClick={() => handlePlay(track)}
                  style={{
                    display: 'grid', gridTemplateColumns: '40px 40px 1fr 1fr',
                    gap: '16px', padding: '10px 16px', borderRadius: '6px',
                    cursor: 'pointer', alignItems: 'center',
                    background: isActive ? 'var(--surface2)' : 'transparent',
                    transition: 'background 0.15s',
                    animationDelay: `${i * 0.02}s`,
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    {isActive && isPlaying ? (
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px', justifyContent: 'center' }}>
                        <span className="eq-bar" style={{ height: '8px' }} />
                        <span className="eq-bar" style={{ height: '14px' }} />
                        <span className="eq-bar" style={{ height: '6px' }} />
                      </div>
                    ) : (
                      <span style={{ color: isActive ? 'var(--accent)' : 'var(--text2)', fontSize: '13px' }}>
                        {isActive && !isPlaying ? '⏸' : i + 1}
                      </span>
                    )}
                  </div>

                  <img src={track.thumbnail} alt=""
                    style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />

                  <div style={{
                    fontSize: '14px', fontWeight: 600,
                    color: isActive ? 'var(--accent)' : 'white',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{track.title}</div>

                  <div style={{
                    fontSize: '13px', color: 'var(--text2)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{track.artist}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}