import { TradeSkills } from '../types';

export const skillsData: TradeSkills = {
  plumber: [
    { name: 'Pipe fitting', category: 'basic', importance: 9 },
    { name: 'Soldering', category: 'basic', importance: 8 },
    { name: 'Blueprint reading', category: 'intermediate', importance: 7 },
    { name: 'Water systems', category: 'intermediate', importance: 9 },
    { name: 'Drainage systems', category: 'intermediate', importance: 8 },
    { name: 'Tool proficiency', category: 'basic', importance: 8 },
    { name: 'Problem diagnosis', category: 'advanced', importance: 10 },
    { name: 'Valve installation', category: 'basic', importance: 7 },
    { name: 'Leak detection', category: 'intermediate', importance: 8 },
    { name: 'Fixture installation', category: 'basic', importance: 6 },
    { name: 'Gas line work', category: 'advanced', importance: 9 },
    { name: 'Backflow prevention', category: 'advanced', importance: 8 },
    { name: 'Hydro-jetting', category: 'intermediate', importance: 6 },
    { name: 'Pipe cutting and threading', category: 'basic', importance: 7 },
    { name: 'Water pressure regulation', category: 'intermediate', importance: 7 },
  ],
  electrician: [
    { name: 'Circuit design', category: 'advanced', importance: 9 },
    { name: 'Wiring installation', category: 'basic', importance: 9 },
    { name: 'Electrical code knowledge', category: 'intermediate', importance: 10 },
    { name: 'Safety protocols', category: 'basic', importance: 10 },
    { name: 'Troubleshooting', category: 'advanced', importance: 10 },
    { name: 'Panel installation', category: 'intermediate', importance: 8 },
    { name: 'Conduit installation', category: 'basic', importance: 7 },
    { name: 'Motor controls', category: 'advanced', importance: 8 },
    { name: 'Lighting systems', category: 'intermediate', importance: 7 },
    { name: 'Grounding systems', category: 'intermediate', importance: 9 },
    { name: 'Voltage testing', category: 'basic', importance: 8 },
    { name: 'Load calculations', category: 'advanced', importance: 8 },
    { name: 'Fire alarm systems', category: 'advanced', importance: 7 },
    { name: 'Blueprint interpretation', category: 'intermediate', importance: 8 },
    { name: 'Power distribution', category: 'advanced', importance: 9 },
  ],
  transferable: [
    { name: 'Problem-solving', category: 'intermediate', importance: 10 },
    { name: 'Attention to detail', category: 'basic', importance: 9 },
    { name: 'Physical stamina', category: 'basic', importance: 8 },
    { name: 'Customer service', category: 'basic', importance: 7 },
    { name: 'Time management', category: 'basic', importance: 8 },
    { name: 'Safety awareness', category: 'basic', importance: 10 },
    { name: 'Manual dexterity', category: 'basic', importance: 8 },
    { name: 'Mathematical skills', category: 'basic', importance: 7 },
    { name: 'Communication skills', category: 'basic', importance: 8 },
    { name: 'Project management', category: 'intermediate', importance: 7 },
    { name: 'Quality control', category: 'intermediate', importance: 8 },
    { name: 'Technical documentation', category: 'intermediate', importance: 6 },
  ],
};

export const getSkillsByTrade = (trade: string) => {
  switch (trade) {
    case 'plumber':
      return [...skillsData.plumber, ...skillsData.transferable];
    case 'electrician':
      return [...skillsData.electrician, ...skillsData.transferable];
    default:
      return [];
  }
};