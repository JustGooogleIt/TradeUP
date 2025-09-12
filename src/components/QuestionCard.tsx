import React from 'react';

interface QuestionCardProps {
  question: string;
  answer: string;
  onAnswerChange: (value: string) => void;
  placeholder?: string;
  type?: 'textarea' | 'input';
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onAnswerChange,
  placeholder = "Your answer...",
  type = 'textarea'
}) => {
  return (
    <div className="card p-4 fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        color: '#333', 
        marginBottom: '2rem',
        textAlign: 'center',
        lineHeight: '1.4'
      }}>
        {question}
      </h2>
      
      {type === 'textarea' ? (
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '1.5rem',
            border: '2px solid #e0e0e0',
            borderRadius: '15px',
            fontSize: '1.1rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.3s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '1.5rem',
            border: '2px solid #e0e0e0',
            borderRadius: '15px',
            fontSize: '1.1rem',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.3s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          autoFocus
        />
      )}
    </div>
  );
};

export default QuestionCard;