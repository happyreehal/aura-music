import React, { useEffect, useRef } from 'react';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function Player({
  track, isPlaying, progress, duration, volume,
  onToggle, onNext, onPrev, onSeek, onVolume,
  onProgressUpdate,
}) {
  const playerRef    = useRef(null);
  const intervalRef  = useRef(null);
  const containerRef = useRef(null);
  const readyRef     = useRef(false);

  // ── Load YouTube IFrame API once ────────────────────────────────────────
  useEffect(() => {
    if (window.YT && window.YT.Player) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }, []);

  // ── Create / reload player when track changes ───────────────────────────
  useEffect(() => {
    if (!track?.isYoutube || !track?.videoId) return;

    // Clear old progress interval
    clearInterval(intervalRef.current);
    readyRef.current = false;

    const initPlayer = () => {
      // Destroy old player
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: track.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            playerRef.current.setVolume(volume * 100);
            playerRef.current.playVideo();

            // Update progress every second
            intervalRef.current = setInterval(() => {
              if (!playerRef.current || !readyRef.current) return;
              const cur = playerRef.current.getCurrentTime?.() || 0;
              const dur = playerRef.current.getDuration?.() || 0;
              onProgressUpdate?.(cur, dur);
            }, 1000);
          },
        },
      });
    };

    // Wait for API if not loaded yet
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => clearInterval(intervalRef.current);
  }, [track?.videoId]); // eslint-disable-line

  // ── Play / Pause ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!track?.isYoutube || !readyRef.current) return;
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying, track?.isYoutube]);

  // ── Volume ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!track?.isYoutube || !readyRef.current) return;
    playerRef.current?.setVolume?.(volume * 100);
  }, [volume, track?.isYoutube]);

  // ── Seek ─────────────────────────────────────────────────────────────────
  const handleSeek = (val) => {
    if (track?.isYoutube && readyRef.current) {
      playerRef.current?.seekTo?.(val, true);
      onProgressUpdate?.(val, duration);
    } else {
      onSeek(val);
    }
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: '90px',
      background: '#181818',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '20px', zIndex: 100,
    }}>

      {/* Hidden YT player div */}
      <div style={{ position: 'absolute', bottom: '-9999px', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <div ref={containerRef} />
      </div>

      {/* Track info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '240px', flexShrink: 0 }}>
        {track ? (
          <>
            <img
              src={track.thumbnail || track.artwork}
              alt=""
              style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontWeight: 600, fontSize: '13px', color: 'white',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{track.title}</div>
              <div style={{
                fontSize: '12px', color: 'var(--accent)', marginTop: '3px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{track.artist}</div>
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Koi gana nahi chal raha</div>
        )}
      </div>

      {/* Center controls */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={onPrev} disabled={!track} style={{
            background: 'none', border: 'none',
            color: track ? 'var(--text2)' : 'var(--muted)',
            fontSize: '20px', cursor: track ? 'pointer' : 'default', transition: 'color 0.15s',
          }}
            onMouseEnter={e => { if (track) e.target.style.color = 'white'; }}
            onMouseLeave={e => { if (track) e.target.style.color = 'var(--text2)'; }}
          >⏮</button>

          <button onClick={onToggle} disabled={!track} style={{
            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
            background: track ? 'white' : 'var(--surface3)',
            color: track ? 'black' : 'var(--muted)',
            fontSize: '15px', cursor: track ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.15s',
          }}
            onMouseEnter={e => { if (track) e.target.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button onClick={onNext} disabled={!track} style={{
            background: 'none', border: 'none',
            color: track ? 'var(--text2)' : 'var(--muted)',
            fontSize: '20px', cursor: track ? 'pointer' : 'default', transition: 'color 0.15s',
          }}
            onMouseEnter={e => { if (track) e.target.style.color = 'white'; }}
            onMouseLeave={e => { if (track) e.target.style.color = 'var(--text2)'; }}
          >⏭</button>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text2)', width: '35px', textAlign: 'right' }}>
            {fmt(progress)}
          </span>
          <div style={{ position: 'relative', flex: 1, height: '4px', cursor: track ? 'pointer' : 'default' }}
            onMouseEnter={e => { const f = e.currentTarget.querySelector('.pfill'); if (f) f.style.background = 'var(--accent)'; }}
            onMouseLeave={e => { const f = e.currentTarget.querySelector('.pfill'); if (f) f.style.background = 'white'; }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'var(--surface3)', borderRadius: '99px' }} />
            <div className="pfill" style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${pct}%`, background: 'white', borderRadius: '99px',
              transition: 'width 0.3s linear, background 0.15s',
            }} />
            <input
              type="range" min={0} max={duration || 100} step={1} value={progress}
              onChange={e => handleSeek(parseFloat(e.target.value))}
              disabled={!track}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: track ? 'pointer' : 'default' }}
            />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text2)', width: '35px' }}>
            {fmt(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '160px', flexShrink: 0, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '15px', color: 'var(--text2)' }}>
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </span>
        <div style={{ position: 'relative', width: '90px', height: '4px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--surface3)', borderRadius: '99px' }} />
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${volume * 100}%`, background: 'white', borderRadius: '99px',
          }} />
          <input type="range" min={0} max={1} step={0.01} value={volume}
            onChange={e => onVolume(parseFloat(e.target.value))}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
          />
        </div>
      </div>

    </div>
  );
}