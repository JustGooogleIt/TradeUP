import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div style={{ 
      padding: '1rem 2rem', 
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: '#fafafa'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <span style={{ 
          fontSize: '0.9rem', 
          color: '#666',
          fontWeight: '500'
        }}>
          Progress
        </span>
        <span style={{ 
          fontSize: '0.9rem', 
          color: '#667eea',
          fontWeight: '600'
        }}>
          {current} of {total}
        </span>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${progressPercentage}%`,
            transition: 'width 0.5s ease-in-out'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;