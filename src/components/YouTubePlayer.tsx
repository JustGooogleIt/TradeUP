import React, { useEffect, useRef, useState, useCallback } from 'react';

// YouTube IFrame API types
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface YouTubePlayerState {
  UNSTARTED: number;
  ENDED: number;
  PLAYING: number;
  PAUSED: number;
  BUFFERING: number;
  CUED: number;
}

interface PlayerInstance {
  loadVideoById: (videoId: string) => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  destroy: () => void;
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
  width?: number;
  height?: number;
  jumpToTimestamp?: number | null;
  highlightSegment?: { start: number; end: number } | null;
}

interface ChapterMarker {
  timestamp: number;
  title: string;
  color: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  onReady,
  onStateChange,
  onTimeUpdate,
  className = '',
  width = 854,
  height = 480,
  jumpToTimestamp,
  highlightSegment
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerInstance | null>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpMessage, setJumpMessage] = useState('');
  const [showControls, setShowControls] = useState(true);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chapter markers for important sections
  const chapterMarkers: ChapterMarker[] = [
    { timestamp: 55, title: 'Basic Electrical Quantities', color: '#ff6b6b' },
    { timestamp: 115, title: "Ohm's Law", color: '#4ecdc4' },
    { timestamp: 175, title: 'Circuit Symbols', color: '#45b7d1' },
    { timestamp: 235, title: 'Series vs Parallel', color: '#96ceb4' },
    { timestamp: 355, title: 'Power Calculations', color: '#ffeaa7' },
    { timestamp: 565, title: 'Circuit Protection', color: '#fd79a8' },
    { timestamp: 775, title: 'Troubleshooting', color: '#fdcb6e' },
    { timestamp: 955, title: 'Three-Phase Power', color: '#e17055' },
    { timestamp: 1165, title: 'Safety Procedures', color: '#00b894' }
  ];

  // Load YouTube IFrame API
  const loadYouTubeAPI = useCallback(() => {
    if (window.YT) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    });
  }, []);

  // Initialize player
  const initializePlayer = useCallback(async () => {
    try {
      await loadYouTubeAPI();
      
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        width,
        height,
        videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          fs: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          autohide: 0
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setDuration(event.target.getDuration());
            onReady?.();
          },
          onStateChange: (event: any) => {
            const state = event.data;
            setIsPlaying(state === window.YT.PlayerState.PLAYING);
            onStateChange?.(state);
            
            if (state === window.YT.PlayerState.PLAYING) {
              startTimeUpdate();
            } else {
              stopTimeUpdate();
            }
          },
          onError: (event: any) => {
            const errorCode = event.data;
            let errorMessage = 'Video unavailable';
            
            switch (errorCode) {
              case 2:
                errorMessage = 'Invalid video ID';
                break;
              case 5:
                errorMessage = 'Video cannot be played in HTML5 player';
                break;
              case 100:
                errorMessage = 'Video not found or private';
                break;
              case 101:
              case 150:
                errorMessage = 'Video not available in this region';
                break;
            }
            
            setError(errorMessage);
          }
        }
      });
    } catch (err) {
      setError('Failed to load YouTube player');
      console.error('YouTube Player Error:', err);
    }
  }, [videoId, width, height, onReady, onStateChange]);

  // Time update functionality
  const startTimeUpdate = useCallback(() => {
    if (timeUpdateInterval.current) return;
    
    timeUpdateInterval.current = setInterval(() => {
      if (playerRef.current && isReady) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        
        setCurrentTime(current);
        setDuration(total);
        onTimeUpdate?.(current, total);
      }
    }, 1000);
  }, [isReady, onTimeUpdate]);

  const stopTimeUpdate = useCallback(() => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
  }, []);

  // Player control methods
  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current && isReady) {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  }, [isReady]);

  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.playVideo();
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  }, [isReady]);

  const jumpSeconds = useCallback((seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    seekTo(newTime);
  }, [currentTime, duration, seekTo]);

  const changePlaybackRate = useCallback((rate: number) => {
    if (playerRef.current && isReady) {
      playerRef.current.setPlaybackRate(rate);
      setPlaybackRate(rate);
    }
  }, [isReady]);

  // Handle timestamp jumping with animation
  const jumpToTimestampWithAnimation = useCallback(async (timestamp: number) => {
    if (!playerRef.current || !isReady) return;

    setIsJumping(true);
    setJumpMessage(`Jumping to ${Math.floor(timestamp / 60)}:${(timestamp % 60).toFixed(0).padStart(2, '0')}`);
    
    // Fade effect and seek
    setTimeout(() => {
      seekTo(timestamp);
      play();
      
      // Show highlight effect
      if (highlightSegment) {
        setIsHighlighting(true);
        setTimeout(() => setIsHighlighting(false), 3000);
      }
      
      setTimeout(() => {
        setIsJumping(false);
        setJumpMessage('');
      }, 1000);
    }, 500);
  }, [isReady, seekTo, play, highlightSegment]);

  // Format time display
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle jump to timestamp prop
  useEffect(() => {
    if (jumpToTimestamp !== null && jumpToTimestamp !== undefined) {
      jumpToTimestampWithAnimation(jumpToTimestamp);
    }
  }, [jumpToTimestamp, jumpToTimestampWithAnimation]);

  // Initialize player on mount
  useEffect(() => {
    initializePlayer();
    
    return () => {
      stopTimeUpdate();
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [initializePlayer, stopTimeUpdate]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const container = containerRef.current?.parentElement;
    container?.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  if (error) {
    return (
      <div className={`youtube-player-error ${className}`} style={{ width, height }}>
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Video Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              initializePlayer();
            }}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`youtube-player-container ${className}`} style={{ width, height }}>
      {/* YouTube Player */}
      <div ref={containerRef} className="youtube-player" />
      
      {/* Jump Animation Overlay */}
      {isJumping && (
        <div className="jump-overlay">
          <div className="jump-message">
            <div className="jump-spinner">⏩</div>
            <span>{jumpMessage}</span>
          </div>
        </div>
      )}
      
      {/* Highlight Effect */}
      {isHighlighting && (
        <div className="highlight-overlay">
          <div className="highlight-border"></div>
        </div>
      )}

      {/* Custom Controls */}
      <div className={`player-controls ${showControls ? 'visible' : 'hidden'}`}>
        {/* Progress Bar with Chapter Markers */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            {chapterMarkers.map((marker) => (
              <div
                key={marker.timestamp}
                className="chapter-marker"
                style={{ 
                  left: `${duration > 0 ? (marker.timestamp / duration) * 100 : 0}%`,
                  backgroundColor: marker.color
                }}
                title={marker.title}
                onClick={() => jumpToTimestampWithAnimation(marker.timestamp)}
              />
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="controls-bottom">
          <div className="controls-left">
            <button 
              className="control-btn play-pause"
              onClick={isPlaying ? pause : play}
              disabled={!isReady}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button 
              className="control-btn"
              onClick={() => jumpSeconds(-10)}
              disabled={!isReady}
            >
              ⏪10
            </button>
            
            <button 
              className="control-btn"
              onClick={() => jumpSeconds(10)}
              disabled={!isReady}
            >
              10⏩
            </button>
            
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="controls-right">
            {/* Speed Controls */}
            <div className="speed-controls">
              {[1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  className={`speed-btn ${playbackRate === rate ? 'active' : ''}`}
                  onClick={() => changePlaybackRate(rate)}
                  disabled={!isReady}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .youtube-player-container {
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }

        .youtube-player-error {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: white;
          border-radius: 8px;
        }

        .error-content {
          text-align: center;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .retry-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #ff4757;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .jump-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .jump-message {
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem 2rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
          color: #333;
        }

        .jump-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .highlight-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 50;
        }

        .highlight-border {
          width: 100%;
          height: 100%;
          border: 4px solid #4ecdc4;
          border-radius: 8px;
          animation: highlight-pulse 3s ease-in-out;
        }

        @keyframes highlight-pulse {
          0%, 100% { opacity: 0; box-shadow: none; }
          50% { opacity: 1; box-shadow: 0 0 20px #4ecdc4; }
        }

        .player-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          padding: 1rem;
          transition: opacity 0.3s ease;
        }

        .player-controls.hidden {
          opacity: 0;
        }

        .player-controls.visible {
          opacity: 1;
        }

        .progress-container {
          margin-bottom: 1rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          position: relative;
          cursor: pointer;
        }

        .progress-fill {
          height: 100%;
          background: #ff4757;
          border-radius: 3px;
          transition: width 0.1s ease;
        }

        .chapter-marker {
          position: absolute;
          top: -2px;
          width: 4px;
          height: 10px;
          border-radius: 2px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .chapter-marker:hover {
          transform: scaleY(1.5);
        }

        .controls-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .control-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
          font-size: 0.9rem;
        }

        .control-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .play-pause {
          font-size: 1.2rem;
        }

        .time-display {
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          margin-left: 0.5rem;
        }

        .speed-controls {
          display: flex;
          gap: 0.25rem;
        }

        .speed-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.2s ease;
        }

        .speed-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
        }

        .speed-btn.active {
          background: #ff4757;
        }

        @media (max-width: 768px) {
          .controls-bottom {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .controls-left {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// Custom hooks
export const useYouTubePlayer = (videoId: string) => {
  const [player, setPlayer] = useState<PlayerInstance | null>(null);
  const [isReady, setIsReady] = useState(false);

  return {
    player,
    isReady,
    loadVideo: useCallback((newVideoId: string) => {
      if (player) {
        player.loadVideoById(newVideoId);
      }
    }, [player]),
    seekTo: useCallback((seconds: number) => {
      if (player && isReady) {
        player.seekTo(seconds, true);
      }
    }, [player, isReady]),
    play: useCallback(() => {
      if (player && isReady) {
        player.playVideo();
      }
    }, [player, isReady]),
    pause: useCallback(() => {
      if (player && isReady) {
        player.pauseVideo();
      }
    }, [player, isReady]),
    getCurrentTime: useCallback(() => {
      return player && isReady ? player.getCurrentTime() : 0;
    }, [player, isReady]),
    getDuration: useCallback(() => {
      return player && isReady ? player.getDuration() : 0;
    }, [player, isReady])
  };
};

export const useVideoProgress = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    currentTime,
    duration,
    percentage,
    setCurrentTime,
    setDuration
  };
};

export default YouTubePlayer;