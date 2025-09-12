export type Trade = 'plumber' | 'electrician';

export interface QuestionAnswers {
  motivation: string;
  handsOn: string;
  physicalWork: string;
  problemSolving: string;
  availability: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
}

export interface Skill {
  name: string;
  category: 'basic' | 'intermediate' | 'advanced';
  importance: number; // 1-10
}

export interface TradeSkills {
  plumber: Skill[];
  electrician: Skill[];
  transferable: Skill[];
}

export interface SkillNode {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  prerequisites: string[];
}

export interface AppState {
  selectedTrade: Trade | null;
  resumeFile: File | null;
  resumeSkills: string[];
  questionAnswers: QuestionAnswers;
  compatibilityScore: number;
  skillGaps: SkillGap[];
  isAnalyzing: boolean;
}

export interface AppContextType extends AppState {
  setSelectedTrade: (trade: Trade | null) => void;
  setResumeFile: (file: File | null) => void;
  setResumeSkills: (skills: string[]) => void;
  updateQuestionAnswer: (key: keyof QuestionAnswers, value: string) => void;
  setCompatibilityScore: (score: number) => void;
  setSkillGaps: (gaps: SkillGap[]) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  resetApp: () => void;
}

export interface CompatibilityResult {
  score: number;
  gaps: SkillGap[];
}