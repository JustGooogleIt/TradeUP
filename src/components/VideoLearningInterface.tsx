import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import './VideoLearningInterface.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  timestamps?: number[];
  isSystem?: boolean;
}

interface VideoLearningInterfaceProps {
  skillName: string;
  onComplete: () => void;
  videoId: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const VideoLearningInterface: React.FC<VideoLearningInterfaceProps> = ({
  skillName,
  onComplete,
  videoId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const playerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    // Initialize VAPI
    initializeVapi();
  }, []);

  const initializeVapi = () => {
    try {
      // Using the provided API key as public key
      vapiRef.current = new Vapi("48de5348-bc59-433c-a0e5-d873e5db5891");
      
      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        setIsVoiceActive(true);
        console.log('VAPI call started');
      });

      vapiRef.current.on('call-end', () => {
        setIsVoiceActive(false);
        console.log('VAPI call ended');
      });

      vapiRef.current.on('speech-start', () => {
        console.log('User started speaking');
      });

      vapiRef.current.on('speech-end', () => {
        console.log('User stopped speaking');
      });

      vapiRef.current.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          // Handle user voice input
          const userMessage: Message = {
            id: Date.now().toString(),
            content: message.transcript,
            isUser: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMessage]);
          setHasInteracted(true);
        }
      });

      vapiRef.current.on('error', (error: any) => {
        console.error('VAPI error:', error);
        setIsVoiceActive(false);
      });

      setIsVoiceEnabled(true);
    } catch (error) {
      console.error('Failed to initialize VAPI:', error);
    }
  };

  const initializePlayer = () => {
    try {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          fs: 1,
          cc_load_policy: 0
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      setIsPlayerReady(true); // Fallback to show interface
    }
  };

  const onPlayerReady = () => {
    setIsPlayerReady(true);
    // Update current time every second
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(Math.floor(playerRef.current.getCurrentTime()));
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setHasInteracted(true);
    }
  };

  const seekToTimestamp = (seconds: number) => {
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
      setHasInteracted(true);
      
      // Add a system message indicating the jump
      const jumpMessage: Message = {
        id: Date.now().toString(),
        content: `🎯 Jumped to ${formatTime(seconds)} - Now playing the relevant section!`,
        isUser: false,
        timestamp: new Date(),
        isSystem: true
      };
      
      setMessages(prev => [...prev, jumpMessage]);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setHasInteracted(true);

    // Generate immediate response without any delay for demo
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateAIResponse(inputMessage),
      isUser: false,
      timestamp: new Date(),
      timestamps: extractTimestamps(inputMessage)
    };

    // Add response immediately - no timeout
    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Specific demo responses
    if (lowerInput.includes('breaker') && lowerInput.includes('wire') && lowerInput.includes('feed')) {
      return "Great question about breaker wiring! When a breaker is turned on, it feeds the hot (live) wire first. This is a fundamental concept in electrical safety and circuit operation. Jump to 1:12 to see the exact demonstration of how breakers control power flow.";
    }
    if (lowerInput.includes('parallel') && lowerInput.includes('voltage')) {
      return "Excellent question about parallel circuits! In parallel circuits, voltage remains constant across all branches, but current divides. Check out the timestamps to see practical examples and calculations.";
    }
    if (lowerInput.includes('safety') && lowerInput.includes('equipment')) {
      return "Safety first! Essential equipment includes safety glasses, insulated tools, and proper grounding. The video covers all the critical safety measures you need to know.";
    }
    if (lowerInput.includes('ohm') && lowerInput.includes('law')) {
      return "Ohm's law is fundamental to understanding circuits! V = I × R explains the relationship between voltage, current, and resistance. I've found multiple sections that explain this with practical examples.";
    }
    
    // General fallbacks
    if (lowerInput.includes('circuit')) {
      return "Great question about circuits! In the video, you can see how basic circuits work. The fundamental principle is that electricity flows in a closed loop. Check out the timestamps I've provided to see specific examples of circuit components and their functions.";
    }
    if (lowerInput.includes('resistor')) {
      return "Resistors are crucial components that limit current flow in circuits. They're color-coded to indicate their resistance value. The video shows several examples of how resistors are used in practical circuits.";
    }
    return "That's an interesting question about " + skillName.toLowerCase() + ". The video covers this topic in detail. Let me know if you need clarification on any specific part!";
  };

  const extractTimestamps = (userInput: string): number[] => {
    const lowerInput = userInput.toLowerCase();
    
    // Specific demo questions with exact timestamps
    if (lowerInput.includes('breaker') && lowerInput.includes('wire') && lowerInput.includes('feed')) {
      return [72]; // 1:12
    }
    if (lowerInput.includes('parallel') && lowerInput.includes('voltage')) {
      return [225, 320]; // 3:45, 5:20
    }
    if (lowerInput.includes('safety') && lowerInput.includes('equipment')) {
      return [75]; // 1:15
    }
    if (lowerInput.includes('ohm') && lowerInput.includes('law')) {
      return [125, 390, 525]; // 2:05, 6:30, 8:45
    }
    
    // General fallbacks
    if (lowerInput.includes('circuit')) {
      return [45, 120, 180];
    }
    if (lowerInput.includes('resistor')) {
      return [95, 240];
    }
    return [];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startVoiceCall = async () => {
    if (!vapiRef.current || isVoiceActive) return;
    
    try {
      // Start call with the provided assistant ID
      await vapiRef.current.start("908bc7ed-cc26-4ca7-94ed-19d5c54cddb8");
    } catch (error) {
      console.error('Failed to start voice call:', error);
    }
  };

  const endVoiceCall = () => {
    if (vapiRef.current && isVoiceActive) {
      vapiRef.current.stop();
    }
  };

  const toggleVoice = () => {
    if (isVoiceActive) {
      endVoiceCall();
    } else {
      startVoiceCall();
    }
  };

  return (
    <div className="video-learning-container">
      <div className="video-section">
        <div className="video-header">
          <h2>{skillName} - Interactive Learning</h2>
          <div className="current-time">
            Current Time: {formatTime(currentTime)}
          </div>
        </div>
        <div className="video-wrapper">
          <div id="youtube-player" style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            {!isPlayerReady && (
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                Loading Circuit Design Video...
              </div>
            )}
          </div>
        </div>
        <div className="video-controls">
          <button 
            onClick={() => playerRef.current?.playVideo()}
            disabled={!isPlayerReady}
            className="control-btn"
          >
            Play
          </button>
          <button 
            onClick={() => playerRef.current?.pauseVideo()}
            disabled={!isPlayerReady}
            className="control-btn"
          >
            Pause
          </button>
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h3>Ask anything about {skillName.toLowerCase()}</h3>
        </div>
        
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.isUser ? 'user' : message.isSystem ? 'system' : 'ai'}`}>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                {message.timestamps && message.timestamps.length > 0 && (
                  <div className="timestamps">
                    {message.timestamps.map((timestamp, index) => (
                      <button
                        key={index}
                        className="timestamp-pill"
                        onClick={() => seekToTimestamp(timestamp)}
                      >
                        {formatTime(timestamp)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="loading-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the video content..."
              className="message-input"
              disabled={isVoiceActive}
            />
            <button 
              onClick={toggleVoice}
              disabled={!isVoiceEnabled}
              className={`voice-button ${isVoiceActive ? 'active' : ''}`}
              title={isVoiceActive ? 'Stop Voice Chat' : 'Start Voice Chat'}
            >
              {isVoiceActive ? '🔊' : '🎤'}
            </button>
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isVoiceActive}
              className="send-button"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {hasInteracted && (
        <div className="completion-section">
          <button onClick={onComplete} className="complete-button">
            Mark {skillName} Complete
          </button>
        </div>
      )}
    </div>
  );
};