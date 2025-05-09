
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/types/database.types";

// Log activity and reward XP
export const logUserActivity = async (
  userId: string,
  activityType: string,
  xp: number = 10,
  metadata: Json = {}
) => {
  if (!userId) return;
  await supabase.from("user_activity").insert({
    id: uuidv4(),
    user_id: userId,
    activity_type: activityType,
    xp_earned: xp,
    metadata,
  });
};

// Unlock achievement for user
export const unlockAchievement = async (
  userId: string,
  achievementType: string
) => {
  if (!userId) return;
  // Get achievement id
  const { data: achievement } = await supabase
    .from("achievements")
    .select("id")
    .eq("type", achievementType)
    .single();
  if (!achievement?.id) return;

  // Check if already unlocked
  const { data: exists } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievement.id)
    .maybeSingle();
  if (exists) return;

  await supabase.from("user_achievements").insert({
    user_id: userId,
    achievement_id: achievement.id,
  });
};

export const getUserProgress = async (userId: string) => {
  if (!userId) return null;
  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
};

export const getUserAchievements = async (userId: string) => {
  if (!userId) return [];
  const { data } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievement_id(name, description, icon, xp_reward)")
    .eq("user_id", userId);
  return data ?? [];
};

// Function to get streak information
export const getUserStreak = async (userId: string) => {
  if (!userId) return { currentStreak: 0, lastActivity: null };
  
  const { data } = await supabase
    .from("user_progress")
    .select("streak_days, last_activity_date")
    .eq("user_id", userId)
    .single();
    
  return {
    currentStreak: data?.streak_days || 0,
    lastActivity: data?.last_activity_date || null
  };
};

// Function to get user level and XP
export const getUserLevelAndXp = async (userId: string) => {
  if (!userId) return { level: 1, xp: 0, xpForNextLevel: 100 };
  
  const { data } = await supabase
    .from("user_progress")
    .select("level, xp_points")
    .eq("user_id", userId)
    .single();
    
  if (!data) return { level: 1, xp: 0, xpForNextLevel: 100 };
  
  // Calculate XP needed for next level (simplified formula)
  const xpForNextLevel = Math.pow(data.level + 1, 2) * 100;
  
  return {
    level: data.level,
    xp: data.xp_points,
    xpForNextLevel
  };
};

// Function to get recent activities for gamification feed
export const getRecentActivities = async (userId: string, limit: number = 10) => {
  if (!userId) return [];
  
  const { data } = await supabase
    .from("user_activity")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
    
  return data || [];
};

// Function to get leaderboard
export const getLeaderboard = async (limit: number = 10) => {
  const { data } = await supabase
    .from("user_progress")
    .select("user_id, xp_points, level, users(name, avatar_url)")
    .order("xp_points", { ascending: false })
    .limit(limit);
    
  return data || [];
};
