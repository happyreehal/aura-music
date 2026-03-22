import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import UploadView from './components/UploadView';
import Player from './components/Player';

// Mobile bottom navigation
function MobileNav({ view, setView }) {
  const tabs = [
    { id: 'home',   icon: '⌂', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'upload', icon: '🎵', label: 'My Music' },
  ];
  return (
    <div className="mobile-nav" style={{
      position: 'fixed', bottom: '90px', left: 0, right: 0,
      background: '#09090b',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'none',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0',
      zIndex: 99,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '4px', background: 'none', border: 'none',
          color: view === t.id ? '#22d3ee' : '#52525b',
          cursor: 'pointer', padding: '6px 20px',
          transition: 'color 0.15s',
        }}>
          <span style={{ fontSize: '20px' }}>{t.icon}</span>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [view, setView]                 = useState('home');
  const [queue, setQueue]               = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [progress, setProgress]         = useState(0);
  const [duration, setDuration]         = useState(0);
  const [volume, setVolume]             = useState(0.8);
  const audioRef = useRef(new Audio());

  const currentTrack = currentIndex !== null ? queue[currentIndex] : null;

  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setProgress(audio.currentTime);
    const onDur  = () => setDuration(audio.duration || 0);
    const onEnd  = () => handleNext();
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('ended', onEnd);
    };
  }, []); // eslint-disable-line

  useEffect(() => { audioRef.current.volume = volume; }, [volume]);

  useEffect(() => {
    if (currentIndex === null || !queue[currentIndex]) return;
    const track = queue[currentIndex];
    setProgress(0); setDuration(0);
    if (track.isLocal) {
      audioRef.current.pause();
      audioRef.current.src = track.src;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(true);
    }
  }, [currentIndex]); // eslint-disable-line

  const playTrack = useCallback((track, list) => {
    const idx = list.findIndex(t => t.id === track.id);
    setQueue(list);
    setCurrentIndex(idx);
  }, []);

  const togglePlay = () => {
    if (!currentTrack) return;
    if (currentTrack.isLocal) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { audioRef.current.play(); setIsPlaying(true); }
    } else {
      setIsPlaying(p => !p);
    }
  };

  const handleNext = useCallback(() => {
    if (!queue.length) return;
    setCurrentIndex(i => (i + 1) % queue.length);
  }, [queue]);

  const handlePrev = useCallback(() => {
    if (!queue.length) return;
    setCurrentIndex(i => (i - 1 + queue.length) % queue.length);
  }, [queue]);

  const handleSeek = (val) => {
    if (currentTrack?.isLocal) {
      audioRef.current.currentTime = val;
      setProgress(val);
    }
  };

  const handleProgressUpdate = useCallback((cur, dur) => {
    setProgress(cur);
    setDuration(dur);
  }, []);

  const renderView = () => {
    switch (view) {
      case 'home':   return <HomeView setView={setView} />;
      case 'search': return <SearchView playTrack={playTrack} currentTrack={currentTrack} isPlaying={isPlaying} />;
      case 'upload': return <UploadView playTrack={playTrack} currentTrack={currentTrack} isPlaying={isPlaying} />;
      default:       return <HomeView setView={setView} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#09090b' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar — desktop only */}
        <Sidebar view={view} setView={setView} />

        {/* Main content */}
        <main style={{
          flex: 1, overflowY: 'auto', paddingBottom: '90px',
          background: 'linear-gradient(180deg, rgba(124,58,237,0.15) 0%, #09090b 40%)',
        }}>
          {renderView()}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav view={view} setView={setView} />

      {/* Player */}
      <Player
        track={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        volume={volume}
        onToggle={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onVolume={setVolume}
        onProgressUpdate={handleProgressUpdate}
      />
    </div>
  );
}