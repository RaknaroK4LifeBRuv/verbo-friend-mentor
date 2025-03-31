
// User types
export interface User {
  id: string;
  email: string;
  name: string;
  nativeLanguage: string;
  learningLanguage: string;
  proficiencyLevel: string; // beginner, intermediate, advanced
  avatarUrl?: string;
  createdAt: string;
}

// Conversation types
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "user" | "ai";
  text: string;
  audioUrl?: string;
  timestamp: string;
  pronunciation?: PronunciationFeedback;
}

export interface PronunciationFeedback {
  score: number;
  feedback?: string;
  detailedFeedback?: {
    accuracy: number;
    fluency: number;
    intonation: number;
  };
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string; // beginner, intermediate, advanced
  duration: number; // in minutes
  type: "conversation" | "grammar" | "vocabulary" | "pronunciation";
  content: any; // lesson-specific content
  createdAt: string;
}

export interface UserLesson {
  id: string;
  userId: string;
  lessonId: string;
  progress: number; // 0-100
  completed: boolean;
  startedAt: string;
  completedAt?: string;
  performances: LessonPerformance[];
}

export interface LessonPerformance {
  id: string;
  userLessonId: string;
  date: string;
  score: number;
  duration: number; // time spent in minutes
  metrics: {
    accuracy?: number;
    fluency?: number;
    vocabulary?: number;
    grammar?: number;
  };
}

// Performance tracking
export interface PerformanceMetric {
  id: string;
  userId: string;
  date: string;
  category: "pronunciation" | "vocabulary" | "grammar" | "conversation";
  score: number;
  details?: any;
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
