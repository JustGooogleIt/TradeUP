import { VideoTranscript, TranscriptSegment, VideoResponse, VideoAssistant } from './VideoAssistant';

// Sample user profile that leads to circuit design skill gap
export const sampleUserProfile = {
  resume: {
    skills: [
      "JavaScript", "React", "Node.js", "Python", "Data Analysis",
      "Project Management", "Communication", "Problem Solving"
    ],
    experience: [
      {
        title: "Software Developer",
        company: "Tech Corp",
        duration: "2 years",
        responsibilities: ["Web development", "API integration", "Database management"]
      }
    ]
  },
  questionnaire: {
    careerGoals: "electrical technician",
    interests: ["electronics", "hands-on work", "troubleshooting"],
    currentLevel: "beginner",
    preferredLearning: "visual and practical",
    motivation: "Career change for better opportunities",
    handsOn: "love",
    physicalWork: "comfortable",
    problemSolving: "enjoy",
    availability: "full-time"
  }
};

// Mock transcript for circuit design video
export const circuitDesignTranscript: VideoTranscript = {
  title: "Circuit Design Fundamentals",
  duration: 600, // 10 minutes
  segments: [
    {
      startTime: 75, // 1:15
      endTime: 95,
      text: "Safety is paramount when working with electrical circuits. Always wear safety glasses, use insulated tools, and ensure the circuit is de-energized before making any connections. Keep a first aid kit nearby and never work alone on high-voltage systems.",
      keywords: ["safety", "glasses", "insulated", "tools", "de-energized", "first-aid"],
      topics: ["safety", "precautions", "equipment"]
    },
    {
      startTime: 125, // 2:05
      endTime: 145,
      text: "Ohm's law is the foundation of circuit analysis. It states that voltage equals current times resistance, or V = I × R. This fundamental relationship helps us understand how electricity flows through components and how to calculate values in our circuits.",
      keywords: ["ohm", "law", "voltage", "current", "resistance", "calculate"],
      topics: ["theory", "calculations", "fundamentals"]
    },
    {
      startTime: 225, // 3:45
      endTime: 245,
      text: "In parallel circuits, voltage remains constant across all branches, but current divides. To calculate the total current, we add the individual branch currents. The voltage across each parallel branch equals the source voltage.",
      keywords: ["parallel", "voltage", "constant", "current", "divides", "branches"],
      topics: ["circuit-types", "calculations", "parallel"]
    },
    {
      startTime: 320, // 5:20
      endTime: 340,
      text: "When analyzing parallel circuits, remember that each path provides an independent route for current flow. The total resistance is always less than the smallest individual resistor. Use the reciprocal formula: 1/Rt = 1/R1 + 1/R2 + 1/R3.",
      keywords: ["parallel", "resistance", "reciprocal", "formula", "current", "path"],
      topics: ["calculations", "resistance", "parallel"]
    },
    {
      startTime: 390, // 6:30
      endTime: 410,
      text: "Practical application of Ohm's law: If you have a 12-volt battery and a 4-ohm resistor, the current flowing through the circuit will be 3 amperes. This calculation is essential for component selection and circuit design.",
      keywords: ["practical", "ohm", "12-volt", "battery", "4-ohm", "resistor", "3-amperes"],
      topics: ["practical", "calculations", "examples"]
    },
    {
      startTime: 525, // 8:45
      endTime: 545,
      text: "Advanced Ohm's law applications include power calculations. Power equals voltage times current (P = V × I), or voltage squared divided by resistance (P = V²/R). Understanding power is crucial for component ratings and heat dissipation.",
      keywords: ["power", "calculations", "voltage", "current", "resistance", "heat", "dissipation"],
      topics: ["advanced", "power", "calculations"]
    }
  ]
};

