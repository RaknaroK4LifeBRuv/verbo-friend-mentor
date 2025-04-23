
import { supabase } from '@/lib/supabase';

export const listenToUserProgress = (userId: string, onUpdate: (data: any) => void) => {
  if (!userId) return { unsubscribe: () => {} };
  
  const channel = supabase
    .channel('user-progress-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();
  
  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
};

export const listenToUserLessons = (userId: string, onUpdate: (data: any) => void) => {
  if (!userId) return { unsubscribe: () => {} };
  
  const channel = supabase
    .channel('user-lessons-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_lessons',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();
  
  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
};

export const listenToUserAchievements = (userId: string, onUpdate: (data: any) => void) => {
  if (!userId) return { unsubscribe: () => {} };
  
  const channel = supabase
    .channel('user-achievements-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_achievements',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();
  
  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    }
  };
};
