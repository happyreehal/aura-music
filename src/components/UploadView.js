import React, { useState, useRef } from 'react';
import TrackCard from './TrackCard';

function readFileMeta(file) {
  return {
    id: `local-${file.name}-${file.lastModified}`,
    title: file.name.replace(/\.[^/.]+$/, ''),  // strip extension
    artist: 'Local File',
    album: 'My Music',
    artwork: null,
    src: URL.createObjectURL(file),
    isPreview: false,
  };
}

export default function UploadView({ playTrack, currentTrack, isPlaying }) {
  const [tracks, setTracks] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const addFiles = (files) => {
    const mp3s = Array.from(files).filter(f =>
      f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|flac|m4a|aac)$/i)
    );
    if (!mp3s.length) return;
    const newTracks = mp3s.map(readFileMeta);
    setTracks(prev => {
      const ids = new Set(prev.map(t => t.id));
      return [...prev, ...newTracks.filter(t => !ids.has(t.id))];
    });
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onInputChange = (e) => addFiles(e.target.files);

  const removeTrack = (id) => {
    setTracks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: '32px 36px', fontFamily: 'var(--font-body)' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: '32px', marginBottom: '6px', letterSpacing: '-0.5px',
      }}>My Music</h1>
      <p style={{ color:'var(--muted)', fontSize:'14px', marginBottom:'28px' }}>
        Upload MP3, WAV, FLAC, M4A files from your device
      </p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '32px',
          background: dragging ? 'rgba(167,139,250,0.05)' : 'var(--surface)',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📁</div>
        <p style={{ fontWeight: 600, marginBottom: '6px' }}>
          {dragging ? 'Drop your files here!' : 'Drag & drop audio files'}
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
          Supports MP3, WAV, FLAC, M4A, OGG, AAC
        </p>
        <button style={{
          padding: '10px 24px', borderRadius: '99px', border: 'none',
          background: 'linear-gradient(135deg, var(--accent2), var(--accent))',
          color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
        }}>
          Browse Files
        </button>
        <input
          ref={inputRef} type="file" multiple
          accept="audio/*,.mp3,.wav,.flac,.m4a,.ogg,.aac"
          style={{ display:'none' }} onChange={onInputChange}
        />
      </div>

      {/* Track list */}
      {tracks.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px 0', color:'var(--muted)' }}>
          <p style={{ fontSize:'15px' }}>No files uploaded yet.</p>
          <p style={{ fontSize:'13px', marginTop:'6px' }}>Upload your music to start listening.</p>
        </div>
      ) : (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
            <p style={{ color:'var(--muted)', fontSize:'13px' }}>{tracks.length} track{tracks.length !== 1 ? 's' : ''}</p>
            <button onClick={() => playTrack(tracks[0], tracks)} style={{
              padding:'8px 20px', borderRadius:'99px', border:'none',
              background:'var(--surface2)', color:'var(--text)',
              fontSize:'13px', fontWeight:600, cursor:'pointer',
            }}>
              ▶ Play All
            </button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {tracks.map((track, i) => (
              <div key={track.id} style={{
                display:'flex', alignItems:'center', gap:'14px',
                padding:'12px 16px', borderRadius:'12px',
                background: currentTrack?.id === track.id ? 'var(--surface2)' : 'var(--surface)',
                border: `1px solid ${currentTrack?.id === track.id ? 'var(--accent)' : 'var(--border)'}`,
                cursor:'pointer', transition:'all 0.15s',
              }}
              onClick={() => playTrack(track, tracks)}
              >
                {/* Number / playing indicator */}
                <div style={{
                  width:'32px', height:'32px', borderRadius:'8px',
                  background:'var(--surface2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'13px', color:'var(--muted)', flexShrink:0,
                }}>
                  {currentTrack?.id === track.id && isPlaying ? '▶' : i + 1}
                </div>

                {/* Music icon (no artwork for local files) */}
                <div style={{
                  width:'44px', height:'44px', borderRadius:'8px', flexShrink:0,
                  background:'linear-gradient(135deg, var(--accent2), var(--accent))',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px',
                }}>🎵</div>

                {/* Title */}
                <div style={{ flex:1, overflow:'hidden' }}>
                  <div style={{
                    fontWeight:600, fontSize:'14px',
                    color: currentTrack?.id === track.id ? 'var(--accent)' : 'var(--text)',
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                  }}>{track.title}</div>
                  <div style={{ fontSize:'12px', color:'var(--muted)', marginTop:'2px' }}>Local File</div>
                </div>

                {/* Remove button */}
                <button
                  onClick={e => { e.stopPropagation(); removeTrack(track.id); }}
                  style={{
                    background:'transparent', border:'none', color:'var(--muted)',
                    cursor:'pointer', fontSize:'18px', padding:'4px', flexShrink:0,
                  }}
                  title="Remove"
                >×</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