// Pre-written demo questions with perfect responses
export const demoQuestions = [
  {
    question: "When the breaker is turned on, which wire does it feed first?",
    expectedResponse: {
      message: "Great question about breaker wiring! When a breaker is turned on, it feeds the hot (live) wire first. This is a fundamental concept in electrical safety and circuit operation.\n\nJumping to 1:12 where this is demonstrated exactly!",
      timestamps: [
        {
          timestamp: 72,
          relevanceScore: 0.98,
          description: "Breaker operation and wire feed sequence - shows exactly which wire gets power first",
          context: "Safety and circuit fundamentals"
        }
      ],
      suggestedQuestions: [
        "What happens if the breaker trips?",
        "How do you safely reset a breaker?"
      ],
      shouldAutoPlay: true,
      confidence: 0.95
    }
  },
  {
    question: "How do I calculate voltage in a parallel circuit?",
    expectedResponse: {
      message: "I found relevant information about your question:\n\n• [3:45] In parallel circuits, voltage remains constant across all branches, but current divides. To calculate...\n• [5:20] When analyzing parallel circuits, remember that each path provides an independent route for current...\n\nI recommend starting at 3:45 for the most comprehensive explanation.",
      timestamps: [
        {
          timestamp: 225,
          relevanceScore: 0.95,
          description: "In parallel circuits, voltage remains constant across all branches, but current divides. To calculate...",
          context: "Circuit design fundamentals"
        },
        {
          timestamp: 320,
          relevanceScore: 0.85,
          description: "When analyzing parallel circuits, remember that each path provides an independent route for current...",
          context: "Circuit design fundamentals"
        }
      ],
      suggestedQuestions: [
        "What tools are essential for circuit design?",
        "How do I calculate power consumption?"
      ],
      shouldAutoPlay: true,
      confidence: 0.9
    }
  },
  {
    question: "What safety equipment do I need?",
    expectedResponse: {
      message: "I found relevant information about your question:\n\n• [1:15] Safety is paramount when working with electrical circuits. Always wear safety glasses, use insulated...\n\nJumping to 1:15 where this topic is covered in detail.",
      timestamps: [
        {
          timestamp: 75,
          relevanceScore: 0.98,
          description: "Safety is paramount when working with electrical circuits. Always wear safety glasses, use insulated...",
          context: "Safety and precautions"
        }
      ],
      suggestedQuestions: [
        "What are the most common circuit design mistakes?",
        "What voltage levels require special precautions?"
      ],
      shouldAutoPlay: true,
      confidence: 0.95
    }
  },
  {
    question: "Can you explain Ohm's law?",
    expectedResponse: {
      message: "I found relevant information about your question:\n\n• [2:05] Ohm's law is the foundation of circuit analysis. It states that voltage equals current times...\n• [6:30] Practical application of Ohm's law: If you have a 12-volt battery and a 4-ohm resistor...\n• [8:45] Advanced Ohm's law applications include power calculations. Power equals voltage times current...\n\nI recommend starting at 2:05 for the most comprehensive explanation.",
      timestamps: [
        {
          timestamp: 125,
          relevanceScore: 0.95,
          description: "Ohm's law is the foundation of circuit analysis. It states that voltage equals current times...",
          context: "Theoretical concepts"
        },
        {
          timestamp: 390,
          relevanceScore: 0.85,
          description: "Practical application of Ohm's law: If you have a 12-volt battery and a 4-ohm resistor...",
          context: "Hands-on demonstration"
        },
        {
          timestamp: 525,
          relevanceScore: 0.80,
          description: "Advanced Ohm's law applications include power calculations. Power equals voltage times current...",
          context: "Mathematical calculations"
        }
      ],
      suggestedQuestions: [
        "How do I calculate power consumption?",
        "What's the best way to measure circuit values?"
      ],
      shouldAutoPlay: true,
      confidence: 0.92
    }
  }
];

export interface DemoState {
  currentQuestionIndex: number;
  isAutoDemo: boolean;
  typingSpeed: number;
  pauseBetweenQuestions: number;
  completedSkills: string[];
  currentLearningSkill: string | null;
  learningProgress: { [skillName: string]: number };
}

export class DemoController {
  private videoAssistant: VideoAssistant;
  private demoState: DemoState;
  private typingInterval: NodeJS.Timeout | null = null;
  private onMessageCallback?: (message: string, isUser: boolean) => void;
  private onTimestampCallback?: (timestamps: number[]) => void;
  private onStateChangeCallback?: (state: DemoState) => void;

  constructor() {
    this.videoAssistant = new VideoAssistant(circuitDesignTranscript);
    this.demoState = {
      currentQuestionIndex: 0,
      isAutoDemo: false,
      typingSpeed: 50, // ms per character
      pauseBetweenQuestions: 3000, // ms
      completedSkills: [],
      currentLearningSkill: null,
      learningProgress: {}
    };
  }

  public startAutoDemo(): void {
    this.demoState.isAutoDemo = true;
    this.demoState.currentQuestionIndex = 0;
    this.runNextDemoQuestion();
  }

  public stopAutoDemo(): void {
    this.demoState.isAutoDemo = false;
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
      this.typingInterval = null;
    }
  }

  public resetDemo(): void {
    this.demoState = {
      currentQuestionIndex: 0,
      isAutoDemo: false,
      typingSpeed: 50,
      pauseBetweenQuestions: 3000,
      completedSkills: [],
      currentLearningSkill: null,
      learningProgress: {}
    };
    
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.demoState);
    }
  }

  public setCallbacks(
    onMessage: (message: string, isUser: boolean) => void,
    onTimestamp: (timestamps: number[]) => void,
    onStateChange: (state: DemoState) => void
  ): void {
    this.onMessageCallback = onMessage;
    this.onTimestampCallback = onTimestamp;
    this.onStateChangeCallback = onStateChange;
  }

  public completeSkill(skillName: string): void {
    if (!this.demoState.completedSkills.includes(skillName)) {
      this.demoState.completedSkills.push(skillName);
      this.demoState.learningProgress[skillName] = 100;
    }
    this.demoState.currentLearningSkill = null;
    
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.demoState);
    }
  }

  public startLearning(skillName: string): void {
    this.demoState.currentLearningSkill = skillName;
    if (!this.demoState.learningProgress[skillName]) {
      this.demoState.learningProgress[skillName] = 0;
    }
    
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.demoState);
    }
  }

  public updateProgress(skillName: string, progress: number): void {
    this.demoState.learningProgress[skillName] = progress;
    
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.demoState);
    }
  }

  public getRecommendedSkills(): string[] {
    return [
      "Circuit Design",
      "Wiring Installation", 
      "Electrical Safety",
      "Motor Control Systems",
      "PLC Programming"
    ];
  }

  public getDemoState(): DemoState {
    return { ...this.demoState };
  }

  public processQuestion(question: string): VideoResponse {
    // Check if this is a demo question with pre-written response
    const demoQuestion = demoQuestions.find(dq => 
      dq.question.toLowerCase() === question.toLowerCase()
    );
    
    if (demoQuestion) {
      return demoQuestion.expectedResponse;
    }

    // Use the video assistant for other questions
    return this.videoAssistant.processUserQuestion(question);
  }

  private runNextDemoQuestion(): void {
    if (!this.demoState.isAutoDemo || this.demoState.currentQuestionIndex >= demoQuestions.length) {
      this.demoState.isAutoDemo = false;
      return;
    }

    const question = demoQuestions[this.demoState.currentQuestionIndex].question;
    this.typeMessage(question, true, () => {
      // Show AI thinking state
      setTimeout(() => {
        const response = this.processQuestion(question);
        
        if (this.onMessageCallback) {
          this.onMessageCallback(response.message, false);
        }
        
        if (this.onTimestampCallback && response.timestamps.length > 0) {
          this.onTimestampCallback(response.timestamps.map(ts => ts.timestamp));
        }

        // Move to next question after pause
        setTimeout(() => {
          this.demoState.currentQuestionIndex++;
          this.runNextDemoQuestion();
        }, this.demoState.pauseBetweenQuestions);
      }, 1000);
    });
  }

  private typeMessage(message: string, isUser: boolean, onComplete: () => void): void {
    let currentIndex = 0;
    let currentMessage = '';

    this.typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        currentMessage += message[currentIndex];
        currentIndex++;
        
        // Update the UI with current message (this would need to be implemented in the UI)
        // For now, we'll just call the callback when complete
      } else {
        clearInterval(this.typingInterval!);
        this.typingInterval = null;
        
        if (this.onMessageCallback) {
          this.onMessageCallback(message, isUser);
        }
        
        onComplete();
      }
    }, this.demoState.typingSpeed);
  }
}

// Export instances for immediate use
export const demoController = new DemoController();
export const videoAssistant = new VideoAssistant(circuitDesignTranscript);