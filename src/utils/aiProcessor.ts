import { QuestionAnswers, SkillGap, Skill, SkillNode, CompatibilityResult } from '../types';
import { getSkillsByTrade } from './skillsData';

export async function extractSkillsFromResume(file: File): Promise<string[]> {
  // Mock AI processing with realistic delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock extracted skills based on common resume content
      const mockSkills = [
        'Problem-solving',
        'Attention to detail',
        'Customer service',
        'Time management',
        'Communication skills',
        'Project management',
        'Quality control',
        'Mathematical skills',
        'Technical documentation',
        'Safety awareness',
        'Manual dexterity',
      ];
      
      // Randomize to make it feel more realistic
      const shuffled = mockSkills.sort(() => Math.random() - 0.5);
      resolve(shuffled.slice(0, Math.floor(Math.random() * 5) + 6)); // 6-10 skills
    }, 2000 + Math.random() * 1000); // 2-3 second delay
  });
}

export function analyzeCompatibility(
  resumeSkills: string[],
  targetTrade: string,
  answers: QuestionAnswers
): CompatibilityResult {
  const requiredSkills = getSkillsByTrade(targetTrade);
  const skillMatch = calculateSkillMatch(resumeSkills, requiredSkills);
  
  // Factor in questionnaire answers
  const motivationBonus = getMotivationScore(answers.motivation) * 0.15;
  const handsOnBonus = getHandsOnScore(answers.handsOn) * 0.20;
  const physicalBonus = getPhysicalWorkScore(answers.physicalWork) * 0.10;
  const problemSolvingBonus = getProblemSolvingScore(answers.problemSolving) * 0.15;
  const availabilityBonus = getAvailabilityScore(answers.availability) * 0.10;
  
  const totalBonus = motivationBonus + handsOnBonus + physicalBonus + problemSolvingBonus + availabilityBonus;
  const finalScore = Math.min(Math.round((skillMatch + totalBonus) * 100), 100);
  
  const gaps = calculateSkillGaps(resumeSkills, requiredSkills);
  
  return {
    score: finalScore,
    gaps,
  };
}

export function calculateSkillMatch(userSkills: string[], requiredSkills: Skill[]): number {
  let matchScore = 0;
  let totalWeight = 0;
  
  requiredSkills.forEach((required) => {
    const hasSkill = userSkills.some(skill => 
      skill.toLowerCase().includes(required.name.toLowerCase()) ||
      required.name.toLowerCase().includes(skill.toLowerCase())
    );
    
    if (hasSkill) {
      matchScore += required.importance;
    }
    totalWeight += required.importance;
  });
  
  return totalWeight > 0 ? matchScore / totalWeight : 0;
}

function calculateSkillGaps(userSkills: string[], requiredSkills: Skill[]): SkillGap[] {
  return requiredSkills.map((required) => {
    const hasSkill = userSkills.some(skill => 
      skill.toLowerCase().includes(required.name.toLowerCase()) ||
      required.name.toLowerCase().includes(skill.toLowerCase())
    );
    
    const currentLevel = hasSkill ? Math.floor(Math.random() * 4) + 3 : 0; // 3-6 if has skill, 0 if not
    const requiredLevel = required.category === 'basic' ? 6 : 
                         required.category === 'intermediate' ? 8 : 10;
    
    return {
      skill: required.name,
      currentLevel,
      requiredLevel,
    };
  }).filter(gap => gap.currentLevel < gap.requiredLevel);
}

export function generateSkillJourney(gaps: SkillGap[]): SkillNode[] {
  return gaps.map((gap) => {
    const skillDifference = gap.requiredLevel - gap.currentLevel;
    const estimatedHours = skillDifference * 20; // 20 hours per skill level
    
    const priority: 'high' | 'medium' | 'low' = gap.requiredLevel >= 9 ? 'high' : 
                    gap.requiredLevel >= 7 ? 'medium' : 'low';
    
    // Mock prerequisites based on skill names
    const prerequisites = getSkillPrerequisites(gap.skill);
    
    return {
      skill: gap.skill,
      currentLevel: gap.currentLevel,
      targetLevel: gap.requiredLevel,
      priority,
      estimatedHours,
      prerequisites,
    };
  }).sort((a, b) => {
    // Sort by priority and prerequisites
    const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) return bPriority - aPriority;
    return a.prerequisites.length - b.prerequisites.length; // Fewer prerequisites first
  });
}

function getMotivationScore(motivation: string): number {
  const keywords = ['passionate', 'career change', 'stable', 'growth', 'opportunity'];
  return keywords.some(keyword => 
    motivation.toLowerCase().includes(keyword)
  ) ? 0.8 : 0.4;
}

function getHandsOnScore(handsOn: string): number {
  const keywords = ['fix', 'repair', 'build', 'diy', 'tools', 'hands-on', 'construction', 'mechanical'];
  const matches = keywords.filter(keyword => 
    handsOn.toLowerCase().includes(keyword)
  ).length;
  return Math.min(matches * 0.2, 1);
}

function getPhysicalWorkScore(physicalWork: string): number {
  const rating = parseInt(physicalWork.split(' ')[0]) || 5; // Extract number from "7 - Very comfortable"
  return rating / 10;
}

function getProblemSolvingScore(problemSolving: string): number {
  const keywords = ['analyze', 'solve', 'debug', 'troubleshoot', 'systematic', 'logical', 'step'];
  const matches = keywords.filter(keyword => 
    problemSolving.toLowerCase().includes(keyword)
  ).length;
  return Math.min(matches * 0.15, 1);
}

function getAvailabilityScore(availability: string): number {
  if (availability.toLowerCase().includes('full-time') || 
      availability.toLowerCase().includes('flexible')) {
    return 1;
  }
  if (availability.toLowerCase().includes('part-time')) {
    return 0.7;
  }
  return 0.5;
}

function getSkillPrerequisites(skillName: string): string[] {
  const prerequisiteMap: Record<string, string[]> = {
    'Circuit design': ['Electrical code knowledge', 'Wiring installation'],
    'Gas line work': ['Pipe fitting', 'Safety protocols'],
    'Motor controls': ['Circuit design', 'Electrical code knowledge'],
    'Load calculations': ['Mathematical skills', 'Circuit design'],
    'Backflow prevention': ['Water systems', 'Valve installation'],
    'Problem diagnosis': ['Troubleshooting', 'Tool proficiency'],
  };
  
  return prerequisiteMap[skillName] || [];
}