import React, { useEffect, useRef, useState } from 'react';
import { Skill, SkillGap, Trade } from '../types';

interface SkillJourneyMapProps {
  currentSkills: string[];
  targetSkills: Skill[];
  skillGaps: SkillGap[];
  trade: Trade;
}

interface SkillNode {
  id: string;
  name: string;
  status: 'complete' | 'partial' | 'todo' | 'focus';
  category: 'basic' | 'intermediate' | 'advanced';
  x: number;
  y: number;
  estimatedHours?: number;
}

const SkillJourneyMap: React.FC<SkillJourneyMapProps> = ({
  currentSkills,
  targetSkills,
  skillGaps,
  trade
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    // Create nodes based on skills
    const skillNodes: SkillNode[] = [];
    const width = 800;
    const height = 500;
    
    // Group skills by category
    const basicSkills = targetSkills.filter(s => s.category === 'basic');
    const intermediateSkills = targetSkills.filter(s => s.category === 'intermediate');
    const advancedSkills = targetSkills.filter(s => s.category === 'advanced');

    // Position nodes in three columns (basic, intermediate, advanced)
    const createNodesForCategory = (skills: Skill[], x: number, categoryName: 'basic' | 'intermediate' | 'advanced') => {
      skills.forEach((skill, index) => {
        const hasSkill = currentSkills.some(cs => 
          cs.toLowerCase().includes(skill.name.toLowerCase()) ||
          skill.name.toLowerCase().includes(cs.toLowerCase())
        );
        
        const hasGap = skillGaps.find(gap => gap.skill === skill.name);
        
        let status: SkillNode['status'] = 'complete';
        if (hasSkill) {
          status = hasGap ? 'partial' : 'complete';
        } else {
          status = hasGap && skillGaps.indexOf(hasGap) < 3 ? 'focus' : 'todo';
        }

        skillNodes.push({
          id: `${categoryName}-${index}`,
          name: skill.name,
          status,
          category: categoryName,
          x: x,
          y: 80 + (index * (height - 160) / Math.max(skills.length - 1, 1)),
          estimatedHours: hasGap ? (hasGap.requiredLevel - hasGap.currentLevel) * 20 : 0
        });
      });
    };

    createNodesForCategory(basicSkills.slice(0, 5), 150, 'basic');
    createNodesForCategory(intermediateSkills.slice(0, 5), 400, 'intermediate');
    createNodesForCategory(advancedSkills.slice(0, 5), 650, 'advanced');

    setNodes(skillNodes);

    // Animate drawing
    const animateDrawing = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setAnimationProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 50);
    };

    setTimeout(animateDrawing, 500);
  }, [currentSkills, targetSkills, skillGaps]);

  const getNodeColor = (status: SkillNode['status']) => {
    switch (status) {
      case 'complete': return '#4CAF50';
      case 'partial': return '#FF9800';
      case 'focus': return '#2196F3';
      case 'todo': return '#f44336';
      default: return '#grey';
    }
  };

  const drawConnections = () => {
    const paths = [];
    
    // Connect basic to intermediate
    for (let i = 0; i < Math.min(5, nodes.filter(n => n.category === 'basic').length); i++) {
      for (let j = 0; j < Math.min(5, nodes.filter(n => n.category === 'intermediate').length); j++) {
        const basicNode = nodes.find(n => n.category === 'basic' && n.id.endsWith(`-${i}`));
        const intNode = nodes.find(n => n.category === 'intermediate' && n.id.endsWith(`-${j}`));
        
        if (basicNode && intNode) {
          const d = `M ${basicNode.x + 30} ${basicNode.y} Q ${(basicNode.x + intNode.x) / 2} ${(basicNode.y + intNode.y) / 2 - 50} ${intNode.x - 30} ${intNode.y}`;
          paths.push(
            <path
              key={`basic-int-${i}-${j}`}
              d={d}
              stroke="#e0e0e0"
              strokeWidth="2"
              fill="none"
              opacity={0.3}
              strokeDasharray="5,5"
            />
          );
        }
      }
    }

    // Connect intermediate to advanced
    for (let i = 0; i < Math.min(5, nodes.filter(n => n.category === 'intermediate').length); i++) {
      for (let j = 0; j < Math.min(5, nodes.filter(n => n.category === 'advanced').length); j++) {
        const intNode = nodes.find(n => n.category === 'intermediate' && n.id.endsWith(`-${i}`));
        const advNode = nodes.find(n => n.category === 'advanced' && n.id.endsWith(`-${j}`));
        
        if (intNode && advNode) {
          const d = `M ${intNode.x + 30} ${intNode.y} Q ${(intNode.x + advNode.x) / 2} ${(intNode.y + advNode.y) / 2 - 50} ${advNode.x - 30} ${advNode.y}`;
          paths.push(
            <path
              key={`int-adv-${i}-${j}`}
              d={d}
              stroke="#e0e0e0"
              strokeWidth="2"
              fill="none"
              opacity={0.3}
              strokeDasharray="5,5"
            />
          );
        }
      }
    }

    return paths;
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="500"
        viewBox="0 0 800 500"
        style={{ border: '1px solid #e0e0e0', borderRadius: '15px', backgroundColor: '#fafafa' }}
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f0f4ff" />
            <stop offset="50%" stopColor="#fff7ed" />
            <stop offset="100%" stopColor="#f0f9ff" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#bgGradient)" />

        {/* Category headers */}
        <text x="150" y="40" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#667eea">
          Basic Skills
        </text>
        <text x="400" y="40" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#667eea">
          Intermediate Skills
        </text>
        <text x="650" y="40" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#667eea">
          Advanced Skills
        </text>

        {/* Connection paths */}
        {animationProgress > 30 && drawConnections()}

        {/* Skill nodes */}
        {nodes.map((node, index) => {
          const shouldShow = (index / nodes.length) * 100 <= animationProgress;
          
          return shouldShow ? (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                fill={getNodeColor(node.status)}
                stroke="white"
                strokeWidth="3"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  filter: selectedNode?.id === node.id ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
                }}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={(e) => {
                  e.currentTarget.setAttribute('r', '28');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.setAttribute('r', '25');
                }}
              />
              
              {/* Node icon based on status */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontSize="14"
                fill="white"
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {node.status === 'complete' ? '✓' : 
                 node.status === 'focus' ? '★' :
                 node.status === 'partial' ? '~' : '○'}
              </text>
              
              {/* Skill name */}
              <text
                x={node.x}
                y={node.y + 45}
                textAnchor="middle"
                fontSize="10"
                fill="#333"
                fontWeight="500"
                style={{ pointerEvents: 'none' }}
              >
                {node.name.length > 15 ? `${node.name.substring(0, 15)}...` : node.name}
              </text>
            </g>
          ) : null;
        })}

        {/* Legend */}
        <g transform="translate(50, 450)">
          <circle cx="15" cy="0" r="8" fill="#4CAF50" />
          <text x="30" y="4" fontSize="12" fill="#666">Mastered</text>
          
          <circle cx="100" cy="0" r="8" fill="#FF9800" />
          <text x="115" y="4" fontSize="12" fill="#666">Partial</text>
          
          <circle cx="180" cy="0" r="8" fill="#2196F3" />
          <text x="195" y="4" fontSize="12" fill="#666">Focus Next</text>
          
          <circle cx="280" cy="0" r="8" fill="#f44336" />
          <text x="295" y="4" fontSize="12" fill="#666">To Learn</text>
        </g>

        {/* Progress indicator */}
        <text 
          x="700" 
          y="470" 
          fontSize="14" 
          fill="#667eea" 
          fontWeight="bold"
          textAnchor="end"
        >
          {Math.round((nodes.filter(n => n.status === 'complete').length / nodes.length) * 100)}% Complete
        </text>
      </svg>

      {/* Skill details tooltip */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: '200px',
          zIndex: 10
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{selectedNode.name}</h4>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
            Category: {selectedNode.category}
          </p>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
            Status: {selectedNode.status === 'complete' ? 'Mastered' : 
                     selectedNode.status === 'focus' ? 'Priority Focus' :
                     selectedNode.status === 'partial' ? 'Needs Improvement' : 'To Learn'}
          </p>
          {selectedNode.estimatedHours && selectedNode.estimatedHours > 0 && (
            <p style={{ margin: '0', color: '#667eea', fontSize: '0.9rem', fontWeight: '500' }}>
              Est. {selectedNode.estimatedHours} hours to master
            </p>
          )}
          <button 
            onClick={() => setSelectedNode(null)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Estimated journey timeline */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        padding: '1rem',
        background: '#f0f4ff',
        borderRadius: '10px',
        border: '1px solid #e0e6ff'
      }}>
        <p style={{ 
          margin: '0', 
          color: '#667eea', 
          fontSize: '1.1rem', 
          fontWeight: '600' 
        }}>
          📅 Estimated Journey: {Math.ceil(skillGaps.reduce((total, gap) => 
            total + (gap.requiredLevel - gap.currentLevel) * 20, 0) / 160)} - {
            Math.ceil(skillGaps.reduce((total, gap) => 
              total + (gap.requiredLevel - gap.currentLevel) * 20, 0) / 80)} months
        </p>
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          color: '#666', 
          fontSize: '0.9rem' 
        }}>
          Based on 20 hours/week dedicated learning
        </p>
      </div>
    </div>
  );
};

export default SkillJourneyMap;