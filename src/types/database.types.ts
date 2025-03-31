
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          native_language: string
          learning_language: string
          proficiency_level: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          native_language: string
          learning_language: string
          proficiency_level: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          native_language?: string
          learning_language?: string
          proficiency_level?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          language: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender: string
          text: string
          audio_url: string | null
          timestamp: string
          pronunciation_feedback: Json | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender: string
          text: string
          audio_url?: string | null
          timestamp?: string
          pronunciation_feedback?: Json | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender?: string
          text?: string
          audio_url?: string | null
          timestamp?: string
          pronunciation_feedback?: Json | null
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          description: string
          language: string
          level: string
          duration: number
          type: string
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          language: string
          level: string
          duration: number
          type: string
          content: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          language?: string
          level?: string
          duration?: number
          type?: string
          content?: Json
          created_at?: string
        }
      }
      user_lessons: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          progress: number
          completed: boolean
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          progress: number
          completed: boolean
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          progress?: number
          completed?: boolean
          started_at?: string
          completed_at?: string | null
        }
      }
      lesson_performances: {
        Row: {
          id: string
          user_lesson_id: string
          date: string
          score: number
          duration: number
          metrics: Json
        }
        Insert: {
          id?: string
          user_lesson_id: string
          date?: string
          score: number
          duration: number
          metrics: Json
        }
        Update: {
          id?: string
          user_lesson_id?: string
          date?: string
          score?: number
          duration?: number
          metrics?: Json
        }
      }
      performance_metrics: {
        Row: {
          id: string
          user_id: string
          date: string
          category: string
          score: number
          details: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          category: string
          score: number
          details?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          category?: string
          score?: number
          details?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
