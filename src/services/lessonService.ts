
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Lesson, UserLesson, LessonPerformance } from '@/types/backend';
import { v4 as uuidv4 } from 'uuid';

export const lessonService = {
  // Get all available lessons
  async getLessons(language?: string, level?: string): Promise<Lesson[]> {
    try {
      let query = supabase.from('lessons').select('*');
      
      if (language) {
        query = query.eq('language', language);
      }
      
      if (level) {
        query = query.eq('level', level);
      }
      
      const { data, error } = await query.order('created_at', { ascending: true });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Check if we got any lessons
      if (!data || data.length === 0) {
        // Create initial lessons if none exist
        return await this.createInitialLessons();
      }
      
      // Convert from snake_case to camelCase for frontend use
      const lessons: Lesson[] = data.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        language: lesson.language,
        level: lesson.level,
        duration: lesson.duration,
        type: lesson.type,
        content: lesson.content,
        createdAt: lesson.created_at,
      }));
      
      return lessons;
    } catch (error: any) {
      console.error('Get lessons error:', error);
      throw error;
    }
  },
  
  // Create initial lessons if none exist
  async createInitialLessons(): Promise<Lesson[]> {
    try {
      const initialLessons = [
        {
          id: uuidv4(),
          title: 'Greetings and Introductions',
          description: 'Learn how to greet people and introduce yourself',
          language: 'Spanish',
          level: 'Beginner',
          duration: 15,
          type: 'conversation' as const,
          content: {
            sections: [
              {
                title: 'Basic Greetings',
                content: `<h3>Common Spanish Greetings</h3>
                <ul>
                  <li><strong>Hola</strong> - Hello</li>
                  <li><strong>Buenos días</strong> - Good morning</li>
                  <li><strong>Buenas tardes</strong> - Good afternoon</li>
                  <li><strong>Buenas noches</strong> - Good evening</li>
                </ul>
                <p>Practice saying these phrases out loud to improve your pronunciation.</p>`
              },
              {
                title: 'Introducing Yourself',
                content: `<h3>Introducing Yourself in Spanish</h3>
                <ul>
                  <li><strong>Me llamo...</strong> - My name is...</li>
                  <li><strong>Soy de...</strong> - I am from...</li>
                  <li><strong>Mucho gusto</strong> - Nice to meet you</li>
                </ul>
                <p>Try creating a full introduction using these phrases.</p>`
              }
            ]
          },
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'Numbers and Counting',
          description: 'Learn to count and use numbers in conversation',
          language: 'Spanish',
          level: 'Beginner',
          duration: 10,
          type: 'vocabulary' as const,
          content: {
            sections: [
              {
                title: 'Numbers 1-10',
                content: `<h3>Numbers in Spanish (1-10)</h3>
                <ul>
                  <li><strong>Uno</strong> - One</li>
                  <li><strong>Dos</strong> - Two</li>
                  <li><strong>Tres</strong> - Three</li>
                  <li><strong>Cuatro</strong> - Four</li>
                  <li><strong>Cinco</strong> - Five</li>
                  <li><strong>Seis</strong> - Six</li>
                  <li><strong>Siete</strong> - Seven</li>
                  <li><strong>Ocho</strong> - Eight</li>
                  <li><strong>Nueve</strong> - Nine</li>
                  <li><strong>Diez</strong> - Ten</li>
                </ul>
                <p>Practice counting from 1 to 10 in Spanish.</p>`
              },
              {
                title: 'Using Numbers',
                content: `<h3>Using Numbers in Conversation</h3>
                <p>Numbers are essential for many everyday conversations:</p>
                <ul>
                  <li>Telling time: <strong>Son las tres</strong> (It's three o'clock)</li>
                  <li>Shopping: <strong>Quiero dos manzanas</strong> (I want two apples)</li>
                  <li>Phone numbers: <strong>Mi número es...</strong> (My number is...)</li>
                </ul>
                <p>Try creating sentences using the numbers you've learned.</p>`
              }
            ]
          },
          created_at: new Date().toISOString()
        },
        {
          id: uuidv4(),
          title: 'Common Verbs',
          description: 'Learn essential verbs and basic conjugation',
          language: 'Spanish',
          level: 'Beginner',
          duration: 20,
          type: 'grammar' as const,
          content: {
            sections: [
              {
                title: 'Regular -AR Verbs',
                content: `<h3>Common -AR Verbs</h3>
                <ul>
                  <li><strong>Hablar</strong> - To speak</li>
                  <li><strong>Caminar</strong> - To walk</li>
                  <li><strong>Trabajar</strong> - To work</li>
                  <li><strong>Estudiar</strong> - To study</li>
                </ul>
                <h4>Present Tense Conjugation</h4>
                <p>For the verb <strong>hablar</strong>:</p>
                <ul>
                  <li>yo <strong>hablo</strong> - I speak</li>
                  <li>tú <strong>hablas</strong> - You speak</li>
                  <li>él/ella <strong>habla</strong> - He/she speaks</li>
                  <li>nosotros <strong>hablamos</strong> - We speak</li>
                  <li>ustedes <strong>hablan</strong> - You all speak</li>
                  <li>ellos/ellas <strong>hablan</strong> - They speak</li>
                </ul>`
              }
            ]
          },
          created_at: new Date().toISOString()
        }
      ];

      // Insert lessons into the database
      for (const lesson of initialLessons) {
        const { error } = await supabase
          .from('lessons')
          .insert([lesson]);
        
        if (error) {
          throw new Error(handleSupabaseError(error));
        }
      }

      // Return the created lessons
      return initialLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        language: lesson.language,
        level: lesson.level,
        duration: lesson.duration,
        type: lesson.type,
        content: lesson.content,
        createdAt: lesson.created_at,
      }));
    } catch (error: any) {
      console.error('Create initial lessons error:', error);
      throw error;
    }
  },
  
  // Get a specific lesson by ID
  async getLesson(lessonId: string): Promise<Lesson> {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (error || !data) {
        throw new Error(error ? handleSupabaseError(error) : 'Lesson not found');
      }
      
      // Convert from snake_case to camelCase
      const lesson: Lesson = {
        id: data.id,
        title: data.title,
        description: data.description,
        language: data.language,
        level: data.level,
        duration: data.duration,
        type: data.type,
        content: data.content,
        createdAt: data.created_at,
      };
      
      return lesson;
    } catch (error: any) {
      console.error('Get lesson error:', error);
      throw error;
    }
  },
  
  // Get lessons started by the user
  async getUserLessons(): Promise<UserLesson[]> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const { data, error } = await supabase
        .from('user_lessons')
        .select(`
          *,
          lessons(*)
        `)
        .eq('user_id', authData.user.id);
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Convert from snake_case to camelCase
      const userLessons: UserLesson[] = await Promise.all(data.map(async (userLesson) => {
        // Get performance records for this user lesson
        const { data: performanceData, error: perfError } = await supabase
          .from('lesson_performances')
          .select('*')
          .eq('user_lesson_id', userLesson.id);
        
        if (perfError) {
          throw new Error(handleSupabaseError(perfError));
        }
        
        // Convert performance records
        const performances: LessonPerformance[] = performanceData.map(perf => ({
          id: perf.id,
          userLessonId: perf.user_lesson_id,
          date: perf.date,
          score: perf.score,
          duration: perf.duration,
          metrics: perf.metrics,
        }));
        
        return {
          id: userLesson.id,
          userId: userLesson.user_id,
          lessonId: userLesson.lesson_id,
          progress: userLesson.progress,
          completed: userLesson.completed,
          startedAt: userLesson.started_at,
          completedAt: userLesson.completed_at || undefined,
          performances,
        };
      }));
      
      return userLessons;
    } catch (error: any) {
      console.error('Get user lessons error:', error);
      throw error;
    }
  },
  
  // Start a lesson
  async startLesson(lessonId: string): Promise<UserLesson> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const now = new Date().toISOString();
      
      // Check if the user has already started this lesson
      const { data: existingData, error: existingError } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();
      
      if (existingError) {
        throw new Error(handleSupabaseError(existingError));
      }
      
      // If the user has already started this lesson, return it
      if (existingData) {
        // Get performance records for this user lesson
        const { data: performanceData, error: perfError } = await supabase
          .from('lesson_performances')
          .select('*')
          .eq('user_lesson_id', existingData.id);
        
        if (perfError) {
          throw new Error(handleSupabaseError(perfError));
        }
        
        // Convert performance records
        const performances: LessonPerformance[] = performanceData.map(perf => ({
          id: perf.id,
          userLessonId: perf.user_lesson_id,
          date: perf.date,
          score: perf.score,
          duration: perf.duration,
          metrics: perf.metrics,
        }));
        
        return {
          id: existingData.id,
          userId: existingData.user_id,
          lessonId: existingData.lesson_id,
          progress: existingData.progress,
          completed: existingData.completed,
          startedAt: existingData.started_at,
          completedAt: existingData.completed_at || undefined,
          performances,
        };
      }
      
      // Otherwise, create a new user lesson
      const userLessonId = uuidv4();
      const { error } = await supabase
        .from('user_lessons')
        .insert({
          id: userLessonId,
          user_id: authData.user.id,
          lesson_id: lessonId,
          progress: 0,
          completed: false,
          started_at: now,
        });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Return the new user lesson
      return {
        id: userLessonId,
        userId: authData.user.id,
        lessonId,
        progress: 0,
        completed: false,
        startedAt: now,
        performances: [],
      };
    } catch (error: any) {
      console.error('Start lesson error:', error);
      throw error;
    }
  },
  
  // Update lesson progress
  async updateLessonProgress(userLessonId: string, progress: number, completed: boolean = false): Promise<UserLesson> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const now = new Date().toISOString();
      const updateData: any = { progress };
      
      if (completed) {
        updateData.completed = true;
        updateData.completed_at = now;
      }
      
      // Update the user lesson
      const { error } = await supabase
        .from('user_lessons')
        .update(updateData)
        .eq('id', userLessonId)
        .eq('user_id', authData.user.id);
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Get the updated user lesson
      const { data, error: getError } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('id', userLessonId)
        .single();
      
      if (getError || !data) {
        throw new Error(getError ? handleSupabaseError(getError) : 'User lesson not found');
      }
      
      // Get performance records for this user lesson
      const { data: performanceData, error: perfError } = await supabase
        .from('lesson_performances')
        .select('*')
        .eq('user_lesson_id', userLessonId);
      
      if (perfError) {
        throw new Error(handleSupabaseError(perfError));
      }
      
      // Convert performance records
      const performances: LessonPerformance[] = performanceData.map(perf => ({
        id: perf.id,
        userLessonId: perf.user_lesson_id,
        date: perf.date,
        score: perf.score,
        duration: perf.duration,
        metrics: perf.metrics,
      }));
      
      // Return the updated user lesson
      return {
        id: data.id,
        userId: data.user_id,
        lessonId: data.lesson_id,
        progress: data.progress,
        completed: data.completed,
        startedAt: data.started_at,
        completedAt: data.completed_at || undefined,
        performances,
      };
    } catch (error: any) {
      console.error('Update lesson progress error:', error);
      throw error;
    }
  },
  
  // Record performance for a lesson
  async recordLessonPerformance(userLessonId: string, score: number, duration: number, metrics: any): Promise<LessonPerformance> {
    try {
      const performanceId = uuidv4();
      const now = new Date().toISOString();
      
      // Insert the performance record
      const { error } = await supabase
        .from('lesson_performances')
        .insert({
          id: performanceId,
          user_lesson_id: userLessonId,
          date: now,
          score,
          duration,
          metrics,
        });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Return the new performance
      return {
        id: performanceId,
        userLessonId,
        date: now,
        score,
        duration,
        metrics,
      };
    } catch (error: any) {
      console.error('Record lesson performance error:', error);
      throw error;
    }
  },
};
