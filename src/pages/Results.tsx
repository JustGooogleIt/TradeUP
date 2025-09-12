import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { analyzeCompatibility, generateSkillJourney } from '../utils/aiProcessor';
import { getSkillsByTrade } from '../utils/skillsData';
import SkillJourneyMap from '../components/SkillJourneyMap';
import { VideoLearningInterface } from '../components/VideoLearningInterface';
import { demoController, sampleUserProfile } from '../utils/demoData';
import Vapi from '@vapi-ai/web';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedTrade,
    resumeSkills,
    questionAnswers,
    compatibilityScore,
    skillGaps,
    setCompatibilityScore,
    setSkillGaps,
    resetApp
  } = useAppContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [skillJourney, setSkillJourney] = useState<any[]>([]);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [currentLearningSkill, setCurrentLearningSkill] = useState<string | null>(null);
  const [learningProgress, setLearningProgress] = useState<{ [skillName: string]: number }>({});
  const [showVideoInterface, setShowVideoInterface] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    const analyzeResults = async () => {
      try {
        let currentTrade = selectedTrade;
        let currentResumeSkills = resumeSkills;
        let currentQuestionAnswers = questionAnswers;
        
        // Use demo data if no assessment data is available
        if (!selectedTrade || resumeSkills.length === 0) {
          console.log('No assessment data found, using demo data for Circuit Design showcase...');
          currentTrade = 'electrician';
          currentResumeSkills = sampleUserProfile.resume.skills;
          currentQuestionAnswers = sampleUserProfile.questionnaire;
          
          // Set the context with demo data
          setCompatibilityScore(65); // Demo score
        }
        
        const result = analyzeCompatibility(currentResumeSkills, currentTrade || 'electrician', currentQuestionAnswers);
        setCompatibilityScore(result.score);
        
        // Ensure Circuit Design is in the skill gaps for demo
        const demoSkillGaps = [
          { skill: 'Circuit Design', currentLevel: 2, requiredLevel: 8, priority: 'high' },
          { skill: 'Electrical Safety', currentLevel: 3, requiredLevel: 9, priority: 'critical' },
          { skill: 'Wiring Installation', currentLevel: 4, requiredLevel: 7, priority: 'medium' },
          { skill: 'Motor Control Systems', currentLevel: 1, requiredLevel: 6, priority: 'medium' },
          { skill: 'PLC Programming', currentLevel: 1, requiredLevel: 5, priority: 'low' }
        ];
        
        setSkillGaps(demoSkillGaps);
        
        const journey = generateSkillJourney(demoSkillGaps);
        setSkillJourney(journey);
        
        // Find matched skills
        const tradeSkills = getSkillsByTrade(currentTrade || 'electrician');
        const matched = currentResumeSkills.filter(skill => 
          tradeSkills.some(tradeSkill => 
            skill.toLowerCase().includes(tradeSkill.name.toLowerCase()) ||
            tradeSkill.name.toLowerCase().includes(skill.toLowerCase())
          )
        );
        setMatchedSkills(matched);
        
      } catch (error) {
        console.error('Error analyzing compatibility:', error);
      } finally {
        setIsLoading(false);
      }
    };

    analyzeResults();
  }, [selectedTrade, resumeSkills, questionAnswers, setCompatibilityScore, setSkillGaps]);

  useEffect(() => {
    // Initialize VAPI
    initializeVapi();
  }, []);

  const initializeVapi = () => {
    try {
      console.log('Initializing VAPI...');
      // Using the provided API key as public key
      vapiRef.current = new Vapi("48de5348-bc59-433c-a0e5-d873e5db5891");
      
      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        setIsVoiceActive(true);
        setShowToast('🎤 Voice assistant activated! Ask me about your trades career.');
        setTimeout(() => setShowToast(null), 3000);
        console.log('VAPI call started');
      });

      vapiRef.current.on('call-end', () => {
        setIsVoiceActive(false);
        setShowToast('🔇 Voice chat ended.');
        setTimeout(() => setShowToast(null), 2000);
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
          setShowToast(`📝 You said: "${message.transcript}"`);
          setTimeout(() => setShowToast(null), 4000);
        }
      });

      vapiRef.current.on('error', (error: any) => {
        console.error('VAPI error:', error);
        setIsVoiceActive(false);
        setShowToast('❌ Voice chat error. Check your connection and try again.');
        setTimeout(() => setShowToast(null), 3000);
      });

      setIsVoiceEnabled(true);
    } catch (error) {
      console.error('Failed to initialize VAPI:', error);
      setShowToast('❌ Voice assistant unavailable. Please check your internet connection.');
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const getMotivationalMessage = (score: number) => {
    if (score >= 80) return "Excellent match! You're well-positioned for this career transition.";
    if (score >= 60) return "Great potential! With focused learning, you'll be ready soon.";
    if (score >= 40) return "Good foundation! A structured learning path will get you there.";
    return "Every expert was once a beginner. Your journey starts here!";
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (skillGaps.some(gap => gap.skill.toLowerCase().includes('safety'))) {
      steps.push({
        title: "Start with Safety Training",
        description: "Complete OSHA safety certification - essential for all trades",
        icon: "🛡️"
      });
    }
    
    if (skillGaps.some(gap => gap.skill.toLowerCase().includes('tool'))) {
      steps.push({
        title: "Build Tool Familiarity",
        description: "Practice with basic trade tools and equipment",
        icon: "🔧"
      });
    }
    
    steps.push({
      title: "Join Electrical Communities",
      description: "Connect with professionals and learn from their experiences",
      icon: "👥"
    });
    
    return steps.slice(0, 3);
  };

  const handleStartLearning = (skillName: string) => {
    setCurrentLearningSkill(skillName);
    setShowVideoInterface(true);
    demoController.startLearning(skillName);
  };

  const handleCompleteSkill = () => {
    if (currentLearningSkill) {
      setCompletedSkills(prev => [...prev, currentLearningSkill]);
      setLearningProgress(prev => ({ ...prev, [currentLearningSkill]: 100 }));
      demoController.completeSkill(currentLearningSkill);
      
      setShowToast(`Great job! ${currentLearningSkill} completed. Ready for the next skill?`);
      setTimeout(() => setShowToast(null), 5000);
      
      setCurrentLearningSkill(null);
      setShowVideoInterface(false);
    }
  };

  const startVoiceCall = async () => {
    if (!vapiRef.current || isVoiceActive) return;
    
    try {
      console.log('Starting VAPI call...');
      setShowToast('🔄 Connecting to voice assistant...');
      // Start call with the provided assistant ID
      await vapiRef.current.start("908bc7ed-cc26-4ca7-94ed-19d5c54cddb8");
    } catch (error) {
      console.error('Failed to start voice call:', error);
      setIsVoiceActive(false);
      setShowToast('❌ Failed to connect to voice assistant. Please check your internet connection.');
      setTimeout(() => setShowToast(null), 4000);
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

  const isSkillCompleted = (skillName: string) => completedSkills.includes(skillName);
  
  const getNextRecommendedSkill = () => {
    const skillsToLearn = skillGaps.map(gap => gap.skill);
    return skillsToLearn.find(skill => !completedSkills.includes(skill));
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="card p-4 text-center">
          <div className="loading-spinner mb-4"></div>
          <h2>Analyzing your compatibility...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div className="results-dashboard fade-in">
        {/* Header Section */}
        <div className="card mb-4">
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ flex: 1 }}></div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#333',
                flex: 2,
                textAlign: 'center'
              }}>
                Your Journey to Becoming an Electrician
              </h1>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={toggleVoice}
                  disabled={!isVoiceEnabled}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: isVoiceActive ? '#4CAF50' : '#667eea',
                    color: 'white',
                    fontSize: '1.2rem',
                    cursor: isVoiceEnabled ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    minWidth: '50px',
                    minHeight: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isVoiceActive ? 'pulse 1.5s infinite' : 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  title={isVoiceActive ? 'Stop Voice Assistant' : 'Start Voice Assistant'}
                  onMouseOver={(e) => {
                    if (isVoiceEnabled) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  {isVoiceActive ? '🔊' : '🎤'}
                </button>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                position: 'relative',
                width: '150px',
                height: '150px'
              }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle 
                    cx="75" cy="75" r="65" 
                    fill="none" 
                    stroke="#e0e0e0" 
                    strokeWidth="12"
                  />
                  <circle 
                    cx="75" cy="75" r="65" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${compatibilityScore * 4.08} 408`}
                    transform="rotate(-90 75 75)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#667eea'
                }}>
                  {compatibilityScore}%
                </div>
              </div>
            </div>
            
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              {getMotivationalMessage(compatibilityScore)}
            </p>
          </div>
        </div>

        {/* Skills Analysis Section */}
        <div className="grid grid-2 mb-4">
          <div className="card p-4">
            <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>
              ✅ Your Transferable Skills
            </h2>
            <div>
              {matchedSkills.map((skill, index) => (
                <div key={index} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  margin: '0.5rem 0',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '10px',
                  border: '1px solid #e0f2fe'
                }}>
                  <span style={{ color: '#4CAF50', marginRight: '1rem' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#333' }}>{skill}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Valuable for electrical work
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>
              📚 Skills to Develop
            </h2>
            <div>
              {skillGaps.slice(0, 6).map((gap, index) => {
                const isCompleted = isSkillCompleted(gap.skill);
                const isCurrentlyLearning = currentLearningSkill === gap.skill;
                const isNextRecommended = gap.skill === getNextRecommendedSkill();
                
                return (
                  <div key={index} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    margin: '0.5rem 0',
                    backgroundColor: isCompleted ? '#f0f9ff' : isCurrentlyLearning ? '#fef3c7' : '#fff7ed',
                    borderRadius: '10px',
                    border: `1px solid ${isCompleted ? '#e0f2fe' : isCurrentlyLearning ? '#fcd34d' : '#fed7aa'}`,
                    opacity: isCompleted ? 0.7 : 1,
                    animation: isNextRecommended && !isCompleted ? 'pulse 2s infinite' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      {isCompleted && (
                        <span style={{ color: '#4CAF50', marginRight: '1rem', fontSize: '1.2rem' }}>✓</span>
                      )}
                      <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>{gap.skill}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          {isCompleted ? 'Completed!' : `Current: ${gap.currentLevel}/10 → Target: ${gap.requiredLevel}/10`}
                        </div>
                        {learningProgress[gap.skill] && learningProgress[gap.skill] > 0 && (
                          <div style={{ marginTop: '0.5rem' }}>
                            <div style={{ 
                              width: '100%',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '10px',
                              height: '6px'
                            }}>
                              <div style={{
                                width: `${learningProgress[gap.skill]}%`,
                                backgroundColor: '#4CAF50',
                                borderRadius: '10px',
                                height: '100%',
                                transition: 'width 0.3s ease'
                              }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        backgroundColor: gap.requiredLevel >= 8 ? '#fecaca' : 
                                       gap.requiredLevel >= 6 ? '#fed7aa' : '#d1fae5',
                        color: gap.requiredLevel >= 8 ? '#7f1d1d' : 
                               gap.requiredLevel >= 6 ? '#9a3412' : '#14532d',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {gap.requiredLevel >= 8 ? 'Advanced' : 
                         gap.requiredLevel >= 6 ? 'Intermediate' : 'Basic'}
                      </div>
                      {!isCompleted && gap.skill === 'Circuit Design' && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button 
                            onClick={() => handleStartLearning(gap.skill)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              border: 'none',
                              backgroundColor: isCurrentlyLearning ? '#fbbf24' : '#667eea',
                              color: 'white',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (!isCurrentlyLearning) {
                                e.currentTarget.style.backgroundColor = '#5a67d8';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!isCurrentlyLearning) {
                                e.currentTarget.style.backgroundColor = '#667eea';
                              }
                            }}
                          >
                            {isCurrentlyLearning ? '📚 Learning' : '▶️ Start Learning'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Journey Map Section */}
        <div className="card mb-4">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
              🗺️ Your Personalized Learning Path
            </h2>
            <SkillJourneyMap 
              currentSkills={matchedSkills}
              targetSkills={getSkillsByTrade('electrician')}
              skillGaps={skillGaps}
              trade={'electrician'}
            />
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="card mb-4">
          <div style={{ padding: '2rem' }}>
            <h2 style={{ color: '#333', marginBottom: '2rem', textAlign: 'center' }}>
              🚀 Recommended Next Steps
            </h2>
            <div className="grid grid-3">
              {getNextSteps().map((step, index) => (
                <div key={index} style={{
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  borderRadius: '15px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
                  <h3 style={{ color: '#333', marginBottom: '1rem' }}>{step.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card p-4">
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button className="btn-primary">
              📄 Download My Report
            </button>
            <button className="btn-secondary">
              🎓 Find Training Programs
            </button>
            <button 
              className="btn-secondary"
              onClick={() => {
                resetApp();
                navigate('/');
              }}
            >
              🔄 Start Over
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            animation: 'slideInFromRight 0.3s ease-out'
          }}>
            {showToast}
          </div>
        )}

        {/* Video Learning Modal */}
        {showVideoInterface && currentLearningSkill && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              width: '95vw',
              height: '90vh',
              backgroundColor: 'white',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowVideoInterface(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  zIndex: 1001
                }}
              >
                ✕
              </button>
              <VideoLearningInterface
                skillName={currentLearningSkill}
                onComplete={handleCompleteSkill}
                videoId="kHbXbK7S188"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          }
          50% { 
            transform: scale(1.02); 
          }
          70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Results;