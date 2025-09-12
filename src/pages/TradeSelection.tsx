import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Trade } from '../types';

const TradeSelection: React.FC = () => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const { setSelectedTrade: setContextTrade } = useAppContext();
  const navigate = useNavigate();

  const handleTradeSelect = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleContinue = () => {
    if (selectedTrade) {
      setContextTrade(selectedTrade);
      navigate('/resume-upload');
    }
  };

  return (
    <div className="container">
      <div className="card p-4 text-center fade-in">
        <div className="hero-section">
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            I want to become a...
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#666', 
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
          }}>
            Discover your path to a rewarding career in the trades. 
            Let's analyze your skills and create a personalized journey.
          </p>

          <div className="trade-selection" style={{ marginBottom: '3rem' }}>
            <div className="trade-options" style={{ 
              display: 'flex', 
              gap: '2rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <div 
                className={`trade-card ${selectedTrade === 'plumber' ? 'selected' : ''}`}
                onClick={() => handleTradeSelect('plumber')}
                style={{
                  padding: '2rem',
                  border: selectedTrade === 'plumber' ? '3px solid #667eea' : '2px solid #e0e0e0',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedTrade === 'plumber' ? '#f0f4ff' : 'white',
                  minWidth: '200px',
                  transform: selectedTrade === 'plumber' ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
                <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem' }}>
                  Plumber
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Water systems, pipe fitting, problem-solving
                </p>
              </div>

              <div 
                className={`trade-card ${selectedTrade === 'electrician' ? 'selected' : ''}`}
                onClick={() => handleTradeSelect('electrician')}
                style={{
                  padding: '2rem',
                  border: selectedTrade === 'electrician' ? '3px solid #667eea' : '2px solid #e0e0e0',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedTrade === 'electrician' ? '#f0f4ff' : 'white',
                  minWidth: '200px',
                  transform: selectedTrade === 'electrician' ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '0.5rem' }}>
                  Electrician
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Electrical systems, wiring, safety protocols
                </p>
              </div>
            </div>
          </div>

          <button 
            className="btn-primary"
            onClick={handleContinue}
            disabled={!selectedTrade}
            style={{
              fontSize: '1.2rem',
              padding: '1.2rem 3rem',
              opacity: selectedTrade ? 1 : 0.5,
              transform: selectedTrade ? 'scale(1)' : 'scale(0.95)',
              marginRight: '1rem'
            }}
          >
            Continue →
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => navigate('/demo')}
            style={{
              fontSize: '1.1rem',
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            🎯 Try Demo with Circuit Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeSelection;