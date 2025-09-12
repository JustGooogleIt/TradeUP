import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { QuestionAnswers } from '../types';
import ProgressBar from '../components/ProgressBar';

interface Question {
  id: number;
  question: string;
  type: 'textarea' | 'scale';
  key: keyof QuestionAnswers;
  placeholder?: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What motivates you to transition into this trade?",
    type: 'textarea',
    key: 'motivation',
    placeholder: "Tell us about your passion for this career change..."
  },
  {
    id: 2,
    question: "Describe any hands-on work or DIY experience you have",
    type: 'textarea',
    key: 'handsOn',
    placeholder: "Share your experience with tools, repairs, building projects..."
  },
  {
    id: 3,
    question: "How comfortable are you with physically demanding work?",
    type: 'scale',
    key: 'physicalWork',
    placeholder: "Rate from 1-10 and explain your comfort level..."
  },
  {
    id: 4,
    question: "Describe a complex problem you've solved and your approach",
    type: 'textarea',
    key: 'problemSolving',
    placeholder: "Walk us through your problem-solving process..."
  },
  {
    id: 5,
    question: "What's your availability for training and apprenticeship?",
    type: 'textarea',
    key: 'availability',
    placeholder: "Tell us about your schedule flexibility and commitment..."
  }
];

const QuestionFlow: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const { questionAnswers, updateQuestionAnswer } = useAppContext();
  
  const currentQuestionNumber = parseInt(questionId || '1');
  const currentQuestion = questions.find(q => q.id === currentQuestionNumber);
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [scaleValue, setScaleValue] = useState(5);
  const [scaleExplanation, setScaleExplanation] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = questionAnswers[currentQuestion.key];
      if (currentQuestion.type === 'scale' && existingAnswer) {
        const parts = existingAnswer.split(' - ');
        setScaleValue(parseInt(parts[0]) || 5);
        setScaleExplanation(parts[1] || '');
      } else {
        setCurrentAnswer(existingAnswer || '');
      }
    }
  }, [currentQuestion, questionAnswers]);

  const handleNext = () => {
    if (!currentQuestion) return;

    let answerToSave = currentAnswer;
    if (currentQuestion.type === 'scale') {
      answerToSave = `${scaleValue} - ${scaleExplanation}`;
    }

    updateQuestionAnswer(currentQuestion.key, answerToSave);

    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestionNumber < questions.length) {
        navigate(`/questions/${currentQuestionNumber + 1}`);
      } else {
        navigate('/results');
      }
      setIsTransitioning(false);
    }, 200);
  };

  const handlePrevious = () => {
    if (currentQuestionNumber > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        navigate(`/questions/${currentQuestionNumber - 1}`);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleNext();
    }
  };

  const isAnswered = () => {
    if (currentQuestion?.type === 'scale') {
      return scaleExplanation.trim().length > 0;
    }
    return currentAnswer.trim().length > 0;
  };

  if (!currentQuestion) {
    return <div>Question not found</div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <ProgressBar 
          current={currentQuestionNumber} 
          total={questions.length} 
        />
        
        <div 
          className={`question-content ${isTransitioning ? 'transitioning' : 'fade-in'}`}
          style={{ 
            padding: '3rem 4rem',
            opacity: isTransitioning ? 0.5 : 1,
            transform: isTransitioning ? 'translateX(20px)' : 'translateX(0)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ 
              color: '#667eea', 
              fontSize: '1rem', 
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Question {currentQuestionNumber} of {questions.length}
            </div>
            
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#333',
              lineHeight: '1.3',
              marginBottom: '2rem'
            }}>
              {currentQuestion.question}
            </h1>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            {currentQuestion.type === 'textarea' ? (
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={currentQuestion.placeholder}
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
              <div>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '2rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Not comfortable</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scaleValue}
                      onChange={(e) => setScaleValue(parseInt(e.target.value))}
                      style={{
                        flex: 1,
                        height: '8px',
                        background: `linear-gradient(to right, #667eea 0%, #667eea ${(scaleValue - 1) * 11.11}%, #e0e0e0 ${(scaleValue - 1) * 11.11}%, #e0e0e0 100%)`,
                        borderRadius: '4px',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Very comfortable</span>
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold', 
                      color: '#667eea' 
                    }}>
                      {scaleValue}
                    </span>
                  </div>
                </div>
                
                <textarea
                  value={scaleExplanation}
                  onChange={(e) => setScaleExplanation(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Please explain your rating..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
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
                />
              </div>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <button
              className="btn-secondary"
              onClick={handlePrevious}
              style={{ 
                visibility: currentQuestionNumber > 1 ? 'visible' : 'hidden',
                opacity: currentQuestionNumber > 1 ? 1 : 0
              }}
            >
              ← Previous
            </button>

            <div style={{ color: '#999', fontSize: '0.9rem' }}>
              Press Ctrl + Enter to continue
            </div>

            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!isAnswered()}
              style={{ 
                opacity: isAnswered() ? 1 : 0.5,
                transform: isAnswered() ? 'scale(1)' : 'scale(0.95)'
              }}
            >
              {currentQuestionNumber < questions.length ? 'Next →' : 'See My Results →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionFlow;