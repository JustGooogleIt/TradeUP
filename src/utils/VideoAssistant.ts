export interface TranscriptSegment {
  startTime: number;
  endTime: number;
  text: string;
  keywords: string[];
  topics: string[];
}

export interface RankedTimestamp {
  timestamp: number;
  relevanceScore: number;
  description: string;
  context: string;
}

export interface VideoResponse {
  message: string;
  timestamps: RankedTimestamp[];
  suggestedQuestions?: string[];
  shouldAutoPlay: boolean;
  confidence: number;
}

export interface VideoTranscript {
  segments: TranscriptSegment[];
  duration: number;
  title: string;
}

export class VideoAssistant {
  private transcript: VideoTranscript;
  private watchedSegments: number[] = [];

  constructor(transcript: VideoTranscript) {
    this.transcript = transcript;
  }

  public processUserQuestion(question: string, watchedSegments: number[] = []): VideoResponse {
    this.watchedSegments = watchedSegments;

    if (this.isQuestionTooVague(question)) {
      return this.handleVagueQuestion(question);
    }

    const relevantSegments = this.findRelevantSegments(question);
    const rankedTimestamps = this.rankTimestamps(question, relevantSegments);

    if (rankedTimestamps.length === 0) {
      return this.handleNoRelevantContent(question);
    }

    const response = this.generateResponse(question, relevantSegments);
    const suggestedQuestions = this.suggestFollowUpQuestions(question, watchedSegments);

    return {
      message: response,
      timestamps: rankedTimestamps.slice(0, 3), // Top 3 most relevant
      suggestedQuestions,
      shouldAutoPlay: rankedTimestamps[0]?.relevanceScore > 0.7,
      confidence: this.calculateConfidence(question, rankedTimestamps)
    };
  }

  public generateResponse(question: string, relevantSegments: TranscriptSegment[]): string {
    if (relevantSegments.length === 0) {
      return "I couldn't find specific information about that in this video. Try asking about circuit basics, components, or safety procedures.";
    }

    const topSegments = relevantSegments.slice(0, 3);
    let response = "I found relevant information about your question:\n\n";

    topSegments.forEach((segment, index) => {
      const timestamp = this.formatTime(segment.startTime);
      const preview = segment.text.substring(0, 80) + "...";
      response += `• [${timestamp}] ${preview}\n`;
    });

    if (topSegments.length === 1) {
      response += `\nJumping to ${this.formatTime(topSegments[0].startTime)} where this topic is covered in detail.`;
    } else {
      response += `\nI recommend starting at ${this.formatTime(topSegments[0].startTime)} for the most comprehensive explanation.`;
    }

    return response;
  }

  public rankTimestamps(question: string, segments: TranscriptSegment[]): RankedTimestamp[] {
    const questionKeywords = this.extractKeywords(question.toLowerCase());
    
    return segments
      .map(segment => {
        const relevanceScore = this.calculateRelevanceScore(questionKeywords, segment);
        return {
          timestamp: segment.startTime,
          relevanceScore,
          description: this.generateDescription(segment, question),
          context: this.getContextDescription(segment)
        };
      })
      .filter(ranked => ranked.relevanceScore > 0.3)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  public suggestFollowUpQuestions(currentQuestion: string, watchedSegments: number[]): string[] {
    const questionType = this.categorizeQuestion(currentQuestion);
    const suggestions: string[] = [];

    switch (questionType) {
      case 'circuit-basics':
        suggestions.push(
          "What safety equipment do I need for circuit work?",
          "How do I calculate voltage in a parallel circuit?",
          "What tools are essential for circuit design?"
        );
        break;
      
      case 'components':
        suggestions.push(
          "How do resistors affect current flow?",
          "When should I use capacitors in my circuit?",
          "What's the difference between AC and DC components?"
        );
        break;

      case 'safety':
        suggestions.push(
          "What are the most common circuit design mistakes?",
          "How do I test if my circuit is safe?",
          "What voltage levels require special precautions?"
        );
        break;

      case 'calculations':
        suggestions.push(
          "Can you show me more examples of Ohm's law?",
          "How do I calculate power consumption?",
          "What's the best way to measure circuit values?"
        );
        break;

      default:
        suggestions.push(
          "What are the fundamental circuit design principles?",
          "How do I troubleshoot a circuit that isn't working?",
          "What should beginners know about circuit safety?"
        );
    }

    // Filter out suggestions for content already watched
    return suggestions.filter(() => Math.random() > 0.3).slice(0, 2);
  }

  private isQuestionTooVague(question: string): boolean {
    const vaguePhrases = ['what', 'how', 'tell me', 'explain', 'about'];
    const words = question.toLowerCase().split(' ');
    
    return words.length < 3 || 
           vaguePhrases.some(phrase => question.toLowerCase() === phrase) ||
           question.trim().length < 10;
  }

  private handleVagueQuestion(question: string): VideoResponse {
    return {
      message: "Could you be more specific? For example, you could ask:\n• \"How do series circuits work?\"\n• \"What safety equipment do I need?\"\n• \"How do I calculate voltage in a parallel circuit?\"",
      timestamps: [],
      suggestedQuestions: [
        "How do series circuits work?",
        "What safety equipment do I need?",
        "How do I calculate voltage in a parallel circuit?"
      ],
      shouldAutoPlay: false,
      confidence: 0.2
    };
  }

  private handleNoRelevantContent(question: string): VideoResponse {
    const relatedTopics = this.findRelatedTopics(question);
    
    return {
      message: `I couldn't find specific information about "${question}" in this video. However, this video covers these related topics:\n\n${relatedTopics.join('\n• ')}`,
      timestamps: [],
      suggestedQuestions: relatedTopics.slice(0, 3).map(topic => `Tell me about ${topic.toLowerCase()}`),
      shouldAutoPlay: false,
      confidence: 0.1
    };
  }

  private findRelevantSegments(question: string): TranscriptSegment[] {
    const questionKeywords = this.extractKeywords(question.toLowerCase());
    
    return this.transcript.segments.filter(segment => {
      const segmentText = segment.text.toLowerCase();
      const keywordMatches = questionKeywords.filter(keyword => 
        segmentText.includes(keyword) || 
        segment.keywords.some(k => k.toLowerCase().includes(keyword))
      );
      
      return keywordMatches.length > 0;
    });
  }

  private calculateRelevanceScore(questionKeywords: string[], segment: TranscriptSegment): number {
    let score = 0;
    const segmentText = segment.text.toLowerCase();
    
    // Keyword matching
    questionKeywords.forEach(keyword => {
      if (segmentText.includes(keyword)) {
        score += 0.3;
      }
      if (segment.keywords.some(k => k.toLowerCase().includes(keyword))) {
        score += 0.2;
      }
    });

    // Topic matching
    segment.topics.forEach(topic => {
      questionKeywords.forEach(keyword => {
        if (topic.toLowerCase().includes(keyword)) {
          score += 0.4;
        }
      });
    });

    // Boost score if not recently watched
    if (!this.watchedSegments.includes(segment.startTime)) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  private extractKeywords(text: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'what', 'where', 'when', 'why', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will']);
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
      .filter((word, index, arr) => arr.indexOf(word) === index);
  }

  private generateDescription(segment: TranscriptSegment, question: string): string {
    const preview = segment.text.substring(0, 100);
    const questionKeywords = this.extractKeywords(question.toLowerCase());
    
    // Try to find the most relevant part of the segment
    for (const keyword of questionKeywords) {
      const index = segment.text.toLowerCase().indexOf(keyword);
      if (index !== -1) {
        const start = Math.max(0, index - 50);
        const end = Math.min(segment.text.length, index + 50);
        return segment.text.substring(start, end) + "...";
      }
    }
    
    return preview + "...";
  }

  private getContextDescription(segment: TranscriptSegment): string {
    const contextMap: { [key: string]: string } = {
      'safety': 'Safety and precautions',
      'component': 'Circuit components',
      'calculation': 'Mathematical calculations',
      'practical': 'Hands-on demonstration',
      'theory': 'Theoretical concepts',
      'troubleshooting': 'Problem solving'
    };

    for (const [key, description] of Object.entries(contextMap)) {
      if (segment.topics.some(topic => topic.toLowerCase().includes(key))) {
        return description;
      }
    }

    return 'Circuit design fundamentals';
  }

  private categorizeQuestion(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('safety') || lowerQuestion.includes('danger') || lowerQuestion.includes('precaution')) {
      return 'safety';
    }
    if (lowerQuestion.includes('resistor') || lowerQuestion.includes('capacitor') || lowerQuestion.includes('component')) {
      return 'components';
    }
    if (lowerQuestion.includes('calculate') || lowerQuestion.includes('formula') || lowerQuestion.includes('ohm')) {
      return 'calculations';
    }
    if (lowerQuestion.includes('circuit') || lowerQuestion.includes('series') || lowerQuestion.includes('parallel')) {
      return 'circuit-basics';
    }
    
    return 'general';
  }

  private findRelatedTopics(question: string): string[] {
    const allTopics = new Set<string>();
    this.transcript.segments.forEach(segment => {
      segment.topics.forEach(topic => allTopics.add(topic));
    });
    
    return Array.from(allTopics).slice(0, 5);
  }

  private calculateConfidence(question: string, rankedTimestamps: RankedTimestamp[]): number {
    if (rankedTimestamps.length === 0) return 0.1;
    
    const avgRelevance = rankedTimestamps.reduce((sum, ts) => sum + ts.relevanceScore, 0) / rankedTimestamps.length;
    const questionSpecificity = this.extractKeywords(question).length * 0.1;
    
    return Math.min(avgRelevance + questionSpecificity, 1.0);
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  public updateWatchedSegments(watchedSegments: number[]): void {
    this.watchedSegments = watchedSegments;
  }
}