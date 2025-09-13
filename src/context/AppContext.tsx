import React, { createContext, useContext, useReducer, ReactNode, useMemo, useCallback } from 'react';
import { AppState, AppContextType, Trade, QuestionAnswers, SkillGap } from '../types';

const initialState: AppState = {
  selectedTrade: null,
  resumeFile: null,
  resumeSkills: [],
  questionAnswers: {
    motivation: '',
    handsOn: '',
    physicalWork: '',
    problemSolving: '',
    availability: '',
  },
  compatibilityScore: 0,
  skillGaps: [],
  isAnalyzing: false,
};

type Action =
  | { type: 'SET_SELECTED_TRADE'; payload: Trade | null }
  | { type: 'SET_RESUME_FILE'; payload: File | null }
  | { type: 'SET_RESUME_SKILLS'; payload: string[] }
  | { type: 'UPDATE_QUESTION_ANSWER'; payload: { key: keyof QuestionAnswers; value: string } }
  | { type: 'SET_COMPATIBILITY_SCORE'; payload: number }
  | { type: 'SET_SKILL_GAPS'; payload: SkillGap[] }
  | { type: 'SET_IS_ANALYZING'; payload: boolean }
  | { type: 'RESET_APP' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SELECTED_TRADE':
      return { ...state, selectedTrade: action.payload };
    case 'SET_RESUME_FILE':
      return { ...state, resumeFile: action.payload };
    case 'SET_RESUME_SKILLS':
      return { ...state, resumeSkills: action.payload };
    case 'UPDATE_QUESTION_ANSWER':
      return {
        ...state,
        questionAnswers: {
          ...state.questionAnswers,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_COMPATIBILITY_SCORE':
      return { ...state, compatibilityScore: action.payload };
    case 'SET_SKILL_GAPS':
      return { ...state, skillGaps: action.payload };
    case 'SET_IS_ANALYZING':
      return { ...state, isAnalyzing: action.payload };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setSelectedTrade = useCallback((trade: Trade | null) => {
    dispatch({ type: 'SET_SELECTED_TRADE', payload: trade });
  }, []);

  const setResumeFile = useCallback((file: File | null) => {
    dispatch({ type: 'SET_RESUME_FILE', payload: file });
  }, []);

  const setResumeSkills = useCallback((skills: string[]) => {
    dispatch({ type: 'SET_RESUME_SKILLS', payload: skills });
  }, []);

  const updateQuestionAnswer = useCallback((key: keyof QuestionAnswers, value: string) => {
    dispatch({ type: 'UPDATE_QUESTION_ANSWER', payload: { key, value } });
  }, []);

  const setCompatibilityScore = useCallback((score: number) => {
    dispatch({ type: 'SET_COMPATIBILITY_SCORE', payload: score });
  }, []);

  const setSkillGaps = useCallback((gaps: SkillGap[]) => {
    dispatch({ type: 'SET_SKILL_GAPS', payload: gaps });
  }, []);

  const setIsAnalyzing = useCallback((analyzing: boolean) => {
    dispatch({ type: 'SET_IS_ANALYZING', payload: analyzing });
  }, []);

  const resetApp = useCallback(() => {
    dispatch({ type: 'RESET_APP' });
  }, []);

  const contextValue: AppContextType = useMemo(() => ({
    ...state,
    setSelectedTrade,
    setResumeFile,
    setResumeSkills,
    updateQuestionAnswer,
    setCompatibilityScore,
    setSkillGaps,
    setIsAnalyzing,
    resetApp,
  }), [state, setSelectedTrade, setResumeFile, setResumeSkills, updateQuestionAnswer, setCompatibilityScore, setSkillGaps, setIsAnalyzing, resetApp]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}